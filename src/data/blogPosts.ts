export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "¿Qué son las bolsas compostables y por qué importan?",
    slug: "que-son-bolsas-compostables",
    date: "2026-03-20",
    excerpt: "Descubre la diferencia entre biodegradable y compostable, y por qué elegir bolsas que realmente se integran al suelo en 180 días.",
    coverImage: "/placeholder.svg",
    content: `
      <h2>La diferencia entre biodegradable y compostable</h2>
      <p>Muchas personas confunden estos términos, pero la diferencia es clave. Una bolsa biodegradable simplemente se fragmenta en piezas más pequeñas con el tiempo, mientras que una bolsa compostable se descompone completamente en materia orgánica nutritiva para el suelo.</p>
      <p>En Orbita Bags, nuestras bolsas son <strong>compostables en casa</strong>, lo que significa que no necesitas una planta industrial para procesarlas. Simplemente ponlas en tu compostera o entiérralas en tu jardín.</p>
      <h2>¿Por qué 180 días?</h2>
      <p>Nuestras bolsas están certificadas para descomponerse completamente en 180 días bajo condiciones de compostaje doméstico. Esto contrasta con las bolsas plásticas convencionales que pueden tardar hasta 500 años en degradarse.</p>
      <h2>El impacto real</h2>
      <p>Cada bolsa compostable que reemplaza a una de plástico convencional evita que microplásticos contaminen nuestros océanos y suelos. Es un pequeño cambio con un impacto enorme cuando lo multiplicamos por miles de envíos.</p>
    `,
  },
  {
    title: "Guía para compostar en casa tus bolsas de envío",
    slug: "guia-compostar-en-casa",
    date: "2026-03-10",
    excerpt: "Paso a paso para compostar tus bolsas Orbita en el jardín o en un departamento. Más fácil de lo que piensas.",
    coverImage: "/placeholder.svg",
    content: `
      <h2>Lo que necesitas</h2>
      <p>No necesitas equipamiento sofisticado. Una compostera básica, tierra y restos orgánicos son suficientes para iniciar el proceso.</p>
      <h2>Paso 1: Corta la bolsa</h2>
      <p>Corta la bolsa en trozos pequeños para acelerar el proceso de descomposición. No es obligatorio, pero ayuda a que se integre más rápido al compost.</p>
      <h2>Paso 2: Mezcla con materia orgánica</h2>
      <p>Agrega los trozos junto con restos de frutas, verduras, hojas secas y otros materiales compostables. La clave es mantener un balance entre materiales húmedos y secos.</p>
      <h2>Paso 3: Mantén la humedad</h2>
      <p>Tu compostera debe estar húmeda pero no empapada. Revuelve cada semana para oxigenar el proceso y en unos meses tendrás tierra rica en nutrientes.</p>
      <h2>¿Vives en departamento?</h2>
      <p>Puedes usar una vermicompostera o simplemente enterrar los trozos en una maceta grande con tierra. Funciona igual de bien.</p>
    `,
  },
  {
    title: "Ecommerce sustentable: tendencias 2026 en Chile",
    slug: "ecommerce-sustentable-tendencias-2026",
    date: "2026-02-25",
    excerpt: "El packaging ecológico ya no es opcional. Conoce las tendencias que están definiendo el comercio electrónico responsable en Chile.",
    coverImage: "/placeholder.svg",
    content: `
      <h2>El consumidor chileno exige sustentabilidad</h2>
      <p>Según estudios recientes, más del 70% de los consumidores chilenos prefieren marcas con prácticas sustentables. El packaging es uno de los factores más visibles y evaluados al momento de la compra.</p>
      <h2>Regulación más estricta</h2>
      <p>Chile ha sido pionero en Latinoamérica con la ley REP (Responsabilidad Extendida del Productor) y la prohibición de bolsas plásticas. Las empresas de ecommerce deben adaptarse o enfrentar multas.</p>
      <h2>El doble sello: innovación logística</h2>
      <p>Las bolsas con doble sello adhesivo permiten que el cliente reutilice el mismo empaque para devoluciones, reduciendo a la mitad el material de packaging necesario.</p>
      <h2>El futuro es circular</h2>
      <p>Las marcas líderes están adoptando modelos de economía circular donde el packaging no es un desecho sino un recurso que vuelve a la tierra como nutriente.</p>
    `,
  },
  {
    title: "Cómo elegir el tamaño correcto de bolsa para tu producto",
    slug: "como-elegir-tamano-bolsa",
    date: "2026-02-15",
    excerpt: "No todas las bolsas sirven para todo. Te ayudamos a elegir el tamaño ideal según tu producto y optimizar costos de envío.",
    coverImage: "/placeholder.svg",
    content: `
      <h2>El tamaño importa (para tu bolsillo y el planeta)</h2>
      <p>Usar una bolsa demasiado grande para un producto pequeño no solo desperdicia material, también aumenta los costos de envío por volumen. Elegir el tamaño correcto es economía y ecología.</p>
      <h2>Nuestra guía de tamaños</h2>
      <p><strong>15x20 cm:</strong> Ideal para accesorios pequeños, joyería, cosméticos y muestras.</p>
      <p><strong>20x30 cm:</strong> Perfecto para camisetas, libros y productos medianos.</p>
      <p><strong>30x40 cm:</strong> Para ropa en general, zapatos y productos de tamaño estándar.</p>
      <p><strong>40x50 cm:</strong> Abrigos, conjuntos de ropa y productos voluminosos.</p>
      <p><strong>50x60 cm:</strong> Para pedidos múltiples o productos grandes como mantas y cojines.</p>
      <h2>Consejo pro</h2>
      <p>Si vendes productos de tamaños variados, te recomendamos tener al menos 2-3 tamaños diferentes. La inversión se recupera rápidamente en ahorro de envío y satisfacción del cliente.</p>
    `,
  },
];
