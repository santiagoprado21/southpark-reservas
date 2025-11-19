import { MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-2xl bg-accent hover:bg-accent/90 animate-float"
        onClick={() => window.open('https://wa.me/5491112345678', '_blank')}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      
      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-2xl bg-primary hover:bg-primary/90 animate-float"
        style={{ animationDelay: "0.5s" }}
        onClick={() => window.open('https://instagram.com/southparkvoley', '_blank')}
        aria-label="Visitar Instagram"
      >
        <Instagram className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingButtons;
