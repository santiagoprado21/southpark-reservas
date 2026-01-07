import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Phone, CheckCircle2, Volleyball, Flag, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canchasService, Cancha } from "@/services/canchas.service";
import { reservasService, CreateReservaData } from "@/services/reservas.service";
import { disponibilidadService } from "@/services/disponibilidad.service";
import CalendarioHorarios from "@/components/CalendarioHorarios";
import { generarMensajeReserva, abrirWhatsApp, enviarNotificacionesNuevaReserva } from "@/utils/whatsapp";

const Reservas = () => {
  const { toast } = useToast();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [canchasVoley, setCanchasVoley] = useState<Cancha[]>([]);
  const [canchasMiniGolf, setCanchasMiniGolf] = useState<Cancha[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [motivoNoDisponible, setMotivoNoDisponible] = useState<string>("");
  const [precioCalculado, setPrecioCalculado] = useState<number | null>(null);
  const [reservaCreada, setReservaCreada] = useState<any>(null);
  const [whatsappNumero, setWhatsappNumero] = useState<string | null>(null);
  const [tipoActivo, setTipoActivo] = useState<"voley" | "minigolf">("voley");
  
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

  // Cargar canchas al montar
  useEffect(() => {
    cargarCanchas();
  }, []);

  // Cargar horarios cuando cambia cancha o fecha
  useEffect(() => {
    if (formData.canchaId && formData.fecha) {
      cargarHorariosDisponibles();
    }
  }, [formData.canchaId, formData.fecha]);

  // Calcular precio
  useEffect(() => {
    if (formData.canchaId && formData.horaInicio && formData.duracionHoras) {
      calcularPrecio();
    }
  }, [formData.canchaId, formData.horaInicio, formData.duracionHoras, formData.cantidadPersonas, formData.cantidadCircuitos]);

  const cargarCanchas = async () => {
    try {
      const data = await canchasService.getCanchas();
      const canchasActivas = data.filter((c) => c.activa);
      setCanchas(canchasActivas);
      setCanchasVoley(canchasActivas.filter((c) => c.tipo === "VOLEY_PLAYA"));
      setCanchasMiniGolf(canchasActivas.filter((c) => c.tipo === "MINI_GOLF"));
    } catch (error) {
      console.error("Error al cargar canchas:", error);
    }
  };

  const cargarHorariosDisponibles = async () => {
    setLoadingHorarios(true);
    setMotivoNoDisponible(""); // Limpiar motivo previo
    try {
      console.log('Cargando horarios para:', formData.canchaId, formData.fecha);
      const data = await disponibilidadService.getDisponibilidad(formData.canchaId, formData.fecha);
      console.log('Horarios recibidos:', data);
      
      // Verificar si la cancha no está disponible ese día
      if (data.disponible === false && data.motivo) {
        const motivo = data.motivo.charAt(0).toUpperCase() + data.motivo.slice(1);
        setMotivoNoDisponible(motivo);
        toast({
          title: "⚠️ Día no disponible",
          description: motivo,
          variant: "destructive",
        });
        setHorariosDisponibles([]);
      } else if (data.horarios && data.horarios.length > 0) {
        setHorariosDisponibles(data.horarios);
        setMotivoNoDisponible(""); // Limpiar motivo si hay horarios
      } else {
        // No hay horarios disponibles (todos ocupados)
        const motivo = "Todos los horarios están ocupados para esta fecha";
        setMotivoNoDisponible(motivo);
        toast({
          title: "Sin horarios disponibles",
          description: motivo + ". Intenta con otro día.",
          variant: "destructive",
        });
        setHorariosDisponibles([]);
      }
    } catch (error: any) {
      console.error("Error al cargar horarios:", error);
      setMotivoNoDisponible("Error al cargar horarios");
      toast({
        title: "Error al cargar horarios",
        description: error.response?.data?.message || "No se pudieron cargar los horarios disponibles. Verifica que el backend esté corriendo.",
        variant: "destructive",
      });
      setHorariosDisponibles([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const calcularPrecio = () => {
    const cancha = canchas.find((c) => c.id === formData.canchaId);
    if (!cancha || cancha.configuraciones.length === 0) return;

    const config = cancha.configuraciones[0];
    let precio = 0;

    if (cancha.tipo === "VOLEY_PLAYA") {
      // Happy Hour aplica SOLO si toda la reserva está dentro de 16:00-20:00
      const [horaInicio, minInicio] = formData.horaInicio.split(":").map(Number);
      const minutosInicio = horaInicio * 60 + (minInicio || 0);
      const minutosFin = minutosInicio + (formData.duracionHoras * 60);
      
      // Happy Hour: 16:00 (960 min) a 20:00 (1200 min)
      const happyHourInicio = 16 * 60; // 960
      const happyHourFin = 20 * 60; // 1200
      
      const esHappyHour = config.tieneHappyHour && 
                          minutosInicio >= happyHourInicio && 
                          minutosFin <= happyHourFin;

      if (formData.duracionHoras === 1) precio = config.precioHora1 || 80000;
      else if (formData.duracionHoras === 2) precio = esHappyHour && config.precioHora2HappyHour ? config.precioHora2HappyHour : config.precioHora2 || 130000;
      else if (formData.duracionHoras === 3) precio = config.precioHora3 || 180000;
    } else if (cancha.tipo === "MINI_GOLF") {
      const precioPorPersona = formData.cantidadCircuitos === 2 ? config.precioPersona2Circuitos || 45000 : config.precioPersona1Circuito || 25000;
      precio = precioPorPersona * formData.cantidadPersonas;
    }

    setPrecioCalculado(precio);
  };

  const handleCanchaChange = (canchaId: string) => {
    const cancha = canchas.find((c) => c.id === canchaId);
    setFormData({ ...formData, canchaId, tipoCanchaSeleccionada: cancha?.tipo || "", horaInicio: "", fecha: "" });
    setHorariosDisponibles([]);
    setPrecioCalculado(null);
  };

  const handleTabChange = (value: string) => {
    setTipoActivo(value as "voley" | "minigolf");
    // Resetear formulario al cambiar de tab
    setFormData({
      canchaId: "",
      tipoCanchaSeleccionada: "",
      fecha: "",
      horaInicio: "",
      duracionHoras: value === "voley" ? 1 : 2,
      nombreCliente: "",
      emailCliente: "",
      telefonoCliente: "",
      cantidadPersonas: 1,
      cantidadCircuitos: 1,
      notas: "",
    });
    setHorariosDisponibles([]);
    setMotivoNoDisponible("");
    setPrecioCalculado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación adicional de horario en frontend
    const cancha = canchas.find((c) => c.id === formData.canchaId);
    if (cancha && formData.horaInicio && formData.duracionHoras) {
      const [horaInicio, minInicio] = formData.horaInicio.split(':').map(Number);
      const [horaCierre, minCierre] = cancha.horaCierre.split(':').map(Number);
      
      let minutosInicio = horaInicio * 60 + minInicio;
      let minutosCierre = horaCierre * 60 + minCierre;
      
      // Si cierre es medianoche (00:00), considerarlo como final del día (1440 minutos)
      if (minutosCierre === 0) {
        minutosCierre = 1440;
      }
      
      const minutosFin = minutosInicio + (formData.duracionHoras * 60);
      
      if (minutosFin > minutosCierre) {
        toast({
          title: "Horario inválido",
          description: `La reserva excedería el horario de cierre (${cancha.horaCierre}). Por favor selecciona un horario más temprano o reduce la duración.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);

    try {
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

      const response = await reservasService.createReserva(data);
      setReservaCreada(response.reserva);
      setWhatsappNumero(response.whatsappNumero);

      // Enviar notificaciones automáticas de WhatsApp
      if (response.whatsappNumero) {
        enviarNotificacionesNuevaReserva(
          response.reserva,
          response.whatsappNumero,
          formData.telefonoCliente
        );
      }

      toast({
        title: "¡Reserva creada exitosamente!",
        description: `Tu reserva ha sido registrada. Se abrirán las ventanas de WhatsApp.`,
      });
    } catch (error: any) {
      toast({
        title: "Error al crear reserva",
        description: error.response?.data?.message || "Ocurrió un error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Si se creó una reserva, mostrar confirmación
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
                <p><strong>Cancha:</strong> {reservaCreada.cancha.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(reservaCreada.fecha).toLocaleDateString()}</p>
                <p><strong>Horario:</strong> {reservaCreada.horaInicio} - {reservaCreada.horaFin}</p>
                <p><strong>Cliente:</strong> {reservaCreada.nombreCliente}</p>
                <p className="text-xl font-bold text-primary">
                  <strong>Precio Total:</strong> ${reservaCreada.precioTotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 text-sm">
                <p className="font-semibold">✅ Reserva Confirmada</p>
                <p className="mt-2">Te esperamos en South Park. Cualquier consulta, contáctanos por WhatsApp.</p>
              </div>
              
              {whatsappNumero && (
                <Button 
                  onClick={() => {
                    const mensaje = generarMensajeReserva(reservaCreada);
                    abrirWhatsApp(whatsappNumero, mensaje);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enviar reserva por WhatsApp
                </Button>
              )}
              
              <Button onClick={() => {
                setReservaCreada(null);
                setWhatsappNumero(null);
              }} className="w-full" variant="outline">
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
            Sistema de reservas en línea - Elegí tu deporte y horario
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={tipoActivo} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="voley" className="text-lg">
                <Volleyball className="w-5 h-5 mr-2" />
                Voley Playa
              </TabsTrigger>
              <TabsTrigger value="minigolf" className="text-lg">
                <Flag className="w-5 h-5 mr-2" />
                Mini Golf
              </TabsTrigger>
            </TabsList>

            {/* TAB DE VOLEY PLAYA */}
            <TabsContent value="voley">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario Voley */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Volleyball className="w-6 h-6" />
                      Reserva Voley Playa
                    </CardTitle>
                    <CardDescription>
                      4 canchas disponibles - Lunes a Sábado, 4pm a 12am
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-4">
                      {/* Seleccionar Cancha Voley */}
                      <div>
                        <Label htmlFor="cancha-voley">Cancha</Label>
                        <Select value={formData.canchaId} onValueChange={handleCanchaChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cancha" />
                          </SelectTrigger>
                          <SelectContent>
                            {canchasVoley.map((cancha) => (
                              <SelectItem key={cancha.id} value={cancha.id}>
                                {cancha.nombre}
                                <Badge className="ml-2" variant="outline">Disponible</Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fecha */}
                      <div>
                        <Label htmlFor="fecha-voley">Fecha</Label>
                        <Input
                          id="fecha-voley"
                          type="date"
                          value={formData.fecha}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                          required
                        />
                      </div>
                      </div>

                      {/* Calendario de Horarios - Siempre visible */}
                      <div>
                        <Label className="text-lg font-semibold mb-3 block">Selecciona tu Horario</Label>
                        <CalendarioHorarios
                          horarios={horariosDisponibles}
                          horaSeleccionada={formData.horaInicio}
                          onSeleccionarHora={(hora) => setFormData({ ...formData, horaInicio: hora })}
                          loading={loadingHorarios}
                          motivoNoDisponible={motivoNoDisponible}
                        />
                      </div>

                      <div className="space-y-4">
                      {/* Duración */}
                      <div>
                        <Label htmlFor="duracion">Duración</Label>
                        <Select
                          value={formData.duracionHoras.toString()}
                          onValueChange={(value) => setFormData({ ...formData, duracionHoras: parseInt(value) })}
                          required
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hora - $80.000</SelectItem>
                            <SelectItem value="2">2 horas - $110.000 (4-8pm) / $130.000 (8-12am)</SelectItem>
                            <SelectItem value="3">3 horas - $180.000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cantidad de personas */}
                      <div>
                        <Label htmlFor="personas-voley">Cantidad de Personas</Label>
                        <Input
                          id="personas-voley"
                          type="number"
                          min="1"
                          max="12"
                          placeholder="Hasta 12 personas"
                          value={formData.cantidadPersonas}
                          onChange={(e) => setFormData({ ...formData, cantidadPersonas: parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      {/* Datos del cliente */}
                      <div>
                        <Label htmlFor="nombre-voley">Nombre Completo</Label>
                        <Input
                          id="nombre-voley"
                          placeholder="Tu nombre"
                          value={formData.nombreCliente}
                          onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-voley">Email</Label>
                        <Input
                          id="email-voley"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.emailCliente}
                          onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefono-voley">Teléfono</Label>
                        <Input
                          id="telefono-voley"
                          type="tel"
                          placeholder="+57 300 123 4567"
                          value={formData.telefonoCliente}
                          onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="notas-voley">Notas (opcional)</Label>
                        <Input
                          id="notas-voley"
                          placeholder="Alguna observación..."
                          value={formData.notas}
                          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        />
                      </div>

                      {/* Precio */}
                      {precioCalculado !== null && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Precio Total:</p>
                          <p className="text-3xl font-bold text-primary">${precioCalculado.toLocaleString()}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                        disabled={loading}
                      >
                        {loading ? "Creando reserva..." : "Reservar Voley"}
                      </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Info Voley */}
                <div className="space-y-4">
                  <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Horarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">Lunes a Sábado</p>
                      <p className="text-3xl font-bold">16:00 - 00:00 hs</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary text-secondary-foreground">
                    <CardHeader>
                      <CardTitle>💰 Precios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>1 hora</span>
                        <span className="font-bold">$80.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>2 horas (4-8pm)</span>
                        <Badge variant="secondary">$110.000 🎉</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>2 horas (8-12am)</span>
                        <span className="font-bold">$130.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3 horas</span>
                        <span className="font-bold">$180.000</span>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-100 text-yellow-900 rounded">
                        <p className="text-sm font-semibold">⭐ Happy Hour</p>
                        <p className="text-xs">4pm - 8pm: 2 horas solo $110.000</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Disponibilidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {canchasVoley.map((cancha) => (
                          <div key={cancha.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>{cancha.nombre}</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Disponible
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB DE MINI GOLF */}
            <TabsContent value="minigolf">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario Mini Golf */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Flag className="w-6 h-6" />
                      Reserva Mini Golf
                    </CardTitle>
                    <CardDescription>
                      2 circuitos de 18 hoyos - Jueves a Domingo, 4pm a 10pm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-4">
                      {/* Seleccionar Circuito */}
                      <div>
                        <Label htmlFor="cancha-golf">Circuito</Label>
                        <Select value={formData.canchaId} onValueChange={handleCanchaChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar circuito" />
                          </SelectTrigger>
                          <SelectContent>
                            {canchasMiniGolf.map((cancha) => (
                              <SelectItem key={cancha.id} value={cancha.id}>
                                {cancha.nombre}
                                <Badge className="ml-2" variant="outline">18 hoyos</Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fecha */}
                      <div>
                        <Label htmlFor="fecha-golf">Fecha</Label>
                        <Input
                          id="fecha-golf"
                          type="date"
                          value={formData.fecha}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                          required
                        />
                      </div>

                      </div>

                      {/* Calendario de Horarios - Siempre visible */}
                      <div>
                        <Label className="text-lg font-semibold mb-3 block">Selecciona tu Horario</Label>
                        <CalendarioHorarios
                          horarios={horariosDisponibles}
                          horaSeleccionada={formData.horaInicio}
                          onSeleccionarHora={(hora) => setFormData({ ...formData, horaInicio: hora })}
                          loading={loadingHorarios}
                          motivoNoDisponible={motivoNoDisponible}
                        />
                      </div>

                      <div className="space-y-4">
                      {/* Cantidad de personas */}
                      <div>
                        <Label htmlFor="personas-golf">Cantidad de Personas</Label>
                        <Input
                          id="personas-golf"
                          type="number"
                          min="1"
                          placeholder="Número de jugadores"
                          value={formData.cantidadPersonas}
                          onChange={(e) => setFormData({ ...formData, cantidadPersonas: parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      {/* Cantidad de Circuitos */}
                      <div>
                        <Label htmlFor="circuitos">¿Cuántos circuitos?</Label>
                        <Select
                          value={formData.cantidadCircuitos.toString()}
                          onValueChange={(value) => setFormData({ ...formData, cantidadCircuitos: parseInt(value) })}
                          required
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 circuito - $25.000/persona</SelectItem>
                            <SelectItem value="2">2 circuitos - $45.000/persona</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Datos del cliente */}
                      <div>
                        <Label htmlFor="nombre-golf">Nombre Completo</Label>
                        <Input
                          id="nombre-golf"
                          placeholder="Tu nombre"
                          value={formData.nombreCliente}
                          onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-golf">Email</Label>
                        <Input
                          id="email-golf"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.emailCliente}
                          onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefono-golf">Teléfono</Label>
                        <Input
                          id="telefono-golf"
                          type="tel"
                          placeholder="+57 300 123 4567"
                          value={formData.telefonoCliente}
                          onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="notas-golf">Notas (opcional)</Label>
                        <Input
                          id="notas-golf"
                          placeholder="Alguna observación..."
                          value={formData.notas}
                          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        />
                      </div>

                      {/* Precio */}
                      {precioCalculado !== null && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Precio Total:</p>
                          <p className="text-3xl font-bold text-primary">${precioCalculado.toLocaleString()}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
                        disabled={loading}
                      >
                        {loading ? "Creando reserva..." : "Reservar Mini Golf"}
                      </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Info Mini Golf */}
                <div className="space-y-4">
                  <Card className="bg-accent text-accent-foreground">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Horarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">Jueves a Domingo</p>
                      <p className="text-3xl font-bold">16:00 - 22:00 hs</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary text-secondary-foreground">
                    <CardHeader>
                      <CardTitle>💰 Precios por Persona</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>1 circuito (18 hoyos)</span>
                        <span className="font-bold text-xl">$25.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>2 circuitos (36 hoyos)</span>
                        <Badge variant="secondary" className="text-lg">$45.000 🎯</Badge>
                      </div>
                      <div className="mt-4 p-3 bg-blue-100 text-blue-900 rounded">
                        <p className="text-sm font-semibold">ℹ️ Ejemplo</p>
                        <p className="text-xs">4 personas x 2 circuitos = $180.000</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flag className="w-5 h-5" />
                        Circuitos Disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {canchasMiniGolf.map((cancha) => (
                          <div key={cancha.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium">{cancha.nombre}</p>
                              <p className="text-sm text-muted-foreground">18 hoyos</p>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Disponible
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info General */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle>Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Pago en el lugar</p>
                  <p className="text-sm text-muted-foreground">Abona al llegar al complejo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold">Confirmación Inmediata</p>
                  <p className="text-sm text-muted-foreground">Recibí tu comprobante al instante</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold">Reserva con Anticipación</p>
                  <p className="text-sm text-muted-foreground">Elegí tu mejor horario</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Reservas;
