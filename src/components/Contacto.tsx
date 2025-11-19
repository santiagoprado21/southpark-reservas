import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contacto = () => {
  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              Ubicación y Contacto
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vení a conocernos, estamos en el corazón de la ciudad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mapa */}
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016888183341!2d-58.38375908477049!3d-34.60373098045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccaccc8b8c7fd%3A0x18c4f6e8f4e7a33f!2sObelisco!5e0!3m2!1ses!2sar!4v1635000000000!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Mapa de ubicación South Park"
            ></iframe>
          </div>

          {/* Info de Contacto */}
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Dirección</h3>
                  <p className="text-muted-foreground">
                    Av. Ejemplo 1234<br />
                    Buenos Aires, Argentina
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Teléfono</h3>
                  <p className="text-muted-foreground">
                    +54 9 11 1234-5678
                  </p>
                  <Button
                    variant="link"
                    className="px-0 text-accent hover:text-accent/80"
                    onClick={() => window.open('https://wa.me/5491112345678', '_blank')}
                  >
                    Chatear por WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    info@southpark.com.ar
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="bg-destructive/10 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Horarios</h3>
                  <p className="text-muted-foreground">
                    Lunes a Domingo<br />
                    8:00 - 22:00 hs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Instagram className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Seguinos en Instagram</h3>
                  <Button
                    variant="link"
                    className="px-0 text-primary hover:text-primary/80"
                    onClick={() => window.open('https://instagram.com/southparkvoley', '_blank')}
                  >
                    @southparkvoley
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
