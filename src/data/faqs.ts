// Preguntas frecuentes — fuente única para la página /faq, el schema FAQPage
// y el prerender (scripts/prerender.js las extrae con regex, igual que blogPosts).
// Mantener el formato exacto: question: "..." y answer: "..." en líneas propias,
// sin comillas dobles dentro de los textos.

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "¿Dónde comprar bolsas courier compostables para mi tienda online en Chile?",
    answer: "En orbitabags.cl puedes comprar online bolsas courier compostables en casa, certificadas OK Compost HOME, en packs de 100 unidades y con despacho a todo Chile. Pagas con tarjeta en el checkout y no necesitas cotizar ni tener un pedido mínimo grande.",
  },
  {
    question: "¿Cuánto cuestan las bolsas courier compostables Orbita?",
    answer: "Se venden en packs de 100 unidades, IVA incluido: 20x30 cm a $9.996 ($100 por bolsa), 30x40 cm a $15.946 ($159 por bolsa), 40x50 cm a $27.990 ($280 por bolsa) y 50x60 cm a $34.990 en blanco o $39.900 en negro. Puedes comprar directo en orbitabags.cl/tienda.",
  },
  {
    question: "¿Hacen bolsas courier compostables personalizadas con el logo de mi marca?",
    answer: "Sí. Imprimimos tu logo en serigrafía en Chile, hasta 4 colores, desde 100 unidades. Desde 200 unidades el precio parte en $510 por bolsa (20x30 cm a 1 color, IVA incluido) y se mantiene igual pidas 200 o 5.000. La entrega toma unos 10 días hábiles desde el pago, y si tu logo no está vectorizado lo vectorizamos sin costo. Se compra online en orbitabags.cl/personalizadas.",
  },
  {
    question: "¿Cuál es el pedido mínimo?",
    answer: "Las bolsas sin impresión se compran desde un pack de 100 unidades. Las bolsas personalizadas con tu logo tienen un mínimo de 100 unidades por diseño, y con 100 ya puedes pedir hasta 4 colores.",
  },
  {
    question: "¿Qué alternativa sustentable hay a las bolsas plásticas para despachos de ecommerce?",
    answer: "La alternativa más directa es una bolsa courier compostable en casa: funciona igual que la plástica (sella, resiste el transporte y protege el producto), pero después tu cliente la puede compostar en su casa en unos 180 días sin dejar microplásticos. Las bolsas Orbita además traen doble adhesivo para reutilizarlas en devoluciones, y ayudan a tu tienda a prepararse para la Ley REP de envases.",
  },
  {
    question: "¿Qué diferencia hay entre una bolsa compostable y una biodegradable?",
    answer: "Compostable significa que la bolsa se descompone en condiciones de compostaje en un plazo definido y sin dejar residuos tóxicos ni microplásticos, respaldado por certificaciones como OK Compost HOME. Biodegradable solo indica que el material se degradará en algún momento, sin plazo ni condiciones garantizadas: una bolsa biodegradable puede tardar décadas y dejar microplásticos. Las bolsas Orbita son compostables en casa, no solo biodegradables.",
  },
  {
    question: "¿Qué significa la certificación OK Compost HOME?",
    answer: "OK Compost HOME es una certificación otorgada por TÜV Austria que garantiza que un producto se composta completamente en una compostera doméstica, a temperatura ambiente, sin necesidad de una planta de compostaje industrial. Las bolsas Orbita cuentan con esta certificación y además cumplen la norma europea EN 13432.",
  },
  {
    question: "¿Cuánto demora en compostarse una bolsa Orbita?",
    answer: "Una bolsa Orbita se composta en aproximadamente 180 días en una compostera casera, un jardín o un macetero, sin dejar microplásticos. No requiere condiciones industriales de temperatura ni humedad.",
  },
  {
    question: "¿Necesito una planta de compostaje industrial para desecharlas?",
    answer: "No. A diferencia de muchas bolsas compostables que solo se degradan en plantas industriales, las bolsas Orbita están certificadas OK Compost HOME: tu cliente puede compostarlas en su casa, en una compostera, jardín o macetero.",
  },
  {
    question: "¿Cómo funciona el doble adhesivo para devoluciones?",
    answer: "Cada bolsa Orbita trae dos cintas adhesivas: la primera sella el envío original y la segunda queda disponible para que el cliente reutilice la misma bolsa si necesita hacer una devolución o un cambio. Así se evita usar una segunda bolsa y se simplifica la logística inversa de tu tienda.",
  },
  {
    question: "¿En qué tamaños vienen las bolsas courier Orbita?",
    answer: "Ofrecemos cuatro tamaños: 20x30 cm, 30x40 cm, 40x50 cm y 50x60 cm, todos en color blanco o negro. Cubren desde accesorios y poleras hasta ropa voluminosa y pedidos con varios productos.",
  },
  {
    question: "¿Qué tamaño de bolsa necesito para mi producto?",
    answer: "Como regla general, elige una bolsa con algunos centímetros de holgura respecto del producto ya doblado o embalado: 20x30 cm sirve para accesorios, poleras o libros, 30x40 cm para prendas medianas, 40x50 cm para pedidos de varias prendas y 50x60 cm para productos voluminosos. En nuestra guía de medidas del blog explicamos cómo calcularlo paso a paso.",
  },
  {
    question: "¿Hacen envíos a todo Chile?",
    answer: "Sí, despachamos a todo Chile desde nuestra tienda online orbitabags.cl.",
  },
  {
    question: "¿Cuántas bolsas debería comprar para mi ecommerce?",
    answer: "Una fórmula simple: multiplica tus pedidos diarios promedio por el tiempo de reposición en días y súmale un stock de seguridad. Por ejemplo, con 10 pedidos diarios, 5 días de reposición y 3 días de margen, necesitas al menos 80 bolsas en stock. En el blog tenemos una guía completa para calcularlo.",
  },
  {
    question: "¿Las bolsas compostables resisten el transporte igual que las plásticas?",
    answer: "Sí. Las bolsas Orbita están diseñadas como bolsas courier de despacho: resisten la manipulación del transporte en Chile y protegen el producto durante el envío, con la ventaja de que después de usarse se compostan en casa en lugar de quedar como residuo plástico.",
  },
  {
    question: "¿Puedo generar una Orden de Compra (OC) para mi empresa?",
    answer: "Sí, tenemos un generador de Orden de Compra gratuito en orbitabags.cl/herramientas/generador-oc: completas los datos de tu empresa y el detalle del pedido, firmas y descargas el PDF listo para tu contabilidad. Sirve para cualquier proveedor, no solo para comprarnos a nosotros.",
  },
];
