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
    answer: "Ofrecemos cinco tamaños: 15x20 cm, 20x30 cm, 30x40 cm, 40x50 cm y 50x60 cm. Cubren desde accesorios y joyería hasta ropa voluminosa y pedidos con varios productos.",
  },
  {
    question: "¿Qué tamaño de bolsa necesito para mi producto?",
    answer: "Como regla general, elige una bolsa con algunos centímetros de holgura respecto del producto ya doblado o embalado: 15x20 cm sirve para joyería y accesorios pequeños, 20x30 cm para poleras o libros, 30x40 cm para prendas medianas, 40x50 cm para pedidos de varias prendas y 50x60 cm para productos voluminosos. En nuestra guía de medidas del blog explicamos cómo calcularlo paso a paso.",
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
