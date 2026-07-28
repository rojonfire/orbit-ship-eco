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

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Fecha | N° orden | RUT | Razón social | Giro | Dirección | Total | Estado |

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

  hoja.appendRow([
    new Date(orden.created_at),
    orden.name,                        // Ej: #1042
    attrs['RUT'] || '',
    attrs['Razón social'] || '',
    attrs['Giro'] || '',
    attrs['Dirección comercial'] || '',
    Number(orden.total_price),
    'Pendiente'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Guarda con el disquete.

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
- Para que el contador la vea, basta con compartirle la planilla en modo lectura. No necesita acceso a Shopify.
- Si un pedido no pidió factura, no aparece en la planilla. Solo llegan los que la pidieron **y pagaron**.

## Notas

- El `total_price` que llega es el total real cobrado, incluyendo envío. Para la factura, el neto es total ÷ 1,19.
- Si alguna vez cambias el código del Apps Script, acuérdate del paso 3 (nueva versión), o los cambios no toman efecto.
- El webhook lo dispara Shopify desde sus servidores, así que la URL del script no queda expuesta en el código del sitio.
