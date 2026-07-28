import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatCLP } from "@/lib/shopify";
import { invoiceSchema } from "@/lib/invoice";

const emptyInvoiceForm = { rut: "", razonSocial: "", giro: "", direccion: "" };

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [invoiceErrors, setInvoiceErrors] = useState<Record<string, string>>({});
  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    createCheckout,
    setInvoiceData,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const updateInvoiceField = (field: keyof typeof emptyInvoiceForm, value: string) => {
    setInvoiceForm(prev => ({ ...prev, [field]: value }));
    setInvoiceErrors(prev => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleCheckout = async () => {
    try {
      if (wantsInvoice) {
        const result = invoiceSchema.safeParse(invoiceForm);
        if (!result.success) {
          const errors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = String(issue.path[0]);
            if (!errors[field]) errors[field] = issue.message;
          }
          setInvoiceErrors(errors);
          return;
        }
        setInvoiceData(result.data);
      } else {
        setInvoiceData(null);
      }

      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "InitiateCheckout", {
          content_ids: items.map(item => item.variantId),
          num_items: totalItems,
          value: totalPrice,
          currency: "CLP",
        });
      }
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Abrir carrito de compras">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Tu carrito está vacío" : `${totalItems} producto${totalItems !== 1 ? 's' : ''} en tu carrito`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tu carrito está vacío</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedOptions.map(option => option.value).join(' • ')}
                        </p>
                        <p className="font-semibold text-primary">
                          {formatCLP(item.price.amount)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Eliminar ${item.product.node.title}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label={`Reducir cantidad de ${item.product.node.title}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm" aria-label={`Cantidad: ${item.quantity}`}>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label={`Aumentar cantidad de ${item.product.node.title}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantsInvoice}
                      onChange={(e) => setWantsInvoice(e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <span className="text-sm font-medium">Necesito factura</span>
                  </label>

                  {wantsInvoice && (
                    <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Emitimos factura electrónica. Completa los datos de tu empresa y te la enviamos por correo.
                      </p>

                      <div className="space-y-1">
                        <Label htmlFor="invoice-rut" className="text-xs">RUT empresa</Label>
                        <Input
                          id="invoice-rut"
                          value={invoiceForm.rut}
                          onChange={(e) => updateInvoiceField("rut", e.target.value)}
                          placeholder="76.543.210-K"
                          aria-invalid={!!invoiceErrors.rut}
                        />
                        {invoiceErrors.rut && (
                          <p className="text-xs text-destructive">{invoiceErrors.rut}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="invoice-razon" className="text-xs">Razón social</Label>
                        <Input
                          id="invoice-razon"
                          value={invoiceForm.razonSocial}
                          onChange={(e) => updateInvoiceField("razonSocial", e.target.value)}
                          placeholder="Comercial Ejemplo SpA"
                          aria-invalid={!!invoiceErrors.razonSocial}
                        />
                        {invoiceErrors.razonSocial && (
                          <p className="text-xs text-destructive">{invoiceErrors.razonSocial}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="invoice-giro" className="text-xs">Giro</Label>
                        <Input
                          id="invoice-giro"
                          value={invoiceForm.giro}
                          onChange={(e) => updateInvoiceField("giro", e.target.value)}
                          placeholder="Venta al por menor"
                          aria-invalid={!!invoiceErrors.giro}
                        />
                        {invoiceErrors.giro && (
                          <p className="text-xs text-destructive">{invoiceErrors.giro}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="invoice-direccion" className="text-xs">Dirección comercial</Label>
                        <Input
                          id="invoice-direccion"
                          value={invoiceForm.direccion}
                          onChange={(e) => updateInvoiceField("direccion", e.target.value)}
                          placeholder="Av. Providencia 1234, Santiago"
                          aria-invalid={!!invoiceErrors.direccion}
                        />
                        {invoiceErrors.direccion && (
                          <p className="text-xs text-destructive">{invoiceErrors.direccion}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCLP(totalPrice)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Pagar con Shopify
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
