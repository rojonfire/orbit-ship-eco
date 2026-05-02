## Cambio de copy en el Hero

**Archivo:** `src/components/HeroSection.tsx`

### 1. Nuevo titular (línea 17-21)
Reemplazar:
> Bolsas courier
> que **nutren** la tierra

Por:
> Bolsas courier compostables
> para **ir y volver**

Estructura: "Bolsas courier compostables" en la primera línea, "para ir y volver" en la segunda con "ir y volver" en color primario (verde) para mantener el énfasis visual.

### 2. Ajustes en las 3 tarjetas de la derecha
El titular nuevo es un poco más largo (suma "compostables"), así que para que la columna derecha siga alineada visualmente:

- **Reducir tamaño del número/título grande** de las cards: `text-2xl md:text-3xl` → `text-xl md:text-2xl` para que las tarjetas ocupen un poco menos de alto.
- **Acortar copy interno** donde sea posible:
  - "días en tu jardín" → "días en jardín"
  - "envío + devolución" → se mantiene (ya es corto)
  - "tamaños disponibles" → "tamaños"

Esto mantiene las 3 cards (180 días / Doble sello / 4 tamaños) compactas y alineadas con la altura del bloque de texto a la izquierda.

### Notas
- No se toca el subtítulo ni el botón CTA.
- El cambio refuerza el mensaje de doble uso (envío + devolución) que ya está en el subtítulo y en la card "Doble sello".