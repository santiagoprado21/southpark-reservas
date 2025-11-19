import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reservas = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    personas: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construir mensaje de WhatsApp
    const mensaje = `Hola! Me gustaría hacer una reserva:\n\nNombre: ${formData.nombre}\nTeléfono: ${formData.telefono}\nFecha: ${formData.fecha}\nHora: ${formData.hora}\nCantidad de personas: ${formData.personas}`;
    const whatsappUrl = `https://wa.me/5491112345678?text=${encodeURIComponent(mensaje)}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "¡Redirigiendo a WhatsApp!",
      description: "Te estamos conectando con nuestro equipo para confirmar tu reserva.",
    });
  };

  return (
    <section id="reservas" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Reservá tu Turno
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Completá el formulario y te contactamos por WhatsApp para confirmar tu reserva
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Formulario */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Formulario de Reserva</CardTitle>
              <CardDescription>
                Completá tus datos y te contactamos enseguida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="personas">Cantidad de Personas</Label>
                  <Input
                    id="personas"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="2"
                    value={formData.personas}
                    onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
                  Reservar por WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="space-y-4">
            <Card className="bg-primary text-primary-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  <CardTitle>Horarios</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Lunes a Domingo</p>
                <p className="text-2xl font-bold">8:00 - 22:00 hs</p>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <CardTitle>Duración</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Turnos de</p>
                <p className="text-2xl font-bold">1 hora</p>
                <p className="text-sm mt-2">Podés reservar múltiples turnos consecutivos</p>
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  <CardTitle>Capacidad</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Hasta</p>
                <p className="text-2xl font-bold">12 personas</p>
                <p className="text-sm mt-2">Por cancha de voley</p>
              </CardContent>
            </Card>

            <Card className="bg-destructive text-destructive-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Phone className="w-8 h-8" />
                  <CardTitle>Contacto Directo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">También podés llamarnos o escribirnos directamente</p>
                <p className="text-2xl font-bold mt-2">+54 9 11 1234-5678</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservas;
