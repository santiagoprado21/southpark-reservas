import { useState } from "react";
import { Search, Calendar, Clock, MapPin, CreditCard, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { reservasService } from "@/services/reservas.service";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MisReservas = () => {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState({ email: "", telefono: "" });
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!busqueda.email && !busqueda.telefono) {
      toast({
        title: "Datos requeridos",
        description: "Debes ingresar tu email o teléfono",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setBuscado(true);

    try {
      const params: any = { page: 1, limit: 50 };
      if (busqueda.email) params.email = busqueda.email;
      if (busqueda.telefono) params.telefono = busqueda.telefono;

      const data = await reservasService.getReservas(params);
      setReservas(data.reservas);

      if (data.reservas.length === 0) {
        toast({
          title: "No se encontraron reservas",
          description: "No hay reservas registradas con esos datos",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al buscar",
        description: error.response?.data?.message || "No se pudieron obtener las reservas",
        variant: "destructive",
      });
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: any = {
      PENDIENTE: { variant: "outline", icon: Clock, text: "Pendiente", color: "text-yellow-600" },
      CONFIRMADA: { variant: "default", icon: CheckCircle2, text: "Confirmada", color: "text-green-600" },
      COMPLETADA: { variant: "secondary", icon: CheckCircle2, text: "Completada", color: "text-blue-600" },
      CANCELADA: { variant: "destructive", icon: X, text: "Cancelada", color: "text-red-600" },
    };

    const config = variants[estado] || variants.PENDIENTE;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Mis Reservas</h1>
            <p className="text-muted-foreground text-lg">
              Consulta el estado de tus reservas ingresando tu email o teléfono
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Reservas
              </CardTitle>
              <CardDescription>
                Ingresa tu email o teléfono para ver tus reservas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={busqueda.email}
                      onChange={(e) => setBusqueda({ ...busqueda, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      value={busqueda.telefono}
                      onChange={(e) => setBusqueda({ ...busqueda, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Reservas
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resultados */}
          {buscado && (
            <div className="space-y-4">
              {reservas.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      No se encontraron reservas con esos datos
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Verifica que el email o teléfono sean correctos
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">
                      {reservas.length} {reservas.length === 1 ? 'Reserva encontrada' : 'Reservas encontradas'}
                    </h2>
                  </div>

                  {reservas.map((reserva) => (
                    <Card key={reserva.id} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 mb-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              {reserva.cancha.nombre}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatFecha(reserva.fecha)}
                            </CardDescription>
                          </div>
                          <div>
                            {getEstadoBadge(reserva.estado)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Horario */}
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Horario</p>
                              <p className="font-semibold">{reserva.horaInicio} - {reserva.horaFin}</p>
                            </div>
                          </div>

                          {/* Duración */}
                          {reserva.duracionHoras > 0 && (
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Duración</p>
                                <p className="font-semibold">{reserva.duracionHoras} {reserva.duracionHoras === 1 ? 'hora' : 'horas'}</p>
                              </div>
                            </div>
                          )}

                          {/* Personas */}
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Personas</p>
                              <p className="font-semibold">{reserva.cantidadPersonas}</p>
                            </div>
                          </div>

                          {/* Circuitos (Mini Golf) */}
                          {reserva.cantidadCircuitos && (
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Circuitos</p>
                                <p className="font-semibold">{reserva.cantidadCircuitos}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Precio */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground">Precio Total:</span>
                            <span className="text-2xl font-bold text-primary">
                              ${reserva.precioTotal.toLocaleString()}
                            </span>
                          </div>
                          {reserva.montoSena && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Seña (30%):</span>
                              <span className="font-semibold">
                                ${reserva.montoSena.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {reserva.pagoCompletado && (
                            <div className="mt-2 flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-sm font-medium">Pago completado</span>
                            </div>
                          )}
                        </div>

                        {/* Cliente */}
                        <div className="text-sm space-y-1">
                          <p><strong>Cliente:</strong> {reserva.nombreCliente}</p>
                          <p><strong>Email:</strong> {reserva.emailCliente}</p>
                          <p><strong>Teléfono:</strong> {reserva.telefonoCliente}</p>
                          {reserva.notas && (
                            <p><strong>Notas:</strong> {reserva.notas}</p>
                          )}
                        </div>

                        {/* Fecha de creación */}
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Reserva creada el {new Date(reserva.createdAt).toLocaleString('es-CO')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MisReservas;

