import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Volleyball,
  Flag,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Phone,
  Mail,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reservasService } from "@/services/reservas.service";
import { canchasService, Cancha } from "@/services/canchas.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { enviarConfirmacionCliente } from "@/utils/whatsapp";

const AdminReservas = () => {
  const { toast } = useToast();
  const [reservas, setReservas] = useState<any[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: "TODOS",
    fecha: "",
    email: "",
    tipoServicio: "TODOS",
  });
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null);
  const [accionDialog, setAccionDialog] = useState<"confirmar" | "cancelar" | null>(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  
  // Obtener el rol del usuario
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";
  
  const [formData, setFormData] = useState({
    canchaId: "",
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

  useEffect(() => {
    cargarDatos();
  }, [filtros.estado, filtros.fecha, filtros.email, filtros.tipoServicio]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filtros.estado && filtros.estado !== "TODOS") params.estado = filtros.estado;
      if (filtros.fecha) params.fecha = filtros.fecha;
      if (filtros.email) params.email = filtros.email;
      if (isAdmin && filtros.tipoServicio && filtros.tipoServicio !== "TODOS") {
        params.tipoServicio = filtros.tipoServicio;
      }
      
      const [reservasRes, canchasRes] = await Promise.all([
        reservasService.getReservas(params),
        canchasService.getCanchas(),
      ]);
      setReservas(reservasRes.reservas);
      setCanchas(canchasRes);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      const errorMessage = error.response?.data?.message || error.message || "No se pudieron cargar los datos";
      toast({
        title: "Error al cargar reservas",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearReserva = async () => {
    try {
      await reservasService.createReserva(formData as any);
      toast({
        title: "Reserva creada",
        description: "La reserva ha sido creada exitosamente",
      });
      setModalCrear(false);
      resetForm();
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear la reserva",
        variant: "destructive",
      });
    }
  };

  const handleEditarReserva = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.updateReserva(reservaSeleccionada.id, formData as any);
      toast({
        title: "Reserva actualizada",
        description: "Los cambios han sido guardados exitosamente",
      });
      setModalEditar(false);
      setReservaSeleccionada(null);
      resetForm();
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar la reserva",
        variant: "destructive",
      });
    }
  };

  const abrirModalEditar = (reserva: any) => {
    setReservaSeleccionada(reserva);
    setFormData({
      canchaId: reserva.canchaId,
      fecha: format(new Date(reserva.fecha), "yyyy-MM-dd"),
      horaInicio: reserva.horaInicio,
      duracionHoras: reserva.duracionHoras,
      nombreCliente: reserva.nombreCliente,
      emailCliente: reserva.emailCliente,
      telefonoCliente: reserva.telefonoCliente,
      cantidadPersonas: reserva.cantidadPersonas,
      cantidadCircuitos: reserva.cantidadCircuitos || 1,
      notas: reserva.notas || "",
    });
    setModalEditar(true);
  };

  const handleConfirmar = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.updateEstadoReserva(reservaSeleccionada.id, "CONFIRMADA");
      
      // Enviar notificación de confirmación por WhatsApp al cliente
      enviarConfirmacionCliente(reservaSeleccionada, reservaSeleccionada.telefonoCliente);
      
      toast({
        title: "Reserva confirmada",
        description: "La reserva ha sido confirmada y se enviará notificación al cliente",
      });
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo confirmar la reserva",
        variant: "destructive",
      });
    } finally {
      setAccionDialog(null);
      setReservaSeleccionada(null);
    }
  };

  const handleCancelar = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.cancelarReserva(reservaSeleccionada.id);
      toast({
        title: "Reserva cancelada",
        description: "La reserva ha sido cancelada",
      });
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo cancelar la reserva",
        variant: "destructive",
      });
    } finally {
      setAccionDialog(null);
      setReservaSeleccionada(null);
    }
  };

  const resetForm = () => {
    setFormData({
      canchaId: "",
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
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      PENDIENTE: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendiente</Badge>,
      CONFIRMADA: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Confirmada</Badge>,
      COMPLETADA: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Completada</Badge>,
      CANCELADA: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelada</Badge>,
    };
    return badges[estado as keyof typeof badges] || badges.PENDIENTE;
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtros.estado !== "TODOS" && reserva.estado !== filtros.estado) return false;
    if (filtros.fecha && format(new Date(reserva.fecha), "yyyy-MM-dd") !== filtros.fecha) return false;
    if (filtros.email && !reserva.emailCliente.toLowerCase().includes(filtros.email.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Reservas</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isAdmin ? "Administra todas las reservas del sistema" : "Consulta las reservas del sistema"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setModalCrear(true)} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <Label htmlFor="filtro-estado">Estado</Label>
              <Select
                value={filtros.estado}
                onValueChange={(value) => setFiltros({ ...filtros, estado: value })}
              >
                <SelectTrigger id="filtro-estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtro-fecha">Fecha</Label>
              <Input
                id="filtro-fecha"
                type="date"
                value={filtros.fecha}
                onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="filtro-email">Buscar por Email</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filtro-email"
                  placeholder="email@ejemplo.com"
                  value={filtros.email}
                  onChange={(e) => setFiltros({ ...filtros, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {isAdmin && (
              <div>
                <Label htmlFor="filtro-servicio">Tipo de Servicio</Label>
                <Select
                  value={filtros.tipoServicio}
                  onValueChange={(value) => setFiltros({ ...filtros, tipoServicio: value })}
                >
                  <SelectTrigger id="filtro-servicio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos</SelectItem>
                    <SelectItem value="VOLEY_PLAYA">Voley Playa</SelectItem>
                    <SelectItem value="MINI_GOLF">Mini Golf</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFiltros({ estado: "TODOS", fecha: "", email: "", tipoServicio: "TODOS" })}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Rápidos */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{reservas.length}</div>
            <p className="text-sm text-muted-foreground">Total Reservas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {reservas.filter((r) => r.estado === "PENDIENTE").length}
            </div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {reservas.filter((r) => r.estado === "CONFIRMADA").length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${reservas
                .filter((r) => r.estado === "CONFIRMADA" || r.pagoCompletado)
                .reduce((sum, r) => sum + r.precioTotal, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Ingresos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas ({reservasFiltradas.length})</CardTitle>
          <CardDescription>
            Mostrando {reservasFiltradas.length} de {reservas.length} reservas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No hay reservas que mostrar</p>
              <p className="text-muted-foreground">Intenta ajustar los filtros</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservasFiltradas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {reserva.cancha.tipo === "VOLEY_PLAYA" ? (
                          <Volleyball className="h-6 w-6 text-primary" />
                        ) : (
                          <Flag className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{reserva.cancha.nombre}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(reserva.fecha), "dd MMM yyyy", { locale: es })} •{" "}
                            {reserva.horaInicio} - {reserva.horaFin}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getEstadoBadge(reserva.estado)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-semibold mb-2">Cliente</p>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {reserva.nombreCliente}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {reserva.telefonoCliente}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {reserva.emailCliente}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Detalles</p>
                      <div className="space-y-1 text-sm">
                        <p>{reserva.cantidadPersonas} personas</p>
                        <p className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Total: ${reserva.precioTotal.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {reserva.notas && (
                    <div className="mb-3 p-2 bg-muted rounded text-sm">
                      <strong>Notas:</strong> {reserva.notas}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirModalEditar(reserva)}
                        className="w-full sm:w-auto touch-manipulation"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      {reserva.estado === "PENDIENTE" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setReservaSeleccionada(reserva);
                              setAccionDialog("confirmar");
                            }}
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto touch-manipulation"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setReservaSeleccionada(reserva);
                              setAccionDialog("cancelar");
                            }}
                            className="w-full sm:w-auto touch-manipulation"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Crear Reserva */}
      <Dialog open={modalCrear} onOpenChange={setModalCrear}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Reserva</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la reserva
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cancha">Cancha *</Label>
              <Select
                value={formData.canchaId}
                onValueChange={(value) => {
                  const cancha = canchas.find((c) => c.id === value);
                  setFormData({ 
                    ...formData, 
                    canchaId: value,
                    duracionHoras: cancha?.tipo === "MINI_GOLF" ? 2 : 1,
                  });
                }}
              >
                <SelectTrigger id="cancha">
                  <SelectValue placeholder="Selecciona una cancha" />
                </SelectTrigger>
                <SelectContent>
                  {canchas.map((cancha) => (
                    <SelectItem key={cancha.id} value={cancha.id}>
                      {cancha.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="horaInicio">Hora Inicio *</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duracion">Duración (horas) *</Label>
                <Input
                  id="duracion"
                  type="number"
                  min="1"
                  max="3"
                  value={formData.duracionHoras}
                  onChange={(e) => setFormData({ ...formData, duracionHoras: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personas">Cantidad Personas *</Label>
                <Input
                  id="personas"
                  type="number"
                  min="1"
                  value={formData.cantidadPersonas}
                  onChange={(e) => setFormData({ ...formData, cantidadPersonas: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre Cliente *</Label>
              <Input
                id="nombre"
                value={formData.nombreCliente}
                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Cliente *</Label>
              <Input
                id="email"
                type="email"
                value={formData.emailCliente}
                onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono Cliente *</Label>
              <Input
                id="telefono"
                value={formData.telefonoCliente}
                onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                placeholder="3001234567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Información adicional..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setModalCrear(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCrearReserva}>
              Crear Reserva
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Reserva */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Modifica los datos de la reserva
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-cancha">Cancha *</Label>
              <Select
                value={formData.canchaId}
                onValueChange={(value) => {
                  const cancha = canchas.find((c) => c.id === value);
                  setFormData({ 
                    ...formData, 
                    canchaId: value,
                    duracionHoras: cancha?.tipo === "MINI_GOLF" ? 2 : 1,
                  });
                }}
              >
                <SelectTrigger id="edit-cancha">
                  <SelectValue placeholder="Selecciona una cancha" />
                </SelectTrigger>
                <SelectContent>
                  {canchas.map((cancha) => (
                    <SelectItem key={cancha.id} value={cancha.id}>
                      {cancha.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fecha">Fecha *</Label>
                <Input
                  id="edit-fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-horaInicio">Hora Inicio *</Label>
                <Input
                  id="edit-horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-duracion">Duración (horas) *</Label>
                <Input
                  id="edit-duracion"
                  type="number"
                  min="1"
                  max="3"
                  value={formData.duracionHoras}
                  onChange={(e) => setFormData({ ...formData, duracionHoras: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-personas">Cantidad Personas *</Label>
                <Input
                  id="edit-personas"
                  type="number"
                  min="1"
                  value={formData.cantidadPersonas}
                  onChange={(e) => setFormData({ ...formData, cantidadPersonas: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">Nombre Cliente *</Label>
              <Input
                id="edit-nombre"
                value={formData.nombreCliente}
                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Cliente *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.emailCliente}
                onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-telefono">Teléfono Cliente *</Label>
              <Input
                id="edit-telefono"
                value={formData.telefonoCliente}
                onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                placeholder="3001234567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-notas">Notas</Label>
              <Textarea
                id="edit-notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Información adicional..."
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
              <p className="font-semibold">⚠️ Nota:</p>
              <p>Si cambias la cancha, fecha, hora o duración, el precio se recalculará automáticamente.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setModalEditar(false); setReservaSeleccionada(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleEditarReserva}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación */}
      <AlertDialog open={accionDialog !== null} onOpenChange={() => setAccionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {accionDialog === "confirmar" ? "¿Confirmar reserva?" : "¿Cancelar reserva?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accionDialog === "confirmar"
                ? "Esta acción marcará la reserva como confirmada y el pago como completado."
                : "Esta acción cancelará la reserva. Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={accionDialog === "confirmar" ? handleConfirmar : handleCancelar}
              className={accionDialog === "confirmar" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReservas;
