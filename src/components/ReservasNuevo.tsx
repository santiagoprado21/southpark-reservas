import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Phone, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canchasService, Cancha } from "@/services/canchas.service";
import { reservasService, CreateReservaData } from "@/services/reservas.service";
import { disponibilidadService } from "@/services/disponibilidad.service";

const ReservasNuevo = () => {
  const { toast } = useToast();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);
  const [precioCalculado, setPrecioCalculado] = useState<number | null>(null);
  const [reservaCreada, setReservaCreada] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    canchaId: "",
    tipoCanchaSeleccionada: "" as "VOLEY_PLAYA" | "MINI_GOLF" | "",
    fecha: "",
    horaInicio: "",
    duracionHoras: 1,
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    cantidadPersonas: 1,
    cantidadCircuitos: 1,
    notas: "",
  });

  // Cargar canchas al montar el componente
  useEffect(() => {
    cargarCanchas();
  }, []);

  // Cargar horarios cuando se selecciona cancha y fecha
  useEffect(() => {
    if (formData.canchaId && formData.fecha) {
      cargarHorariosDisponibles();
    }
  }, [formData.canchaId, formData.fecha]);

  // Calcular precio cuando cambian los parámetros relevantes
  useEffect(() => {
    if (formData.canchaId && formData.horaInicio && formData.duracionHoras) {
      calcularPrecio();
    }
  }, [
    formData.canchaId,
    formData.horaInicio,
    formData.duracionHoras,
    formData.cantidadPersonas,
    formData.cantidadCircuitos,
  ]);

  const cargarCanchas = async () => {
    try {
      const data = await canchasService.getCanchas();
      setCanchas(data.filter((c) => c.activa));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las canchas",
        variant: "destructive",
      });
    }
  };

  const cargarHorariosDisponibles = async () => {
    try {
      const data = await disponibilidadService.getDisponibilidad(
        formData.canchaId,
        formData.fecha
      );
      
      if (data.horarios) {
        const horariosLibres = data.horarios
          .filter((h) => h.disponible)
          .map((h) => h.hora);
        setHorariosDisponibles(horariosLibres);
      }
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    }
  };

  const calcularPrecio = () => {
    const cancha = canchas.find((c) => c.id === formData.canchaId);
    if (!cancha || cancha.configuraciones.length === 0) return;

    const config = cancha.configuraciones[0];
    let precio = 0;

    if (cancha.tipo === "VOLEY_PLAYA") {
      // Verificar si es Happy Hour (4pm-8pm)
      const hora = parseInt(formData.horaInicio.split(":")[0]);
      const esHappyHour = config.tieneHappyHour && hora >= 16 && hora < 20;

      if (formData.duracionHoras === 1) {
        precio = config.precioHora1 || 80000;
      } else if (formData.duracionHoras === 2) {
        if (esHappyHour && config.precioHora2HappyHour) {
          precio = config.precioHora2HappyHour; // $110,000
        } else {
          precio = config.precioHora2 || 130000; // $130,000
        }
      } else if (formData.duracionHoras === 3) {
        precio = config.precioHora3 || 180000;
      }
    } else if (cancha.tipo === "MINI_GOLF") {
      const precioPorPersona =
        formData.cantidadCircuitos === 2
          ? config.precioPersona2Circuitos || 45000
          : config.precioPersona1Circuito || 25000;
      precio = precioPorPersona * formData.cantidadPersonas;
    }

    setPrecioCalculado(precio);
  };

  const handleCanchaChange = (canchaId: string) => {
    const cancha = canchas.find((c) => c.id === canchaId);
    setFormData({
      ...formData,
      canchaId,
      tipoCanchaSeleccionada: cancha?.tipo || "",
      horaInicio: "",
    });
    setHorariosDisponibles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar disponibilidad antes de crear la reserva
      setVerificandoDisponibilidad(true);
      const disponibilidad = await disponibilidadService.verificarDisponibilidad({
        canchaId: formData.canchaId,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        duracionHoras: formData.duracionHoras,
      });

      if (!disponibilidad.disponible) {
        toast({
          title: "Horario no disponible",
          description: disponibilidad.motivo || "El horario seleccionado ya está reservado",
          variant: "destructive",
        });
        setVerificandoDisponibilidad(false);
        setLoading(false);
        return;
      }
      setVerificandoDisponibilidad(false);

      // Crear la reserva
      const data: CreateReservaData = {
        canchaId: formData.canchaId,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        duracionHoras: formData.duracionHoras,
        nombreCliente: formData.nombreCliente,
        emailCliente: formData.emailCliente,
        telefonoCliente: formData.telefonoCliente,
        cantidadPersonas: formData.cantidadPersonas,
        cantidadCircuitos: formData.cantidadCircuitos,
        notas: formData.notas,
      };

      const reserva = await reservasService.createReserva(data);
      setReservaCreada(reserva);

      toast({
        title: "¡Reserva creada exitosamente!",
        description: `Tu reserva ha sido registrada. ID: ${reserva.id.substring(0, 8)}`,
      });

      // Reiniciar formulario
      setFormData({
        canchaId: "",
        tipoCanchaSeleccionada: "",
        fecha: "",
        horaInicio: "",
        duracionHoras: 1,
        nombreCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        cantidadPersonas: 1,
        cantidadCircuitos: 1,
        notas: "",
      });
      setPrecioCalculado(null);
    } catch (error: any) {
      toast({
        title: "Error al crear reserva",
        description: error.response?.data?.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Si se creó una reserva, mostrar página de confirmación
  if (reservaCreada) {
    return (
      <section id="reservas" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl">¡Reserva Confirmada!</CardTitle>
              <CardDescription>Tu reserva ha sido registrada exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>ID de Reserva:</strong> {reservaCreada.id.substring(0, 8).toUpperCase()}</p>
                <p><strong>Cancha:</strong> {reservaCreada.cancha.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(reservaCreada.fecha).toLocaleDateString()}</p>
                <p><strong>Horario:</strong> {reservaCreada.horaInicio} - {reservaCreada.horaFin}</p>
                <p><strong>Cliente:</strong> {reservaCreada.nombreCliente}</p>
                <p className="text-xl font-bold text-primary">
                  <strong>Precio Total:</strong> ${reservaCreada.precioTotal.toLocaleString()}
                </p>
                <p className="text-lg">
                  <strong>Seña (30%):</strong> ${reservaCreada.montoSena.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
                <p className="font-semibold">📌 Importante:</p>
                <p>Para confirmar tu reserva, debes abonar la seña de ${reservaCreada.montoSena.toLocaleString()}.</p>
                <p className="mt-2">Contactanos por WhatsApp o acercate al complejo.</p>
              </div>

              <Button
                onClick={() => setReservaCreada(null)}
                className="w-full"
                variant="outline"
              >
                Hacer otra reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

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
            Sistema de reservas en línea - Elegí tu cancha, fecha y horario
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Formulario */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Formulario de Reserva</CardTitle>
              <CardDescription>Completá los datos para reservar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Seleccionar Cancha */}
                <div>
                  <Label htmlFor="cancha">Cancha</Label>
                  <Select value={formData.canchaId} onValueChange={handleCanchaChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cancha" />
                    </SelectTrigger>
                    <SelectContent>
                      {canchas.map((cancha) => (
                        <SelectItem key={cancha.id} value={cancha.id}>
                          {cancha.nombre} - {cancha.tipo.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha */}
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>

                {/* Hora de inicio */}
                {horariosDisponibles.length > 0 && (
                  <div>
                    <Label htmlFor="hora">Hora de Inicio</Label>
                    <Select
                      value={formData.horaInicio}
                      onValueChange={(value) => setFormData({ ...formData, horaInicio: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponibles.map((hora) => (
                          <SelectItem key={hora} value={hora}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Duración (solo para voley) */}
                {formData.tipoCanchaSeleccionada === "VOLEY_PLAYA" && (
                  <div>
                    <Label htmlFor="duracion">Duración (horas)</Label>
                    <Select
                      value={formData.duracionHoras.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, duracionHoras: parseInt(value) })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="3">3 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Cantidad de personas */}
                <div>
                  <Label htmlFor="personas">Cantidad de Personas</Label>
                  <Input
                    id="personas"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.cantidadPersonas}
                    onChange={(e) =>
                      setFormData({ ...formData, cantidadPersonas: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                {/* Cantidad de circuitos (solo para mini golf) */}
                {formData.tipoCanchaSeleccionada === "MINI_GOLF" && (
                  <div>
                    <Label htmlFor="circuitos">Cantidad de Circuitos</Label>
                    <Select
                      value={formData.cantidadCircuitos.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, cantidadCircuitos: parseInt(value) })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 circuito</SelectItem>
                        <SelectItem value="2">2 circuitos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Nombre */}
                <div>
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombreCliente}
                    onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.emailCliente}
                    onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={formData.telefonoCliente}
                    onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                    required
                  />
                </div>

                {/* Notas */}
                <div>
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Input
                    id="notas"
                    placeholder="Alguna observación..."
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  />
                </div>

                {/* Precio */}
                {precioCalculado !== null && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Precio Total:</p>
                    <p className="text-3xl font-bold text-primary">
                      ${precioCalculado.toLocaleString()}
                    </p>
                    <p className="text-sm mt-2">
                      Seña (30%): ${Math.round(precioCalculado * 0.3).toLocaleString()}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
                  disabled={loading || verificandoDisponibilidad}
                >
                  {loading
                    ? "Creando reserva..."
                    : verificandoDisponibilidad
                    ? "Verificando disponibilidad..."
                    : "Crear Reserva"}
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
                  <CardTitle>Horarios Voley</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Lunes a Sábado</p>
                <p className="text-2xl font-bold">16:00 - 00:00 hs</p>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <CardTitle>Horarios Mini Golf</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Jueves a Domingo</p>
                <p className="text-2xl font-bold">16:00 - 22:00 hs</p>
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  <CardTitle>Precios Voley</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>1 hora: $80,000</p>
                <p>2 horas: $110,000 (4-8pm) / $130,000 (8-12am)</p>
                <p>3 horas: $180,000</p>
              </CardContent>
            </Card>

            <Card className="bg-destructive text-destructive-foreground hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Phone className="w-8 h-8" />
                  <CardTitle>Precios Mini Golf</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>1 circuito: $25,000 por persona</p>
                <p>2 circuitos: $45,000 por persona</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservasNuevo;

