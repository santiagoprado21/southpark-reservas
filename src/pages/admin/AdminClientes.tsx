import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Search,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { reservasService } from "@/services/reservas.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClienteStats {
  nombre: string;
  email: string;
  telefono: string;
  totalReservas: number;
  reservasConfirmadas: number;
  totalGastado: number;
  ultimaReserva: string;
  reservas: any[];
}

const AdminClientes = () => {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<ClienteStats[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteStats | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await reservasService.getReservas({});
      const todasReservas = response.reservas;

      // Agrupar por cliente
      const clientesMap: { [key: string]: ClienteStats } = {};

      todasReservas.forEach((reserva) => {
        const key = reserva.emailCliente;
        
        if (!clientesMap[key]) {
          clientesMap[key] = {
            nombre: reserva.nombreCliente,
            email: reserva.emailCliente,
            telefono: reserva.telefonoCliente,
            totalReservas: 0,
            reservasConfirmadas: 0,
            totalGastado: 0,
            ultimaReserva: reserva.fecha,
            reservas: [],
          };
        }

        clientesMap[key].totalReservas++;
        if (reserva.estado === "CONFIRMADA" || reserva.pagoCompletado) {
          clientesMap[key].reservasConfirmadas++;
          clientesMap[key].totalGastado += reserva.precioTotal;
        }

        // Actualizar última reserva
        if (new Date(reserva.fecha) > new Date(clientesMap[key].ultimaReserva)) {
          clientesMap[key].ultimaReserva = reserva.fecha;
        }

        clientesMap[key].reservas.push(reserva);
      });

      // Convertir a array y ordenar por total de reservas
      const clientesArray = Object.values(clientesMap).sort(
        (a, b) => b.totalReservas - a.totalReservas
      );

      setClientes(clientesArray);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.telefono.includes(busqueda)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Gestión de Clientes</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Base de datos de clientes y su historial de reservas
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Recurrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes.filter((c) => c.totalReservas > 1).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Más de 1 reserva
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes.length > 0
                ? (clientes.reduce((sum, c) => sum + c.totalReservas, 0) / clientes.length).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por cliente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Facturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {clientes
                .reduce((sum, c) => sum + c.totalGastado, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {clientesFiltrados.length} cliente(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {clientesFiltrados.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No se encontraron clientes
                </p>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.email}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      clienteSeleccionado?.email === cliente.email
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setClienteSeleccionado(cliente)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">{cliente.nombre}</p>
                        <div className="space-y-1 mt-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {cliente.telefono}
                          </p>
                        </div>
                      </div>
                      {cliente.totalReservas >= 5 && (
                        <Badge className="bg-yellow-500">VIP</Badge>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {cliente.totalReservas} reservas
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        ${cliente.totalGastado.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalle del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle del Cliente</CardTitle>
            <CardDescription>
              {clienteSeleccionado
                ? "Historial completo de reservas"
                : "Selecciona un cliente para ver su historial"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clienteSeleccionado ? (
              <div className="space-y-4">
                {/* Info del Cliente */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold text-lg mb-3">{clienteSeleccionado.nombre}</h3>
                  <div className="grid gap-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {clienteSeleccionado.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {clienteSeleccionado.telefono}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Última reserva:{" "}
                      {format(new Date(clienteSeleccionado.ultimaReserva), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>

                {/* Stats del Cliente */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{clienteSeleccionado.totalReservas}</p>
                    <p className="text-xs text-muted-foreground">Total Reservas</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {clienteSeleccionado.reservasConfirmadas}
                    </p>
                    <p className="text-xs text-muted-foreground">Confirmadas</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      ${clienteSeleccionado.totalGastado.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Gastado</p>
                  </div>
                </div>

                {/* Historial de Reservas */}
                <div>
                  <h4 className="font-semibold mb-3">Historial de Reservas</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {clienteSeleccionado.reservas
                      .sort(
                        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                      )
                      .map((reserva) => (
                        <div
                          key={reserva.id}
                          className="p-3 border rounded-lg text-sm"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold">{reserva.cancha.nombre}</span>
                            <Badge
                              variant={
                                reserva.estado === "CONFIRMADA"
                                  ? "default"
                                  : reserva.estado === "CANCELADA"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {reserva.estado}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {format(new Date(reserva.fecha), "dd MMM yyyy", { locale: es })} •{" "}
                            {reserva.horaInicio} - {reserva.horaFin}
                          </p>
                          <p className="font-semibold mt-1">
                            ${reserva.precioTotal.toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona un cliente de la lista para ver su información detallada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClientes;

