

# Mi opinión como experto en web y SEO

## Lo que está bien del plan actual

1. **Estructura de página correcta** — La jerarquía Hero → Producto → Beneficios → Proceso → Contacto → CTA → Footer es un flujo de conversión sólido.
2. **Uso de `<main>`** ya está implementado en Index.tsx.
3. **Keywords geográficas** — Apuntar a "Chile" es clave para SEO local, ya que compites en un nicho específico.

## Lo que le falta o mejoraría

### Propuesta de valor — Ajustes importantes

1. **"Biodegradable" vs "Compostable"** — En varios textos se usa "biodegradable" (ProductOverview dice "Bolsa Biodegradable Premium", "100% Biodegradable"). Esto es un error de posicionamiento. "Compostable en casa" es mucho más específico y diferenciador. Hay que unificar el lenguaje.

2. **El doble sello no aparece en ningún lado** — Es un diferenciador enorme que hoy no existe en la página. No solo hay que mencionarlo: merece su propia card visual en WhyOrbita y una mención en ProductOverview.

3. **DecompositionSection dice "compost" pero no aclara que es domiciliario** — Hay que ser explícitos: "en el compost de tu jardín, sin planta industrial".

4. **ProductOverview tiene un CTA redundante** ("Arma tu pedido") — Ya tenemos el Hero CTA. Este debería diferenciarse o eliminarse para no competir.

### SEO — Lo que falta es crítico

1. **No hay JSON-LD** — Google no puede entender qué es tu negocio ni tus productos. Sin structured data, pierdes rich snippets.
2. **No hay sitemap.xml** — Google no puede indexar eficientemente.
3. **No hay canonical URL** — Riesgo de contenido duplicado.
4. **Los alt tags son genéricos** — El logo dice "ORBITA BAGS", la imagen de producto dice "Bolsas Orbita Biodegradables" (debería decir "compostables").
5. **H1 del Hero no tiene keywords** — "Envíos que nutren la tierra" es poético pero Google no sabe de qué trata. Debería incluir "bolsas compostables" o "bolsas courier Chile".
6. **Footer tiene links muertos** — Todos apuntan a `#`. Esto es negativo para SEO y UX.
7. **No hay hreflang** — Para indicar que el contenido es español de Chile.

## Plan revisado y priorizado

### Fase 1: Propuesta de valor (alto impacto en conversión)

**HeroSection.tsx**
- Tag: "100% Compostable" → "Compostable en casa 🌱"
- H1: Incluir "bolsas compostables" naturalmente, ej: "Bolsas courier que nutren la tierra"
- Descripción: Mencionar compostaje domiciliario y doble sello
- Card visual: Cambiar "0% plástico" por "Doble sello" con subtexto "envío + devolución"

**WhyOrbita.tsx**
- Card 1: "Compostable en casa" — enfatizar que no necesita planta industrial
- Card 2: Mantener "Resistente de verdad"
- Card 3: Cambiar a "Doble sello adhesivo" — ciclo envío → devolución → compostaje
- Trust badges: "OK Compost HOME" en vez de solo "OK Compost"

**ProductOverview.tsx**
- Cambiar "Biodegradable" por "Compostable en casa" en todos los textos
- Agregar feature "Doble sello" reemplazando uno existente
- Alt tag de imagen: "Bolsas courier compostables Orbita - envío y devolución Chile"

**DecompositionSection.tsx**
- Agregar "en tu jardín" o "sin planta industrial" al texto
- Stage final: "Vuelve a la tierra de tu jardín"

### Fase 2: SEO técnico

**index.html**
- Meta description optimizada con: "bolsas compostables en casa", "doble sello para devoluciones", "Chile"
- JSON-LD: Organization + Product
- Canonical URL + hreflang es-CL

**public/sitemap.xml** (nuevo)
- URLs: /, /tienda, /equipo

**public/robots.txt**
- Agregar: `Sitemap: https://orbit-ship-eco.lovable.app/sitemap.xml`

### Fase 3: SEO de contenido

- Footer: texto descriptivo con keywords naturales
- Eliminar o redirigir links muertos del footer
- Alt tags optimizados en todas las imágenes
- Verificar jerarquía H1 → H2 → H3 en cada página

### Archivos a modificar
- `src/components/HeroSection.tsx`
- `src/components/WhyOrbita.tsx`
- `src/components/ProductOverview.tsx`
- `src/components/DecompositionSection.tsx`
- `src/components/Footer.tsx`
- `index.html`
- `public/sitemap.xml` (nuevo)
- `public/robots.txt`

