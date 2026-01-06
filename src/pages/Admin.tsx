import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Volleyball,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: "TODOS",
    fecha: "",
    email: "",
  });
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null);
  const [accionDialog, setAccionDialog] = useState<"confirmar" | "cancelar" | null>(null);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    console.log("Admin useEffect - Token:", token ? "Existe" : "No existe");
    console.log("Admin useEffect - User:", userStr);

    if (!token || !userStr) {
      console.log("No hay token o user, redirigiendo a login");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      console.log("User data parseado:", userData);
      setUser(userData);
      cargarReservas();
    } catch (error) {
      console.error("Error al parsear user data:", error);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 100 };
      if (filtros.estado && filtros.estado !== "TODOS") params.estado = filtros.estado;
      if (filtros.fecha) params.fecha = filtros.fecha;
      if (filtros.email) params.email = filtros.email;

      const data = await reservasService.getReservas(params);
      setReservas(data.reservas);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast({
        title: "Error al cargar reservas",
        description: "No se pudieron cargar las reservas. Verifica que el backend esté corriendo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleConfirmarReserva = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.completarPago(reservaSeleccionada.id, {
        pagoId: null,
        metodoPago: "EFECTIVO",
      });

      toast({
        title: "Reserva confirmada",
        description: "La reserva ha sido confirmada exitosamente",
      });

      cargarReservas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar la reserva",
        variant: "destructive",
      });
    } finally {
      setAccionDialog(null);
      setReservaSeleccionada(null);
    }
  };

  const handleCancelarReserva = async () => {
    if (!reservaSeleccionada) return;

    try {
      await reservasService.cancelarReserva(reservaSeleccionada.id);

      toast({
        title: "Reserva cancelada",
        description: "La reserva ha sido cancelada",
      });

      cargarReservas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva",
        variant: "destructive",
      });
    } finally {
      setAccionDialog(null);
      setReservaSeleccionada(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: any = {
      PENDIENTE: { variant: "outline", icon: Clock, text: "Pendiente", color: "text-yellow-600" },
      CONFIRMADA: { variant: "default", icon: CheckCircle, text: "Confirmada", color: "text-green-600" },
      COMPLETADA: { variant: "secondary", icon: CheckCircle, text: "Completada", color: "text-blue-600" },
      CANCELADA: { variant: "destructive", icon: XCircle, text: "Cancelada", color: "text-red-600" },
    };

    const config = variants[estado] || variants.PENDIENTE;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calcular estadísticas
  const stats = {
    total: reservas.length,
    pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
    confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
    totalIngresos: reservas
      .filter(r => r.estado === 'CONFIRMADA' || r.estado === 'COMPLETADA')
      .reduce((sum, r) => sum + r.precioTotal, 0),
  };

  // Mostrar loading mientras verifica autenticación
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Volleyball className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">South Park Reservas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-medium">{user?.nombre}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.confirmadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${stats.totalIngresos.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Estado</Label>
                <Select
                  value={filtros.estado}
                  onValueChange={(value) => setFiltros({ ...filtros, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
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
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={filtros.fecha}
                  onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                />
              </div>
              <div>
                <Label>Email Cliente</Label>
                <Input
                  placeholder="Buscar por email..."
                  value={filtros.email}
                  onChange={(e) => setFiltros({ ...filtros, email: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={cargarReservas} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Reservas */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas</CardTitle>
            <CardDescription>Lista de todas las reservas del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p>Cargando reservas...</p>
              </div>
            ) : reservas.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hay reservas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{reserva.cancha.nombre}</h3>
                          {getEstadoBadge(reserva.estado)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatFecha(reserva.fecha)} • {reserva.horaInicio} - {reserva.horaFin}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${reserva.precioTotal.toLocaleString()}
                        </p>
                        {reserva.montoSena && (
                          <p className="text-sm text-muted-foreground">
                            Seña: ${reserva.montoSena.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm"><strong>Cliente:</strong> {reserva.nombreCliente}</p>
                        <p className="text-sm"><strong>Email:</strong> {reserva.emailCliente}</p>
                        <p className="text-sm"><strong>Teléfono:</strong> {reserva.telefonoCliente}</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Personas:</strong> {reserva.cantidadPersonas}</p>
                        {reserva.duracionHoras > 0 && (
                          <p className="text-sm"><strong>Duración:</strong> {reserva.duracionHoras}h</p>
                        )}
                        {reserva.cantidadCircuitos && (
                          <p className="text-sm"><strong>Circuitos:</strong> {reserva.cantidadCircuitos}</p>
                        )}
                      </div>
                    </div>

                    {reserva.notas && (
                      <div className="bg-muted/50 p-2 rounded text-sm mb-3">
                        <strong>Notas:</strong> {reserva.notas}
                      </div>
                    )}

                    {/* Acciones */}
                    {reserva.estado === 'PENDIENTE' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setReservaSeleccionada(reserva);
                            setAccionDialog("confirmar");
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setReservaSeleccionada(reserva);
                            setAccionDialog("cancelar");
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" />
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
      </div>

      {/* Dialogs de Confirmación */}
      <AlertDialog open={accionDialog === "confirmar"} onOpenChange={() => setAccionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres confirmar esta reserva? Esta acción indica que el pago ha sido recibido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarReserva}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={accionDialog === "cancelar"} onOpenChange={() => setAccionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelarReserva} className="bg-destructive">
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;

