/**
 * Post-build prerendering script.
 * Serves the Vite `dist` folder, visits each route with Puppeteer,
 * and saves the fully-rendered HTML back to disk so crawlers can
 * index the pages without executing JavaScript.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");

const ROUTES = [
  "/",
  "/tienda",
  "/equipo",
  "/blog",
  "/blog/compostable-vs-biodegradable",
  "/blog/como-elegir-bolsas-courier-ecommerce",
  "/blog/packaging-habla-de-tu-marca",
  "/blog/ser-sustentable-sin-sacrificar-margen",
  "/blog/guia-medidas-bolsas-courier",
  "/blog/checklist-primeros-100-pedidos",
  "/blog/tendencias-packaging-sustentable-2026",
  "/blog/plastico-en-el-ecommerce",
  "/blog/packaging-personalizado-vale-la-pena",
  "/blog/como-reducir-devoluciones-con-packaging",
  "/blog/ley-rep-chile-ecommerce-packaging",
  "/blog/5-errores-packaging-ecommerce",
  "/blog/unboxing-redes-sociales-ecommerce",
  "/blog/calcular-cuantas-bolsas-courier-necesitas",
];

const PORT = 4173;

async function prerender() {
  // Dynamically import puppeteer so we only need it at build time
  const puppeteer = (await import("puppeteer")).default;

  // Start a simple static server for the dist folder
  const { createServer } = await import("http");
  const { readFile } = await import("fs/promises");

  const server = createServer(async (req, res) => {
    let url = req.url || "/";
    // SPA fallback: if the file doesn't exist, serve index.html
    let filePath = path.join(DIST, url === "/" ? "index.html" : url);

    // If path has no extension, try adding /index.html or fallback to root index.html
    if (!path.extname(filePath)) {
      const withIndex = path.join(filePath, "index.html");
      if (fs.existsSync(withIndex)) {
        filePath = withIndex;
      } else {
        filePath = path.join(DIST, "index.html");
      }
    }

    try {
      const content = await readFile(filePath);
      const ext = path.extname(filePath);
      const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".json": "application/json",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      res.end(content);
    } catch {
      // Fallback to index.html for SPA routing
      const fallback = await readFile(path.join(DIST, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fallback);
    }
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const route of ROUTES) {
    console.log(`Prerendering: ${route}`);
    const page = await browser.newPage();

    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Wait a bit for any animations / lazy content
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();

      // Determine output path
      const outDir =
        route === "/"
          ? DIST
          : path.join(DIST, route);

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log(`  ✓ Saved ${path.join(outDir, "index.html")}`);
    } catch (err) {
      console.error(`  ✗ Failed to prerender ${route}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log("\n✅ Prerendering complete!");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
