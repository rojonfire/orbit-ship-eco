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
  // Blog posts — con contenido completo
  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    title: `${p.title} | Orbita Bags`,
    description: p.excerpt,
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
  const canonical = `${SITE_URL}${routePath}`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(description)}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeAttr(title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeAttr(description)}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeAttr(title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeAttr(description)}"`);

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

async function prerender() {
  const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

  for (const route of ROUTES) {
    const html = injectMeta(indexHtml, route);
    const outDir = route.path === "/" ? DIST : path.join(DIST, route.path);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`  ✓ ${route.path}`);
  }

  console.log(`\n✅ Prerendering completo — ${ROUTES.length} rutas generadas con contenido SEO.`);
}

prerender().catch((err) => {
  console.error("Prerender falló:", err);
  process.exit(1);
});
