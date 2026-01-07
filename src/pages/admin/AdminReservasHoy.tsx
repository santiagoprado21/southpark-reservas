import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Volleyball,
  Flag,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { reservasService } from "@/services/reservas.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminReservasHoy = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState<any[]>([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null);
  const [accionDialog, setAccionDialog] = useState<"confirmar" | "cancelar" | null>(null);
  
  // Obtener el rol del usuario
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  useEffect(() => {
    cargarReservasHoy();
  }, []);

  const cargarReservasHoy = async () => {
    try {
      setLoading(true);
      const hoy = format(new Date(), "yyyy-MM-dd");
      const response = await reservasService.getReservas({ fecha: hoy });
      
      // Ordenar por hora de inicio
      const ordenadas = response.reservas.sort((a, b) => {
        return a.horaInicio.localeCompare(b.horaInicio);
      });
      
      setReservas(ordenadas);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas de hoy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.updateEstadoReserva(reservaSeleccionada.id, "CONFIRMADA");
      toast({
        title: "Reserva confirmada",
        description: "La reserva ha sido confirmada exitosamente",
      });
      cargarReservasHoy();
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
      cargarReservasHoy();
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

  const getEstadoBadge = (estado: string) => {
    const badges = {
      PENDIENTE: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendiente</Badge>,
      CONFIRMADA: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Confirmada</Badge>,
      COMPLETADA: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Completada</Badge>,
      CANCELADA: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelada</Badge>,
    };
    return badges[estado as keyof typeof badges] || badges.PENDIENTE;
  };

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

  const stats = {
    total: reservas.length,
    pendientes: reservas.filter((r) => r.estado === "PENDIENTE").length,
    confirmadas: reservas.filter((r) => r.estado === "CONFIRMADA").length,
    ingresos: reservas
      .filter((r) => r.estado === "CONFIRMADA" || r.pagoCompletado)
      .reduce((sum, r) => sum + r.precioTotal, 0),
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Reservas de Hoy</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.ingresos.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Reservas</CardTitle>
          <CardDescription>Todas las reservas para el día de hoy</CardDescription>
        </CardHeader>
        <CardContent>
          {reservas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No hay reservas para hoy</p>
              <p className="text-muted-foreground">Las reservas aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
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
                          <span>{reserva.horaInicio} - {reserva.horaFin}</span>
                          <span>•</span>
                          <span>{reserva.duracionHoras}h</span>
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
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {reserva.cantidadPersonas} personas
                        </p>
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

                  {isAdmin && reserva.estado === "PENDIENTE" && (
                    <div className="flex flex-col sm:flex-row gap-2">
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

export default AdminReservasHoy;

