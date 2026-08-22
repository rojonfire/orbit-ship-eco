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
const shopProducts = [
  { handle: "bolsa-biodegradable-15x20-cm", title: "Bolsa Courier Compostable 15x20 cm | Orbita Bags", description: "Bolsa courier compostable en casa 15x20 cm con doble adhesivo para envío y devolución. Certificación OK Compost HOME." },
  { handle: "bolsa-biodegradable-20x30-cm", title: "Bolsa Courier Compostable 20x30 cm | Orbita Bags", description: "Bolsa courier compostable en casa 20x30 cm con doble adhesivo para envío y devolución. Certificación OK Compost HOME." },
  { handle: "bolsa-biodegradable-30x40-cm", title: "Bolsa Courier Compostable 30x40 cm | Orbita Bags", description: "Bolsa courier compostable en casa 30x40 cm con doble adhesivo para envío y devolución. Certificación OK Compost HOME." },
  { handle: "bolsa-biodegradable-40x50-cm", title: "Bolsa Courier Compostable 40x50 cm | Orbita Bags", description: "Bolsa courier compostable en casa 40x50 cm con doble adhesivo para envío y devolución. Certificación OK Compost HOME." },
  { handle: "bolsa-biodegradable-50x60-cm", title: "Bolsa Courier Compostable 50x60 cm | Orbita Bags", description: "Bolsa courier compostable en casa 50x60 cm con doble adhesivo para envío y devolución. Certificación OK Compost HOME." },
];

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
          <li>Disponibles en 5 tamaños: 15x20, 20x30, 30x40, 40x50 y 50x60 cm</li>
          <li>Hechas para ecommerce chileno</li>
        </ul>
        <h2>Tamaños disponibles</h2>
        <p>Ofrecemos cinco tamaños de bolsas courier compostables para cubrir las necesidades de ecommerce de cualquier categoría: ropa, accesorios, libros, productos pequeños y envíos voluminosos.</p>
      </main>
    `,
  },
  {
    path: "/tienda",
    title: "Tienda | Bolsas Courier Compostables — Orbita Bags",
    description: "Compra bolsas courier compostables en casa para tu ecommerce. Doble adhesivo, certificación OK Compost HOME, disponibles en 5 tamaños.",
    body: `
      <main>
        <h1>Tienda — Bolsas Courier Compostables</h1>
        <p>Compra bolsas courier compostables en casa para tu ecommerce en Chile. Todas con doble adhesivo, certificación OK Compost HOME y disponibles en 5 tamaños.</p>
        <ul>
          <li><a href="/shop/bolsa-biodegradable-15x20-cm">Bolsa Compostable 15x20 cm</a></li>
          <li><a href="/shop/bolsa-biodegradable-20x30-cm">Bolsa Compostable 20x30 cm</a></li>
          <li><a href="/shop/bolsa-biodegradable-30x40-cm">Bolsa Compostable 30x40 cm</a></li>
          <li><a href="/shop/bolsa-biodegradable-40x50-cm">Bolsa Compostable 40x50 cm</a></li>
          <li><a href="/shop/bolsa-biodegradable-50x60-cm">Bolsa Compostable 50x60 cm</a></li>
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
        <p>Las mismas bolsas courier compostables en casa, con doble sello adhesivo, ahora impresas con tu marca. Serigrafía hecha en Chile, desde 100 unidades.</p>
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
