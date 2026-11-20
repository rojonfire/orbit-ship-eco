/**
 * Post-build prerendering script — SIN Puppeteer.
 *
 * Para cada ruta:
 *   1. Inyecta meta tags estáticos (title, description, canonical, OG, Twitter)
 *   2. Para los blog posts, también inyecta el contenido HTML del artículo
 *      dentro del <div id="root">, así Googlebot lo ve sin ejecutar JS.
 *
 * El JS de React igual hidrata después y reemplaza el contenido — el usuario
 * no ve diferencia. Pero los crawlers ya tienen el HTML completo.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const SITE_URL = "https://orbitabags.cl";

// ─── Cargar blog posts dinámicamente desde el TS source ─────────────────
// Usamos un require/import dinámico del archivo TS compilado por Vite.
// Como blogPosts.ts es contenido puro (sin imports de React), lo parseamos
// extrayendo el array literal con un regex simple.

function loadBlogPosts() {
  const tsSource = fs.readFileSync(
    path.resolve(__dirname, "../src/data/blogPosts.ts"),
    "utf-8"
  );

  // Extraer cada bloque { ... } dentro del array
  const posts = [];
  const regex = /\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*coverImage:\s*"([^"]+)",\s*content:\s*`([\s\S]*?)`\s*\}/g;

  let m;
  while ((m = regex.exec(tsSource)) !== null) {
    posts.push({
      id: m[1],
      slug: m[2],
      title: m[3],
      excerpt: m[4],
      date: m[5],
      coverImage: m[6],
      content: m[7],
    });
  }

  return posts;
}

const blogPosts = loadBlogPosts();
console.log(`📚 Cargados ${blogPosts.length} blog posts desde src/data/blogPosts.ts`);

// ─── Cargar FAQs desde el TS source (mismo patrón que blogPosts) ─────────
function loadFaqs() {
  const tsSource = fs.readFileSync(
    path.resolve(__dirname, "../src/data/faqs.ts"),
    "utf-8"
  );

  const faqs = [];
  const regex = /\{\s*question:\s*"([^"]+)",\s*answer:\s*"([^"]+)",?\s*\}/g;

  let m;
  while ((m = regex.exec(tsSource)) !== null) {
    faqs.push({ question: m[1], answer: m[2] });
  }

  return faqs;
}

const faqs = loadFaqs();

// Precios de bolsas personalizadas, desde src/data/personalizadas.ts (misma fuente que la página)
function loadPersonalizadasPricing() {
  const src = fs.readFileSync(path.resolve(__dirname, "../src/data/personalizadas.ts"), "utf-8");
  const table = (name) => {
    const block = src.match(new RegExp(`${name}: number\\[\\]\\[\\] = \\[([\\s\\S]*?)\\];`))[1];
    return [...block.matchAll(/\[([\d,\s]+)\]/g)].map((r) => r[1].split(",").map((n) => Number(n.trim())));
  };
  const sizes = [...src.match(/PERSONALIZADA_SIZES = \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return { sizes, p100: table("PRICING_100"), p200: table("PRICING_200") };
}

const pers = loadPersonalizadasPricing();
const persTable = (caption, rows) => `<table>
          <caption>${caption}</caption>
          <tr><th>Tamaño</th><th>1 color</th><th>2 colores</th><th>3 colores</th><th>4 colores</th></tr>
          ${rows.map((r, i) => `<tr><td>${pers.sizes[i]}</td>${r.map((n) => `<td>$${clp(n)}</td>`).join("")}</tr>`).join("\n          ")}
        </table>`;
const personalizadasTables = `<h2>Precios por bolsa (IVA incluido)</h2>
        ${persTable("Desde 200 unidades (mismo precio pidas 200 o 5.000)", pers.p200)}
        ${persTable("De 100 a 199 unidades", pers.p100)}`;
console.log(`❓ Cargadas ${faqs.length} preguntas frecuentes desde src/data/faqs.ts`);

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

// ─── Productos (handles + meta) ──────────────────────────────────────────
// Precios de los packs de 100 (IVA incl.). Copiados de Shopify: si cambian allá, actualizarlos acá
// para que los crawlers y los asistentes de IA (ChatGPT, etc.) no citen precios viejos.
const shopProducts = [
  { handle: "bolsa-biodegradable-20x30-cm", size: "20x30", prices: [9996] },
  { handle: "bolsa-biodegradable-30x40-cm", size: "30x40", prices: [15946] },
  { handle: "bolsa-biodegradable-40x50-cm", size: "40x50", prices: [27990] },
  { handle: "bolsa-biodegradable-50x60-cm", size: "50x60", prices: [34990, 39900], note: "blanca $34.990, negra $39.900" },
].map((p) => {
  const low = Math.min(...p.prices);
  const high = Math.max(...p.prices);
  const priceText = p.note ?? `$${clp(low)}`;
  return {
    ...p,
    low,
    high,
    priceText,
    title: `Bolsa Courier Compostable ${p.size} cm | Orbita Bags`,
    description: `Bolsa courier compostable en casa ${p.size} cm, blanca o negra, con doble adhesivo para envío y devolución. Pack de 100 unidades: ${priceText} IVA incluido. Certificación OK Compost HOME.`,
  };
});

function clp(n) {
  return n.toLocaleString("es-CL");
}

const productJsonLd = (p) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Bolsa Courier Compostable ${p.size} cm (pack de 100)`,
    description: p.description,
    brand: { "@type": "Brand", name: "Orbita Bags" },
    url: `${SITE_URL}/shop/${p.handle}/`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CLP",
      lowPrice: p.low,
      highPrice: p.high,
      availability: "https://schema.org/InStock",
    },
  });

const productList = shopProducts
  .map((p) => `<li><a href="/shop/${p.handle}">Bolsa Compostable ${p.size} cm</a>: pack de 100 a ${p.priceText}</li>`)
  .join("\n          ");

// ─── Configuración de cada ruta ─────────────────────────────────────────
const ROUTES = [
  {
    path: "/",
    title: "ORBITA BAGS | Bolsas courier compostables en casa para ecommerce en Chile",
    description: "Bolsas courier 100% compostables en casa para ecommerce en Chile. Packaging sustentable con doble adhesivo, ideales para tiendas online que quieren reducir su huella ambiental.",
    body: `
      <main>
        <h1>Bolsas courier compostables en casa para ecommerce en Chile</h1>
        <p>En ORBITA BAGS fabricamos bolsas courier 100% compostables en casa, certificadas OK Compost HOME y norma EN 13432. Packaging sustentable con doble adhesivo para envío y devolución, ideal para tiendas online que quieren reducir su huella ambiental sin sacrificar margen.</p>
        <h2>Por qué elegir Orbita Bags</h2>
        <ul>
          <li>Compostables en casa en 180 días — no requieren plantas industriales</li>
          <li>Doble adhesivo: una cinta para el envío, otra para la devolución</li>
          <li>Certificación OK Compost HOME (TÜV Austria)</li>
          <li>Disponibles en 4 tamaños (20x30, 30x40, 40x50 y 50x60 cm), en blanco o negro</li>
          <li>Hechas para ecommerce chileno</li>
        </ul>
        <h2>Tamaños disponibles</h2>
        <p>Ofrecemos cuatro tamaños de bolsas courier compostables para cubrir las necesidades de ecommerce de cualquier categoría: ropa, accesorios, libros y envíos voluminosos. Se venden en packs de 100 unidades, IVA incluido:</p>
        <ul>
          ${productList}
        </ul>
        <h2>Bolsas personalizadas con tu logo</h2>
        <p>También imprimimos tu logo en serigrafía en Chile, hasta 4 colores, desde 100 unidades y desde $510 por bolsa. <a href="/personalizadas">Ver bolsas personalizadas</a>.</p>
      </main>
    `,
  },
  {
    path: "/tienda",
    title: "Tienda | Bolsas Courier Compostables — Orbita Bags",
    description: "Compra bolsas courier compostables en casa para tu ecommerce, en packs de 100 desde $9.996. Doble adhesivo, certificación OK Compost HOME, 4 tamaños en blanco o negro.",
    body: `
      <main>
        <h1>Tienda — Bolsas Courier Compostables</h1>
        <p>Compra bolsas courier compostables en casa para tu ecommerce en Chile. Todas con doble adhesivo y certificación OK Compost HOME, en 4 tamaños y en blanco o negro. Se venden en packs de 100 unidades, IVA incluido, con despacho a todo Chile.</p>
        <ul>
          ${productList}
        </ul>
      </main>
    `,
  },
  {
    path: "/equipo",
    title: "Equipo | Orbita Bags — Quiénes somos",
    description: "Conoce al equipo detrás de Orbita Bags, la startup chilena que hace packaging sustentable accesible para el ecommerce.",
    body: `
      <main>
        <h1>Nuestro equipo</h1>
        <p>Orbita Bags es una startup chilena fundada para hacer el packaging sustentable accesible al ecommerce. Creemos que cada pedido despachado es una oportunidad para reducir el impacto ambiental sin complicar la operación de las tiendas.</p>
      </main>
    `,
  },
  {
    path: "/blog",
    title: "Blog | Orbita Bags — Packaging Sustentable para Ecommerce",
    description: "Artículos sobre sustentabilidad, compostaje y packaging ecológico para ecommerce en Chile.",
    body: `
      <main>
        <h1>Blog — Packaging Sustentable para Ecommerce</h1>
        <p>Ideas, guías y novedades sobre packaging sustentable y ecommerce responsable.</p>
        <ul>
          ${blogPosts.map((p) => `<li><a href="/blog/${p.slug}">${p.title}</a> — ${p.excerpt}</li>`).join("\n          ")}
        </ul>
      </main>
    `,
  },
  {
    path: "/faq",
    title: "Preguntas Frecuentes | Orbita Bags — Bolsas courier compostables",
    description: "Respuestas a las preguntas más comunes sobre bolsas courier compostables en casa: certificación OK Compost HOME, tiempos de compostaje, tamaños, doble adhesivo y envíos en Chile.",
    body: `
      <main>
        <h1>Preguntas frecuentes sobre bolsas courier compostables</h1>
        <p>Respuestas directas a las dudas más comunes sobre las bolsas Orbita: certificaciones, compostaje en casa, tamaños, doble adhesivo y envíos en Chile.</p>
        ${faqs.map((f) => `<section>\n          <h2>${f.question}</h2>\n          <p>${f.answer}</p>\n        </section>`).join("\n        ")}
        <script type="application/ld+json">${faqJsonLd}</script>
      </main>
    `,
  },
  {
    path: "/personalizadas",
    title: "Bolsas Personalizadas con tu Logo | ORBITA BAGS",
    description: "Personaliza tus bolsas courier compostables con tu logo. Serigrafía hecha en Chile, hasta 4 colores, desde 100 unidades. Compra en línea, con checkout inmediato.",
    body: `
      <main>
        <h1>Bolsas Personalizadas con tu Logo</h1>
        <p>Las mismas bolsas courier compostables en casa, con doble sello adhesivo, ahora impresas con tu marca. Serigrafía hecha en Chile, hasta 4 colores, desde 100 unidades. Se compran online y llegan en unos 10 días hábiles desde el pago. Si tu logo no está vectorizado, lo vectorizamos sin costo.</p>
        ${personalizadasTables}
      </main>
    `,
  },
  {
    path: "/herramientas/generador-oc",
    title: "Generador de Orden de Compra (OC) gratis | Orbita Bags",
    description: "Genera tu Orden de Compra en PDF gratis: sirve para cualquier proveedor, no solo para comprarle a Orbita Bags. Completa los datos, firma y descarga — listo para tu contabilidad y el SII.",
    body: `
      <main>
        <h1>Generador de Orden de Compra (OC) gratuito</h1>
        <p>Herramienta gratuita de Orbita Bags para generar una Orden de Compra en PDF: sirve para cualquier proveedor, no solo para comprarnos a nosotros. Completa los datos del proveedor y del comprador, el detalle del pedido, firma y descarga el PDF listo para tu contabilidad.</p>
      </main>
    `,
  },
  // Blog posts — con contenido completo
  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    title: `${p.title} | Orbita Bags`,
    description: p.excerpt,
    lastmod: p.date,
    body: `
      <main>
        <article>
          <h1>${p.title}</h1>
          <p><time datetime="${p.date}">${p.date}</time></p>
          <p><em>${p.excerpt}</em></p>
          ${p.content}
        </article>
      </main>
    `,
  })),
  // Shop products — solo meta tags (datos vienen de Shopify API)
  ...shopProducts.map((p) => ({
    path: `/shop/${p.handle}`,
    title: p.title,
    description: p.description,
    body: `
      <main>
        <h1>${p.title.split("|")[0].trim()}</h1>
        <p>${p.description}</p>
        <script type="application/ld+json">${productJsonLd(p)}</script>
      </main>
    `,
  })),
];

// ─── Helpers ─────────────────────────────────────────────────────────────

function injectMeta(html, { title, description, path: routePath, body }) {
  // Cloudflare Pages sirve las rutas prerenderizadas con slash final
  // (/tienda -> 308 -> /tienda/), así que el canonical debe llevarlo.
  const canonical = routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${routePath}/`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(description)}"`);

  // El hreflang de la plantilla apunta al home: corregirlo a la URL de cada página
  html = html.replace(/<link rel="alternate" hreflang="es-CL" href="[^"]*"/, `<link rel="alternate" hreflang="es-CL" href="${canonical}"`);

  // Canonical y og:url no existen en la plantilla: insertar (o reemplazar si aparecen)
  if (/<link rel="canonical"/.test(html)) {
    html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`);
  } else {
    html = html.replace(/<link rel="alternate" hreflang="es-CL"[^>]*\/>/, (m) => `${m}\n    <link rel="canonical" href="${canonical}" />`);
  }
  if (/<meta property="og:url"/.test(html)) {
    html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  } else {
    html = html.replace(/<meta property="og:type"[^>]*\/>/, (m) => `${m}\n    <meta property="og:url" content="${canonical}" />`);
  }
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeAttr(title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeAttr(description)}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeAttr(title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeAttr(description)}"`);

  // Anti-FOUC: ocultar #root hasta que CSS + JS carguen.
  // El crawler no ejecuta JS, así que ve el contenido igual.
  html = html.replace(
    "</head>",
    `<style id="a-f">#root{opacity:0}</style>\n</head>`
  );
  html = html.replace(
    "</body>",
    `<script>window.addEventListener('load',function(){var e=document.getElementById('a-f');e&&e.parentNode.removeChild(e)})</script>\n</body>`
  );

  // Inyectar el body dentro del <div id="root">
  // React lo va a hidratar/reemplazar al cargar, pero los crawlers lo ven inmediatamente
  if (body) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${body}</div>`
    );
  }

  return html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

// ─── Main ────────────────────────────────────────────────────────────────

// ─── Sitemap: se genera desde ROUTES, así los blogs nuevos entran solos ──

function routeUrl(routePath) {
  return routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${routePath}/`;
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = ROUTES.map((r) => {
    const isPost = r.path.startsWith("/blog/");
    const isProduct = r.path.startsWith("/shop/");
    const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(r.lastmod || "") ? r.lastmod : today;
    const changefreq = r.path === "/" || r.path === "/tienda" || r.path === "/blog" ? "weekly" : "monthly";
    const priority = r.path === "/" ? "1.0" : isProduct ? "0.9" : isPost ? "0.6" : "0.8";
    return `  <url>
    <loc>${routeUrl(r.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
  console.log(`🗺️  sitemap.xml generado con ${ROUTES.length} URLs.`);
}

async function prerender() {
  const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

  for (const route of ROUTES) {
    const html = injectMeta(indexHtml, route);
    const outDir = route.path === "/" ? DIST : path.join(DIST, route.path);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`  ✓ ${route.path}`);
  }

  generateSitemap();

  console.log(`\n✅ Prerendering completo — ${ROUTES.length} rutas generadas con contenido SEO.`);
}

prerender().catch((err) => {
  console.error("Prerender falló:", err);
  process.exit(1);
});
