## Problema

En `/tienda` cada producto muestra solo la primera imagen, así que no se ve que existen las versiones **negra** y **blanca** hasta entrar al detalle.

## Recomendación: NO duplicar productos

Duplicar el producto en Shopify rompe la lógica actual (un solo producto con variantes Color × Pack), ensucia el catálogo y duplica reseñas/inventario futuro. Lo correcto en ecommerce es **un producto con swatches de color visibles en la card**, igual que hacen Zara, Allbirds, etc.

## Solución propuesta

En `src/pages/Tienda.tsx`, dentro de cada `ProductCard`:

1. **Estado local** `selectedColor` por card (default: primer color de las variantes).
2. **Imagen dinámica**: la card muestra la imagen asociada al color seleccionado.
   - Mapeo: buscar en `product.node.images.edges` la imagen cuyo `altText` contenga el nombre del color (ej. "Blanca"/"Negra"). Fallback: índice por orden del array `options.Color.values`.
3. **Swatches debajo del título**: dos circulitos (negro y blanco con borde) clickeables. El seleccionado lleva ring `primary`.
4. **Hover**: al pasar el mouse sobre un swatch, preview de la imagen sin necesidad de click (mejora UX desktop).
5. El link a `/shop/[handle]` agrega `?color=Negra` para que `ShopProduct.tsx` preseleccione esa variante al abrir.

## Cambios técnicos

- **`src/pages/Tienda.tsx`**: extraer la card a un sub-componente `ProductCard` con `useState` para `selectedColor`. Renderizar swatches usando `product.node.options.find(o => o.name === "Color")?.values`.
- **`src/pages/ShopProduct.tsx`**: leer `?color=` con `useSearchParams` y, si está presente y es válido, usarlo como `selectedColor` inicial en lugar de `colorOption.values[0]`.
- **Requisito en Shopify**: cada imagen del producto debe tener `altText` con el color ("Blanca" o "Negra") para el matching. Si no, hago el fallback por índice. Te confirmo después de implementar si hace falta que ajustes los alt en Shopify Admin.

## Resultado

En la grilla se ven las dos versiones de la misma bolsa, el cliente puede previsualizar el color sin entrar, y al hacer click ya entra con el color preseleccionado. Sin duplicar productos ni romper el carrito/checkout.
