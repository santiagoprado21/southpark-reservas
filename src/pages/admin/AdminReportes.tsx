import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Volleyball,
  Flag,
  Clock,
  Users,
  FileDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { reservasService } from "@/services/reservas.service";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { generarReportePDF, generarReporteSimplePDF } from "@/utils/pdfGenerator";

const AdminReportes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "personalizado">("mes");
  const [fechaInicio, setFechaInicio] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [fechaFin, setFechaFin] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [reservasFiltradas, setReservasFiltradas] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReservas: 0,
    reservasConfirmadas: 0,
    reservasCanceladas: 0,
    ingresosTotales: 0,
    ingresosConfirmados: 0,
    tasaConversion: 0,
    canchasMasReservadas: [] as any[],
    horariosMasPopulares: [] as any[],
    clientesFrecuentes: [] as any[],
  });

  useEffect(() => {
    if (periodo === "semana") {
      setFechaInicio(format(startOfWeek(new Date()), "yyyy-MM-dd"));
      setFechaFin(format(endOfWeek(new Date()), "yyyy-MM-dd"));
    } else if (periodo === "mes") {
      setFechaInicio(format(startOfMonth(new Date()), "yyyy-MM-dd"));
      setFechaFin(format(endOfMonth(new Date()), "yyyy-MM-dd"));
    }
  }, [periodo]);

  useEffect(() => {
    cargarReportes();
  }, [fechaInicio, fechaFin]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const response = await reservasService.getReservas({});
      const todasReservas = response.reservas;

      // Filtrar por rango de fechas
      const reservasFiltradas = todasReservas.filter((r) => {
        const fechaReserva = format(new Date(r.fecha), "yyyy-MM-dd");
        return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
      });

      // Guardar reservas filtradas para PDF
      setReservasFiltradas(reservasFiltradas);

      // Calcular estadísticas
      const totalReservas = reservasFiltradas.length;
      const reservasConfirmadas = reservasFiltradas.filter((r) => r.estado === "CONFIRMADA").length;
      const reservasCanceladas = reservasFiltradas.filter((r) => r.estado === "CANCELADA").length;
      
      const ingresosTotales = reservasFiltradas.reduce((sum, r) => sum + r.precioTotal, 0);
      const ingresosConfirmados = reservasFiltradas
        .filter((r) => r.estado === "CONFIRMADA" || r.pagoCompletado)
        .reduce((sum, r) => sum + r.precioTotal, 0);

      const tasaConversion = totalReservas > 0 
        ? Math.round((reservasConfirmadas / totalReservas) * 100)
        : 0;

      // Canchas más reservadas
      const canchasCounts: { [key: string]: { cancha: any; count: number } } = {};
      reservasFiltradas.forEach((r) => {
        const key = r.cancha.id;
        if (!canchasCounts[key]) {
          canchasCounts[key] = { cancha: r.cancha, count: 0 };
        }
        canchasCounts[key].count++;
      });
      const canchasMasReservadas = Object.values(canchasCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Horarios más populares
      const horariosCounts: { [key: string]: number } = {};
      reservasFiltradas.forEach((r) => {
        const key = r.horaInicio;
        horariosCounts[key] = (horariosCounts[key] || 0) + 1;
      });
      const horariosMasPopulares = Object.entries(horariosCounts)
        .map(([hora, count]) => ({ hora, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Clientes frecuentes
      const clientesCounts: { [key: string]: { cliente: string; email: string; count: number } } = {};
      reservasFiltradas.forEach((r) => {
        const key = r.emailCliente;
        if (!clientesCounts[key]) {
          clientesCounts[key] = { cliente: r.nombreCliente, email: r.emailCliente, count: 0 };
        }
        clientesCounts[key].count++;
      });
      const clientesFrecuentes = Object.values(clientesCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalReservas,
        reservasConfirmadas,
        reservasCanceladas,
        ingresosTotales,
        ingresosConfirmados,
        tasaConversion,
        canchasMasReservadas,
        horariosMasPopulares,
        clientesFrecuentes,
      });
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDFCompleto = () => {
    try {
      generarReportePDF({
        fechaInicio,
        fechaFin,
        reservas: reservasFiltradas,
        totalReservas: stats.totalReservas,
        reservasConfirmadas: stats.reservasConfirmadas,
        ingresosTotales: stats.ingresosTotales,
        ingresosConfirmados: stats.ingresosConfirmados,
      });
      
      toast({
        title: "PDF generado",
        description: "El reporte ha sido descargado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  const handleDescargarPDFConfirmadas = () => {
    try {
      generarReporteSimplePDF({
        fechaInicio,
        fechaFin,
        reservas: reservasFiltradas,
        totalReservas: stats.totalReservas,
        reservasConfirmadas: stats.reservasConfirmadas,
        ingresosTotales: stats.ingresosTotales,
        ingresosConfirmados: stats.ingresosConfirmados,
      });
      
      toast({
        title: "PDF generado",
        description: "El reporte de reservas confirmadas ha sido descargado",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Generando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reportes y Estadísticas</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Análisis detallado del rendimiento del negocio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleDescargarPDFCompleto}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto touch-manipulation"
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Descargar PDF Completo</span>
            <span className="sm:hidden">PDF Completo</span>
          </Button>
          <Button 
            onClick={handleDescargarPDFConfirmadas}
            variant="outline"
            className="w-full sm:w-auto touch-manipulation"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Solo Confirmadas</span>
            <span className="sm:hidden">Confirmadas</span>
          </Button>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <Label>Seleccionar Período</Label>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setPeriodo("semana")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    periodo === "semana" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  Esta Semana
                </button>
                <button
                  onClick={() => setPeriodo("mes")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    periodo === "mes" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  Este Mes
                </button>
                <button
                  onClick={() => setPeriodo("personalizado")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    periodo === "personalizado" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  Personalizado
                </button>
              </div>
            </div>

            {periodo === "personalizado" && (
              <>
                <div>
                  <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Principales */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.reservasConfirmadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canceladas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.reservasCanceladas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasaConversion}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.ingresosTotales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmados: ${stats.ingresosConfirmados.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Canchas Más Reservadas */}
      <Card>
        <CardHeader>
          <CardTitle>Canchas Más Reservadas</CardTitle>
          <CardDescription>Top 5 canchas con más reservas en el período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.canchasMasReservadas.map((item, index) => (
              <div key={item.cancha.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.cancha.tipo === "VOLEY_PLAYA" ? (
                      <Volleyball className="h-5 w-5 text-primary" />
                    ) : (
                      <Flag className="h-5 w-5 text-primary" />
                    )}
                    <span className="font-semibold">{item.cancha.nombre}</span>
                  </div>
                </div>
                <Badge>{item.count} reservas</Badge>
              </div>
            ))}
            {stats.canchasMasReservadas.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No hay datos suficientes</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Horarios Más Populares */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios Más Populares</CardTitle>
            <CardDescription>Horas más reservadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.horariosMasPopulares.map((item, index) => (
                <div key={item.hora} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{item.hora}</span>
                  </div>
                  <Badge>{item.count} reservas</Badge>
                </div>
              ))}
              {stats.horariosMasPopulares.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No hay datos suficientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clientes Frecuentes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Frecuentes</CardTitle>
            <CardDescription>Top 5 clientes con más reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.clientesFrecuentes.map((item, index) => (
                <div key={item.email} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{item.cliente}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </div>
                  </div>
                  <Badge>{item.count} reservas</Badge>
                </div>
              ))}
              {stats.clientesFrecuentes.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No hay datos suficientes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportes;

