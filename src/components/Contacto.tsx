import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contacto = () => {
  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Ubicación y Contacto
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vení a conocernos, estamos en el corazón de la ciudad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mapa */}
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1991.5210559796617!2d-76.52536886124801!3d3.3397651768142946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a1bd9ead3a6d%3A0x7e67c3132711376b!2sSouth%20Park%20Cali!5e0!3m2!1ses-419!2sco!4v1767990133623!5m2!1ses-419!2sco"
          width="600" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          <title>Mapa de ubicación South Park</title>
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
                    Via Panamericana, Pance<br />
                    Cali, Colombia
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
                    +57 3177751834
                  </p>
                  <Button
                    variant="link"
                    className="px-0 text-accent hover:text-accent/80"
                    onClick={() => window.open('https://wa.me/573177751834', '_blank')}
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
                    southparkcalisas@gmail.com
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
