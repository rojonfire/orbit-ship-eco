import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

const blogSlugs = [
  "compostable-vs-biodegradable",
  "como-elegir-bolsas-courier-ecommerce",
  "packaging-habla-de-tu-marca",
  "ser-sustentable-sin-sacrificar-margen",
  "guia-medidas-bolsas-courier",
  "checklist-primeros-100-pedidos",
  "tendencias-packaging-sustentable-2026",
  "plastico-en-el-ecommerce",
  "packaging-personalizado-vale-la-pena",
  "como-reducir-devoluciones-con-packaging",
  "ley-rep-chile-ecommerce-packaging",
  "5-errores-packaging-ecommerce",
  "unboxing-redes-sociales-ecommerce",
  "packaging-compostable-para-alimentos",
];

const prerenderRoutes = [
  "/",
  "/tienda",
  "/equipo",
  "/blog",
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      vitePrerender({
        staticDir: path.join(__dirname, "dist"),
        routes: prerenderRoutes,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
