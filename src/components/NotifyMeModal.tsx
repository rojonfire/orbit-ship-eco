import { useState } from "react";
import { Bell, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXX/exec";

interface NotifyMeModalProps {
  productName?: string;
  className?: string;
}

const NotifyMeModal = ({ productName, className }: NotifyMeModalProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), product: productName || "General" }),
      });

      setSubmitted(true);
      toast.success("¡Te avisaremos cuando haya stock!", {
        position: "top-center",
      });

      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setEmail("");
      }, 2000);
    } catch {
      toast.error("Error al registrar. Intenta de nuevo.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`border-primary text-primary hover:bg-primary hover:text-primary-foreground ${className}`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Avísame cuando esté disponible
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {submitted ? "¡Listo!" : "Avísame cuando haya stock"}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "Te notificaremos apenas tengamos disponibilidad."
              : `Déjanos tu email y te avisaremos cuando ${productName ? `"${productName}"` : "este producto"} esté disponible.`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center py-6">
            <CheckCircle className="w-12 h-12 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Revisa tu bandeja pronto 🌱</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Notifícame"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Solo usaremos tu email para avisarte del stock. Sin spam.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotifyMeModal;
