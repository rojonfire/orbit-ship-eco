# Planilla de solicitudes de factura

Cuando alguien marca "Necesito factura" en el carrito, los datos viajan como atributos del pedido y quedan guardados en la orden de Shopify.

La planilla se llena **sola, y solo cuando la compra fue pagada**. No la escribe el sitio web: la escribe Shopify mediante un webhook. Así nunca aparecen facturas de compras que quedaron a medias.

```
Clienta marca "Necesito factura" y paga
        ↓
Shopify registra la orden con los datos
        ↓  (solo si el pago se aprobó)
Webhook orders/paid → Apps Script → fila en la planilla
```

## 1. La planilla

Encabezados en la primera fila:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Fecha | N° orden | RUT | Razón social | Giro | Dirección | Total | Estado | OC |

**OC** la agregó Belén el 2026-08-21: desde que se exige orden de compra del cliente para emitir, esta columna se lleva aparte de "Estado" con dos valores: `Solicitada` (mail ya enviado) → `Recibida` (llegó la OC, ya se puede emitir en el SII).

## 2. El Apps Script

En la planilla: **Extensiones → Apps Script**. Borra todo y pega esto:

```javascript
function doPost(e) {
  const orden = JSON.parse(e.postData.contents);

  // Los datos del carrito llegan en note_attributes
  const attrs = {};
  (orden.note_attributes || []).forEach(function (a) {
    attrs[a.name] = a.value;
  });

  // Si el pedido no pidió factura, no se escribe nada.
  if (!attrs['Factura']) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, omitido: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Evita filas duplicadas si Shopify reintenta el webhook
  const ultimaFila = hoja.getLastRow();
  const numOrdenes = ultimaFila > 1
    ? hoja.getRange('B2:B' + ultimaFila).getValues().flat()
    : [];
  if (numOrdenes.indexOf(orden.name) !== -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, duplicado: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  hoja.appendRow([
    new Date(orden.created_at),
    orden.name,                        // Ej: #1042
    attrs['RUT'] || '',
    attrs['Razón social'] || '',
    attrs['Giro'] || '',
    attrs['Dirección comercial'] || '',
    Number(orden.total_price),
    'Pendiente',
    'Solicitada'
  ]);

  enviarMailSolicitudOC(orden);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function enviarMailSolicitudOC(orden) {
  const email = orden.email || orden.contact_email ||
    (orden.customer && orden.customer.email);
  if (!email) return;

  const asunto = 'Orden de compra para tu factura – Pedido ' + orden.name;
  const cuerpo =
    'Hola!\n\n' +
    'Junto con saludar, te escribo porque a partir de ahora, para poder emitir la factura correspondiente a tu compra, necesitamos que nos envíes una orden de compra con los siguientes datos:\n\n' +
    '• Nombre completo o razón social\n' +
    '• RUT\n' +
    '• Detalle de los productos o servicios solicitados\n' +
    '• Firma del representante legal de la empresa\n\n' +
    'Este cambio responde a nuevos requisitos de respaldo documental exigidos por el SII, así que te agradecemos desde ya la buena disposición.\n\n' +
    'Puedes enviarnos la orden de compra respondiendo este mismo correo (foto, PDF o escaneo, cualquier formato sirve). En cuanto la recibamos, procedemos a emitir tu factura sin problema.\n\n' +
    'Cualquier duda, quedo atenta.\n\n' +
    'Saludos,\nBelén\nOrbitabags SpA';

  GmailApp.sendEmail(email, asunto, cuerpo, { name: 'Belén · Orbitabags' });
}

// Función de un solo uso: ejecútala manualmente una vez para que Google
// pida el permiso de Gmail antes de desplegar. Después puedes borrarla.
function autorizarGmail() {
  GmailApp.getAliases();
}
```

Guarda con el disquete.

### Primera vez: autorizar el envío de Gmail

Como el script ahora usa `GmailApp`, necesita un permiso nuevo:

1. En el editor, en el selector de funciones (arriba, al lado de "Depurar"), elige **autorizarGmail**.
2. Click en **Ejecutar**. Va a pedir que revises permisos — acepta con tu cuenta de Google (la misma dueña de la planilla, porque el mail se envía desde esa cuenta).
3. Listo. Ya puedes borrar la función `autorizarGmail` si quieres, o dejarla, no molesta.

Si te saltas este paso, el webhook igual va a escribir la fila en la planilla, pero el envío del mail va a fallar silenciosamente (revisa **Ejecuciones** en el menú lateral del editor si un mail no llegó).

## 3. Volver a publicar

Como el código cambió, hay que subir una versión nueva:

**Implementar → Administrar implementaciones → ícono del lápiz (Editar) → Versión: Nueva versión → Implementar**

Importante: al editar la implementación existente **la URL no cambia**. Si en cambio creas una implementación nueva desde cero, la URL cambia y habría que actualizar el webhook.

## 4. Crear el webhook en Shopify

En el admin de Shopify: **Configuración → Notificaciones → Webhooks → Crear webhook**

- Evento: **Pago del pedido** (`orders/paid`)
- Formato: **JSON**
- URL: la del Apps Script (la que termina en `/exec`)
- Versión de la API: la más reciente

Guardar. Shopify ofrece un botón para **enviar una notificación de prueba** — úsalo y revisa que llegue una fila (la de prueba viene con datos ficticios y sin atributos de factura, así que probablemente se omita; eso también confirma que el filtro funciona).

## Cómo usarla

- La columna **Estado** la llevas tú: cámbiala a "Emitida" cuando la subas al SII y anota el folio si quieres.
- La columna **OC** también la llevas tú, pero la fila arranca sola en "Solicitada" (el script lo escribe y manda el mail al mismo tiempo). Cuando el cliente responda con la orden de compra, cámbiala a "Recibida" — ese es el gatillo para emitir la factura en el SII, no la compra en sí.
- Para que el contador la vea, basta con compartirle la planilla en modo lectura. No necesita acceso a Shopify.
- Si un pedido no pidió factura, no aparece en la planilla. Solo llegan los que la pidieron **y pagaron**.

## Notas

- El `total_price` que llega es el total real cobrado, incluyendo envío. Para la factura, el neto es total ÷ 1,19.
- Si alguna vez cambias el código del Apps Script, acuérdate del paso 3 (nueva versión), o los cambios no toman efecto.
- El webhook lo dispara Shopify desde sus servidores, así que la URL del script no queda expuesta en el código del sitio.
- El mail de solicitud de OC se manda una sola vez por pedido, apenas se escribe la fila — el chequeo de duplicados (columna B) evita que un reintento del webhook de Shopify mande el mail dos veces.
- El mail sale de la cuenta de Google dueña de la planilla (vía `GmailApp`), con ese nombre y correo como remitente — no hay que configurar SMTP ni nada aparte.
