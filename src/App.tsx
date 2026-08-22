import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy-load non-critical routes to reduce initial JS bundle
const Equipo = lazy(() => import("./pages/Equipo"));
const Tienda = lazy(() => import("./pages/Tienda"));
const ShopProduct = lazy(() => import("./pages/ShopProduct"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Politicas = lazy(() => import("./pages/Politicas"));
const BolsasPersonalizadas = lazy(() => import("./pages/BolsasPersonalizadas"));
const MockupPersonalizado = lazy(() => import("./pages/MockupPersonalizado"));
const GeneradorOC = lazy(() => import("./pages/GeneradorOC"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire Meta Pixel PageView on every route change
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/equipo" element={<Equipo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/politicas" element={<Politicas />} />
              <Route path="/shop/:handle" element={<ShopProduct />} />
              <Route path="/personalizadas" element={<BolsasPersonalizadas />} />
              {/* Prueba interna, no enlazada en el nav — herramienta de vista previa de logo personalizado */}
              <Route path="/herramientas/mockup-logo" element={<MockupPersonalizado />} />
              {/* No enlazada en el nav — se comparte el link directo con clientes. Genera OC apta para cualquier proveedor,
                  con Orbitabags SpA precargado como opción por defecto. */}
              <Route path="/herramientas/generador-oc" element={<GeneradorOC />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
