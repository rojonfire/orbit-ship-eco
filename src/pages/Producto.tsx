import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Leaf, Recycle, Package, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bolsaBlanca from "@/assets/bolsa-blanca.png";
import bolsaNegra from "@/assets/bolsa-negra.png";
import bolsaBlancaPlain from "@/assets/bolsa-blanca-plain.png";
import bolsaNegraPlain from "@/assets/bolsa-negra-plain.png";

const SIZES = [
  { id: "xs", name: "Extra Pequeña", dimensions: "15cm x 20cm" },
  { id: "small", name: "Pequeña", dimensions: "20cm x 30cm" },
  { id: "medium", name: "Mediana", dimensions: "30cm x 40cm" },
  { id: "large", name: "Grande", dimensions: "40cm x 50cm" },
  { id: "xl", name: "Extra Grande", dimensions: "50cm x 60cm" },
];

const QUANTITIES = [100, 500, 1000] as const;

// Precios en CLP por tamaño y cantidad de pack (redondeados hacia arriba)
const PRICES: Record<string, Record<number, { packPrice: number; unitPrice: number }>> = {
  xs: {
    100: { packPrice: 7490, unitPrice: 75 },
    500: { packPrice: 33900, unitPrice: 68 },
    1000: { packPrice: 62900, unitPrice: 63 },
  },
  small: {
    100: { packPrice: 9996, unitPrice: 100 },
    500: { packPrice: 39865, unitPrice: 80 },
    1000: { packPrice: 74970, unitPrice: 75 },
  },
  medium: {
    100: { packPrice: 15946, unitPrice: 160 },
    500: { packPrice: 70210, unitPrice: 141 },
    1000: { packPrice: 129710, unitPrice: 130 },
  },
  large: {
    100: { packPrice: 27965, unitPrice: 280 },
    500: { packPrice: 120190, unitPrice: 241 },
    1000: { packPrice: 224910, unitPrice: 225 },
  },
  xl: {
    100: { packPrice: 49028, unitPrice: 491 },
    500: { packPrice: 230265, unitPrice: 461 },
    1000: { packPrice: 440300, unitPrice: 441 },
  },
};

const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

type Color = "blanca" | "negra";
type CustomType = "con-diseño" | "personalizada";

