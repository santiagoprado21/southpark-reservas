import { useState } from "react";
import { Menu, X, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Si no estamos en la home, ir primero a home
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const goToPage = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => scrollToSection("inicio")}>
            <Logo size="sm" />
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
              onClick={() => goToPage("/mis-reservas")}
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              Mis Reservas
            </button>
            <button
              onClick={() => scrollToSection("precios")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Precios y Promociones
            </button>
            <button
              onClick={() => scrollToSection("galeria")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </button>
            
            {/* Separador visual */}
            <div className="h-8 w-px bg-border"></div>
            
            <Button 
              onClick={() => goToPage("/login")}
              variant="outline" 
              className="border-sp-blue text-sp-blue hover:bg-sp-blue hover:text-white transition-all font-poppins font-semibold"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Staff
            </Button>
            <Button 
              onClick={() => scrollToSection("reservas")} 
              className="bg-sp-yellow text-secondary-foreground hover:bg-sp-yellow/90 shadow-md hover:shadow-lg transition-all font-poppins font-semibold"
            >
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
              onClick={() => goToPage("/mis-reservas")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Mis Reservas
            </button>
            <button
              onClick={() => scrollToSection("precios")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Precios y Promociones
            </button>
            <button
              onClick={() => scrollToSection("galeria")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              Contacto
            </button>
            
            {/* Separador */}
            <div className="border-t border-border my-2"></div>
            
            <Button
              onClick={() => goToPage("/login")}
              variant="outline"
              className="w-full border-sp-blue text-sp-blue hover:bg-sp-blue hover:text-white font-poppins font-semibold mb-2"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Acceso Staff
            </Button>
            <Button
              onClick={() => scrollToSection("reservas")}
              className="w-full bg-sp-yellow text-secondary-foreground hover:bg-sp-yellow/90 shadow-md font-poppins font-semibold"
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
