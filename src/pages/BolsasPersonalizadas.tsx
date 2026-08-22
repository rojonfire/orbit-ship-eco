import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, Palette, ShoppingBag, Truck, MessageCircle, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { SIZE_MEDIA } from "@/data/sizeMedia";

interface SizeCard {
  handle: string;
  label: string;
  blurb: string;
  priceFrom: string;
}

const SIZES: SizeCard[] = [
  { handle: "bolsa-biodegradable-20x30-cm", label: "20 × 30 cm", blurb: "La más pedida", priceFrom: "$510" },
  { handle: "bolsa-biodegradable-30x40-cm", label: "30 × 40 cm", blurb: "Pedidos medianos", priceFrom: "$580" },
  { handle: "bolsa-biodegradable-40x50-cm", label: "40 × 50 cm", blurb: "Ropa de cama, varias prendas", priceFrom: "$660" },
  { handle: "bolsa-biodegradable-50x60-cm", label: "50 × 60 cm", blurb: "Pedidos grandes o voluminosos", priceFrom: "$770" },
];

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Elige tamaño y color",
    description: "Los mismos 4 tamaños de siempre, en bolsa blanca o negra.",
  },
  {
    icon: Upload,
    title: "Sube tu logo",
    description: "Lo posicionas tú mismo sobre una foto real de la bolsa, ajustando tamaño y ubicación.",
  },
  {
    icon: Palette,
    title: "Elige cantidad y colores",
    description: "El precio se calcula al instante según cuántas bolsas y en cuántos colores va tu logo.",
  },
  {
    icon: Truck,
    title: "Compra en línea",
    description: "Pagas y listo: en unos 10 días hábiles te llega, despachado directo desde la imprenta.",
  },
];

const PRICING_100 = [
  { size: "20 × 30 cm", prices: ["$730", "$1.180", "$1.630", "$2.070"] },
  { size: "30 × 40 cm", prices: ["$800", "$1.250", "$1.700", "$2.140"] },
  { size: "40 × 50 cm", prices: ["$880", "$1.330", "$1.780", "$2.220"] },
  { size: "50 × 60 cm", prices: ["$990", "$1.440", "$1.890", "$2.330"] },
];

const PRICING_200 = [
  { size: "20 × 30 cm", prices: ["$510", "$730", "$950", "$1.180"] },
  { size: "30 × 40 cm", prices: ["$580", "$800", "$1.020", "$1.250"] },
  { size: "40 × 50 cm", prices: ["$660", "$890", "$1.110", "$1.330"] },
  { size: "50 × 60 cm", prices: ["$770", "$1.000", "$1.220", "$1.440"] },
];

const FAQS_PERSONALIZADAS = [
  {
    question: "¿Cuál es el pedido mínimo?",
    answer:
      "100 unidades por diseño, y desde ahí vamos de 100 en 100. Con 100 unidades ya puedes pedir hasta 4 colores de logo — no hace falta llegar a 200.",
  },
  {
    question: "¿Hasta cuántos colores puede llevar mi logo?",
    answer:
      "Hasta 4 colores. Un logo a 1 color siempre sale más económico, y se ve impecable sobre bolsa blanca o negra.",
  },
  {
    question: "¿Necesito el logo vectorizado?",
    answer:
      "Es lo ideal (.AI o .PDF con los textos trazados), pero puedes subir una imagen normal (PNG/JPG) para partir: nosotros la vectorizamos por ti si hace falta, solo toma un poco más de tiempo.",
  },
  {
    question: "¿Cuánto se demora?",
    answer:
      "Aproximadamente 10 días hábiles desde que confirmamos tu pago. Las bolsas se mandan a imprimir en un ciclo semanal, así que no salen de inmediato — te avisamos apenas estén en camino.",
  },
  {
    question: "¿Cuánto cuesta el envío?",
    answer: "Desde $3.500 en la Región Metropolitana. Si eres de regiones, se cotiza al momento de comprar.",
  },
];