const Producto = () => {
  const [searchParams] = useSearchParams();
  
  const [selectedColor, setSelectedColor] = useState<Color>("blanca");
  const [selectedSize, setSelectedSize] = useState(SIZES[1].id);
  const [customType, setCustomType] = useState<CustomType>("con-diseño");
  const [selections, setSelections] = useState<Record<number, number>>({
    100: 0,
    500: 0,
    1000: 0,
  });

  // Read URL params and pre-select options
  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const colorParam = searchParams.get("color");
    const customParam = searchParams.get("custom");

    if (sizeParam && SIZES.some(s => s.id === sizeParam)) {
      setSelectedSize(sizeParam);
    }
    if (colorParam === "blanca" || colorParam === "negra") {
      setSelectedColor(colorParam);
    }
    if (customParam === "personalizada" || customParam === "con-diseño") {
      setCustomType(customParam);
    }
  }, [searchParams]);

  const getProductImage = () => {
    if (customType === "con-diseño") {
      return selectedColor === "blanca" ? bolsaBlanca : bolsaNegra;
    } else {
      return selectedColor === "blanca" ? bolsaBlancaPlain : bolsaNegraPlain;
    }
  };

  const updateQuantity = (qty: number, delta: number) => {
    setSelections((prev) => ({
      ...prev,
      [qty]: Math.max(0, prev[qty] + delta),
    }));
  };

  const totalPrice = Object.entries(selections).reduce(
    (acc, [qty, count]) => {
      const qtyNum = Number(qty);
      const priceData = PRICES[selectedSize]?.[qtyNum];
      return acc + (priceData?.packPrice || 0) * count;
    },
    0
  );

  const totalUnits = Object.entries(selections).reduce(
    (acc, [qty, count]) => acc + Number(qty) * count,
    0
  );

  const selectedSizeData = SIZES.find((s) => s.id === selectedSize);
  const lowestUnitPrice = PRICES[selectedSize]?.[1000]?.unitPrice || 0;

  const handleWhatsApp = () => {
    const orderDetails = Object.entries(selections)
      .filter(([, count]) => count > 0)
      .map(([qty, count]) => `${count}x packs de ${qty} unidades`)
      .join(", ");

    const colorText = selectedColor === "blanca" ? "Blanca" : "Negra";
    const sizeText = selectedSizeData?.name || "";
    const typeText = customType === "con-diseño" ? "Con diseño Orbita" : "Para personalizar";

    const message = `¡Hola! Quiero hacer un pedido de bolsas Orbita:\n\n📦 Pedido: ${orderDetails}\n🎨 Color: ${colorText}\n📐 Tamaño: ${sizeText} (${selectedSizeData?.dimensions})\n✨ Tipo: ${typeText}\n\n💰 Total: ${totalUnits} unidades - ${formatCLP(totalPrice)}`;
    window.open(
      `https://wa.me/56954244951?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleCustomContact = () => {
    const message = `Estoy interesado en tener bolsas personalizadas para mi empresa, me cuentas un poco mas?`;
    window.open(
      `https://wa.me/56954244951?text=${encodeURIComponent(message)}`,
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
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden border border-border">
                <img
                  src={getProductImage()}
                  alt={`Bolsa Orbita ${selectedColor}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {customType === "con-diseño" 
                  ? "Bolsa con diseño Orbita incluido" 
                  : "Bolsa lisa para personalizar"}
              </p>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Producto Estrella
                </span>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
                  Bolsa Orbita Biodegradable
                </h1>
                <p className="text-2xl text-primary font-semibold mt-4">
                  Desde {formatCLP(lowestUnitPrice)} / unidad
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestra bolsa insignia combina resistencia y sostenibilidad.
                Fabricada con materiales 100% biodegradables que se descomponen
                en 180 días, sin dejar microplásticos.
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
                    180 días
                  </span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Package className="w-8 h-8 text-forest mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Alta resistencia
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  1. Elige el color
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedColor("blanca")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      selectedColor === "blanca"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-300 mx-auto mb-2" />
                    <span className="text-foreground font-medium">Blanca</span>
                  </button>
                  <button
                    onClick={() => setSelectedColor("negra")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      selectedColor === "negra"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-900 mx-auto mb-2" />
                    <span className="text-foreground font-medium">Negra</span>
                  </button>
                </div>
              </div>

              {/* Size Selector */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  2. Elige el tamaño
                </h3>
                <div className="space-y-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedSize === size.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-foreground">{size.name}</span>
                          <p className="text-sm text-muted-foreground">{size.dimensions}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Type Selector */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  3. Tipo de bolsa
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setCustomType("con-diseño")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      customType === "con-diseño"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-foreground">Con diseño Orbita</span>
                        <p className="text-sm text-muted-foreground">Incluye nuestro diseño impreso</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setCustomType("personalizada")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      customType === "personalizada"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-foreground">Personalizada</span>
                        <p className="text-sm text-muted-foreground">Tu logo o diseño propio</p>
                      </div>
                    </div>
                  </button>
                </div>

                {customType === "personalizada" && (
                  <div className="mt-4 p-4 bg-accent/20 rounded-xl border border-accent/30">
                    <p className="text-sm text-foreground mb-3">
                      Para bolsas personalizadas con tu diseño, contáctanos directamente para cotización y detalles.
                    </p>
                    <Button
                      onClick={handleCustomContact}
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Consultar por personalización
                    </Button>
                  </div>
                )}
              </div>

              {/* Quantity Selector - Only show for non-custom */}
              {customType === "con-diseño" && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">
                    4. Selecciona cantidad
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
                            Pack {qty} unidades
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {formatCLP(PRICES[selectedSize]?.[qty]?.packPrice || 0)} ({formatCLP(PRICES[selectedSize]?.[qty]?.unitPrice || 0)}/u)
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
                          {formatCLP(totalPrice)}
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
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Producto;
