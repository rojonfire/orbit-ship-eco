import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-display font-bold text-foreground mb-4">{title}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const Politicas = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Política de Envío y Devoluciones | ORBITA BAGS"
        description="Política de envío, plazos de entrega, derecho a retracto y garantía legal para compras en ORBITA BAGS, Chile."
        path="/politicas"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <AnimatedSection>
            <div className="mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Información legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Política de Envío y Devoluciones
              </h1>
              <p className="text-lg text-muted-foreground">
                Vendido por ORBITA BAGS, Santiago, Chile. Ante cualquier duda,
                contáctanos por{" "}
                <a
                  href="https://wa.me/56931726288"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>{" "}
                o a{" "}
                <a href="mailto:orbitabagscontacto@gmail.com" className="text-primary hover:underline">
                  orbitabagscontacto@gmail.com
                </a>
                .
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <Section title="Plazos de entrega">
              <p>
                Realizamos envíos a todo Chile. El plazo estimado de entrega es de
                hasta <strong>14 días hábiles</strong> desde la confirmación de la
                compra, dependiendo de la comuna de destino y el courier a cargo.
              </p>
            </Section>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <Section title="Derecho a retracto">
              <p>
                De acuerdo a la Ley N° 19.496 sobre Protección de los Derechos de
                los Consumidores, por tratarse de una compra realizada por
                internet, tienes derecho a retractarte de tu compra dentro de un
                plazo de <strong>10 días corridos</strong> desde que recibes el
                producto, sin necesidad de justificar tu decisión.
              </p>
              <p>
                Para ejercer este derecho, el producto debe estar{" "}
                <strong>sin uso</strong> y en su embalaje original. Una vez
                recibida la devolución, reembolsamos el monto pagado dentro de un
                plazo máximo de 10 días.
              </p>
              <p>
                El <strong>costo del envío de devolución es de cargo del
                cliente</strong>, salvo que se indique expresamente lo contrario
                en una promoción vigente.
              </p>
              <p>
                Este derecho a retracto no aplica a las{" "}
                <strong>bolsas personalizadas</strong> (confeccionadas según
                especificaciones del cliente), conforme a las excepciones
                establecidas por la ley para productos hechos a pedido.
              </p>
            </Section>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <Section title="Garantía legal">
              <p>
                Independiente del derecho a retracto, todo producto cuenta con la
                garantía legal establecida en la Ley del Consumidor:{" "}
                <strong>3 meses desde la fecha de compra</strong> para reclamar
                por fallas o defectos de fabricación. Ante un producto defectuoso,
                puedes elegir entre reparación, cambio o devolución del dinero.
              </p>
            </Section>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <Section title="Cómo solicitar una devolución">
              <p>
                Escríbenos por{" "}
                <a
                  href="https://wa.me/56931726288"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>{" "}
                o a{" "}
                <a href="mailto:orbitabagscontacto@gmail.com" className="text-primary hover:underline">
                  orbitabagscontacto@gmail.com
                </a>{" "}
                indicando tu número de pedido. Te confirmamos la dirección de
                devolución y los pasos a seguir.
              </p>
            </Section>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Politicas;
