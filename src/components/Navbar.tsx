import { useState } from "react";
import { Menu, X, Volleyball } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("inicio")}>
            <div className="bg-primary rounded-full p-2">
              <Volleyball className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              South Park
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("reservas")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Reservas
            </button>
            <button
              onClick={() => scrollToSection("precios")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection("galeria")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </button>
            <Button onClick={() => scrollToSection("reservas")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Reservar Ahora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <button
              onClick={() => scrollToSection("inicio")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("reservas")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Reservas
            </button>
            <button
              onClick={() => scrollToSection("precios")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection("galeria")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Contacto
            </button>
            <Button
              onClick={() => scrollToSection("reservas")}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Reservar Ahora
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
