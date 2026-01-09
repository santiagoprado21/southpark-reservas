import { Instagram, MessageCircle, Mail, MapPin, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-sp-blue text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <div className="mb-4">
              <Logo size="md" textColor="text-white" />
            </div>
            <p className="text-background/90 leading-relaxed">
              Tu destino para voley playa, mini golf y diversión al aire libre.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("reservas")}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Reservas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("precios")}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Precios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("galeria")}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Galería
                </button>
              </li>
              <li className="pt-2 border-t border-background/20 mt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-background/80 hover:text-background transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Acceso Staff
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80">
                <MapPin className="w-4 h-4" />
                <span>Via Panamericana, Pance </span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <MessageCircle className="w-4 h-4" />
                <span>+57 3177751834</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Mail className="w-4 h-4" />
                <span>southparkcalisas@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-bold text-lg mb-4">Seguinos</h3>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://instagram.com/southparkcali', '_blank')}
                className="bg-background/10 hover:bg-background/20 p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open('https://wa.me/573177751834', '_blank')}
                className="bg-background/10 hover:bg-background/20 p-3 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-background/80 text-sm">
                Lunes a Domingo<br />
                8:00 - 22:00 hs
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>© {new Date().getFullYear()} South Park. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