const BolsasPersonalizadas = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Bolsas Personalizadas con tu Logo | ORBITA BAGS"
        description="Personaliza tus bolsas courier compostables con tu logo. Serigrafía hecha en Chile, hasta 4 colores, desde 100 unidades. Compra en línea, con checkout inmediato."
        path="/personalizadas"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <AnimatedSection>
            <div className="mb-14 max-w-2xl">
              <span className="tag-outline mb-4 inline-block">Bolsas personalizadas</span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Tus bolsas, con tu logo.
              </h1>
              <p className="text-lg text-muted-foreground">
                Las mismas bolsas courier compostables en casa, con doble sello adhesivo, ahora
                impresas con tu marca. Serigrafía hecha en Chile,{" "}
                <strong className="text-foreground">desde 100 unidades</strong>.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {STEPS.map((step, index) => (
                <div key={step.title} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-semibold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Elige tu tamaño y empieza
              </h2>
              <p className="text-muted-foreground mb-6">
                Cada tarjeta te lleva directo a la ficha del producto, con la personalización ya activada.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SIZES.map((s) => {
                  const photo = SIZE_MEDIA[s.handle]?.sizePhoto?.Blanca;
                  return (
                    <Link
                      key={s.handle}
                      to={`/shop/${s.handle}?tipo=personalizada`}
                      className="group bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
                    >
                      {photo && (
                        <div className="aspect-square bg-secondary/30 overflow-hidden">
                          <img
                            src={photo}
                            alt={`Bolsa compostable ${s.label}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold text-foreground">{s.label}</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">{s.blurb}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Desde <span className="text-primary font-semibold">{s.priceFrom}</span>/u
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="bg-foreground text-background rounded-3xl p-6 md:p-10 mb-16">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Lo que te cuesta cada bolsa · De 100 en 100
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-2 mb-2">
                Bolsa + impresión, todo incluido
              </h2>
              <p className="text-background/70 mb-8 max-w-xl">
                Precio por bolsa, con IVA incluido. Los colores son del logo — la bolsa siempre es
                blanca o negra.
              </p>

              {[
                { tag: "100 unidades", rows: PRICING_100 },
                { tag: "200+ unidades — mismo precio pidas 200 o 5.000", rows: PRICING_200 },
              ].map(({ tag, rows }) => (
                <div key={tag} className="mb-8 last:mb-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                    {tag}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[480px]">
                      <thead>
                        <tr className="text-left text-background/60 text-xs uppercase tracking-wider">
                          <th className="pb-2 font-medium">Tamaño</th>
                          <th className="pb-2 font-medium text-right">1 color</th>
                          <th className="pb-2 font-medium text-right">2 colores</th>
                          <th className="pb-2 font-medium text-right">3 colores</th>
                          <th className="pb-2 font-medium text-right">4 colores</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.size} className="border-t border-background/10">
                            <td className="py-2.5 font-medium">{row.size}</td>
                            {row.prices.map((p, i) => (
                              <td key={i} className="py-2.5 text-right font-display font-semibold">
                                {p}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <p className="text-xs text-background/60 mt-2">
                Precio por bolsa, no del pedido total. El envío se suma aparte.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                Preguntas frecuentes
              </h2>
              <div className="space-y-3">
                {FAQS_PERSONALIZADAS.map((faq) => (
                  <details
                    key={faq.question}
                    className="group bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-base font-display font-bold text-foreground">
                        {faq.question}
                      </h3>
                      <span
                        className="shrink-0 w-7 h-7 rounded-full bg-secondary/50 flex items-center justify-center text-primary transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={275}>
            <Link
              to="/herramientas/generador-oc"
              className="group flex items-center gap-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors p-5 mb-16"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">¿Necesitas una Orden de Compra (OC) para tu contabilidad?</p>
                <p className="text-sm text-muted-foreground">
                  Generador gratuito, sirve para cualquier proveedor — no solo para comprarnos a nosotros.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="text-center bg-primary/10 rounded-3xl p-12 border border-primary/20">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                ¿Tienes dudas antes de comprar?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Escríbenos por WhatsApp y te ayudamos a elegir tamaño, color y N° de colores para tu
                logo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/56931726288?text=Hola!%20Quiero%20cotizar%20bolsas%20personalizadas%20con%20mi%20logo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-secondary/50 text-foreground px-8 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hablar por WhatsApp
                </a>
                <Link to={`/shop/${SIZES[0].handle}?tipo=personalizada`}>
                  <Button className="rounded-full px-8 py-6 btn-lift group w-full sm:w-auto">
                    Empezar a personalizar
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BolsasPersonalizadas;
