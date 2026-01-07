import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarClock,
  DollarSign,
  TrendingUp,
  Users,
  Volleyball,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reservasService } from "@/services/reservas.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reservasHoy: 0,
    reservasSemana: 0,
    ingresosHoy: 0,
    ingresosSemana: 0,
    reservasPendientes: 0,
    reservasConfirmadas: 0,
  });
  const [reservasRecientes, setReservasRecientes] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener todas las reservas
      const response = await reservasService.getReservas({});
      const todasReservas = response.reservas;

      // Fechas
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const inicioDeSemana = new Date(hoy);
      inicioDeSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
      
      // Calcular estadísticas
      const reservasHoy = todasReservas.filter((r) => {
        const fecha = new Date(r.fecha);
        fecha.setHours(0, 0, 0, 0);
        return fecha.getTime() === hoy.getTime();
      });

      const reservasSemana = todasReservas.filter((r) => {
        const fecha = new Date(r.fecha);
        return fecha >= inicioDeSemana;
      });

      const ingresosHoy = reservasHoy
        .filter((r) => r.estado === "CONFIRMADA" || r.pagoCompletado)
        .reduce((sum, r) => sum + r.precioTotal, 0);

      const ingresosSemana = reservasSemana
        .filter((r) => r.estado === "CONFIRMADA" || r.pagoCompletado)
        .reduce((sum, r) => sum + r.precioTotal, 0);

      const reservasPendientes = todasReservas.filter((r) => r.estado === "PENDIENTE").length;
      const reservasConfirmadas = todasReservas.filter((r) => r.estado === "CONFIRMADA").length;

      setStats({
        reservasHoy: reservasHoy.length,
        reservasSemana: reservasSemana.length,
        ingresosHoy,
        ingresosSemana,
        reservasPendientes,
        reservasConfirmadas,
      });

      // Últimas 5 reservas
      const recientes = todasReservas
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setReservasRecientes(recientes);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
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
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Resumen general de South Park Reservas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Reservas Hoy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasHoy}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reservasSemana} esta semana
            </p>
          </CardContent>
        </Card>

        {/* Ingresos Hoy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.ingresosHoy.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats.ingresosSemana.toLocaleString()} esta semana
            </p>
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Esperando confirmación
            </p>
          </CardContent>
        </Card>

        {/* Confirmadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasConfirmadas}</div>
            <p className="text-xs text-muted-foreground">
              Pagos completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reservas Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recientes</CardTitle>
          <CardDescription>Últimas reservas registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservasRecientes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay reservas recientes
              </p>
            ) : (
              reservasRecientes.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/reservas")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {reserva.cancha.tipo === "VOLEY_PLAYA" ? (
                        <Volleyball className="h-5 w-5 text-primary" />
                      ) : (
                        <Flag className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{reserva.nombreCliente}</p>
                      <p className="text-sm text-muted-foreground">
                        {reserva.cancha.nombre} • {" "}
                        {format(new Date(reserva.fecha), "dd MMM", { locale: es })} • {" "}
                        {reserva.horaInicio} - {reserva.horaFin}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {getEstadoBadge(reserva.estado)}
                    <p className="text-sm font-semibold">
                      ${reserva.precioTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={() => navigate("/admin/reservas-hoy")}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <CalendarClock className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold">Ver Reservas de Hoy</p>
              <p className="text-sm text-muted-foreground">
                {stats.reservasHoy} reservas
              </p>
            </button>
            
            <button
              onClick={() => navigate("/admin/reservas")}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold">Gestionar Reservas</p>
              <p className="text-sm text-muted-foreground">
                Ver todas las reservas
              </p>
            </button>
            
            <button
              onClick={() => navigate("/admin/reportes")}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold">Ver Reportes</p>
              <p className="text-sm text-muted-foreground">
                Estadísticas detalladas
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

