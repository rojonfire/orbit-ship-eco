import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Leaf, Recycle, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bolsaBlanca from "@/assets/bolsa-blanca.png";
import bolsaNegra from "@/assets/bolsa-negra.png";

const QUANTITIES = [100, 500, 1000];
const PRICE_PER_UNIT = 0.85;

const productImages = [
  bolsaBlanca,
  bolsaNegra,
];

const Producto = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selections, setSelections] = useState<Record<number, number>>({
    100: 0,
    500: 0,
    1000: 0,
  });

  const updateQuantity = (qty: number, delta: number) => {
    setSelections((prev) => ({
      ...prev,
      [qty]: Math.max(0, prev[qty] + delta),
    }));
  };

  const totalUnits = Object.entries(selections).reduce(
    (acc, [qty, count]) => acc + Number(qty) * count,
    0
  );

  const totalPrice = totalUnits * PRICE_PER_UNIT;

  const handleWhatsApp = () => {
    const orderDetails = Object.entries(selections)
      .filter(([, count]) => count > 0)
      .map(([qty, count]) => `${count}x packs de ${qty} unidades`)
      .join(", ");

    const message = `¡Hola! Quiero hacer un pedido de bolsas Orbita:\n${orderDetails}\nTotal: ${totalUnits} unidades - $${totalPrice.toFixed(2)} USD`;
    window.open(
      `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden border border-border">
                <img
                  src={productImages[selectedImage]}
                  alt="Bolsa Orbita"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Producto Estrella
                </span>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
                  Bolsa Orbita Biodegradable
                </h1>
                <p className="text-2xl text-primary font-semibold mt-4">
                  ${PRICE_PER_UNIT.toFixed(2)} USD / unidad
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestra bolsa insignia combina resistencia y sostenibilidad.
                Fabricada con materiales 100% biodegradables que se descomponen
                en 180 días, sin dejar microplásticos. Perfecta para retail,
                supermercados y comercios que buscan reducir su huella
                ambiental.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">
                    100% Biodegradable
                  </span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Recycle className="w-8 h-8 text-accent mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">
                    180 días descomposición
                  </span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Package className="w-8 h-8 text-forest mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Alta resistencia
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Especificaciones
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Material:</span>
                    <span className="text-foreground">
                      Almidón de maíz + PBAT
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tamaño:</span>
                    <span className="text-foreground">40cm x 50cm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Capacidad:</span>
                    <span className="text-foreground">Hasta 10kg</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Personalización:</span>
                    <span className="text-foreground">Logo incluido</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Selecciona tu pedido
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Elige cuántos packs de cada cantidad necesitas
                </p>

                <div className="space-y-4">
                  {QUANTITIES.map((qty) => (
                    <div
                      key={qty}
                      className="flex items-center justify-between bg-secondary/30 rounded-xl p-4 border border-border"
                    >
                      <div>
                        <span className="font-medium text-foreground">
                          {qty} unidades
                        </span>
                        <p className="text-sm text-muted-foreground">
                          ${(qty * PRICE_PER_UNIT).toFixed(2)} USD
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(qty, -1)}
                          disabled={selections[qty] === 0}
                          className="h-10 w-10 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-foreground">
                          {selections[qty]}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(qty, 1)}
                          className="h-10 w-10 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                {totalUnits > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">
                        Total unidades:
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {totalUnits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-muted-foreground">
                        Precio total:
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        ${totalPrice.toFixed(2)} USD
                      </span>
                    </div>
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                    >
                      Enviar pedido por WhatsApp
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Producto;
