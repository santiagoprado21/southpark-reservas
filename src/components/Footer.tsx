import { Volleyball, Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-full p-2">
                <Volleyball className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">South Park</span>
            </div>
            <p className="text-background/80">
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
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80">
                <MapPin className="w-4 h-4" />
                <span>Av. Ejemplo 1234, CABA</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <MessageCircle className="w-4 h-4" />
                <span>+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Mail className="w-4 h-4" />
                <span>info@southpark.com.ar</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-bold text-lg mb-4">Seguinos</h3>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://instagram.com/southparkvoley', '_blank')}
                className="bg-background/10 hover:bg-background/20 p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open('https://wa.me/5491112345678', '_blank')}
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
