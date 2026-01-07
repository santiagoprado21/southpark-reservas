import { useState, useEffect } from "react";
import { bloqueosService, Bloqueo } from "@/services/bloqueos.service";
import { canchasService, Cancha } from "@/services/canchas.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Edit, Trash2, ShieldAlert, Calendar, Clock } from "lucide-react";

const AdminBloqueos = () => {
  const { toast } = useToast();
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroCanchaId, setFiltroCanchaId] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("true");

  // Modal crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [bloqueoSeleccionado, setBloqueoSeleccionado] = useState<Bloqueo | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    canchaId: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    motivo: "",
  });

  // Alert dialog para eliminar
  const [alertEliminar, setAlertEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
    cargarCanchas();
  }, [filtroCanchaId, filtroFecha, filtroActivo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filtroCanchaId && filtroCanchaId !== "TODOS") params.canchaId = filtroCanchaId;
      if (filtroFecha) params.fecha = filtroFecha;
      if (filtroActivo !== "TODOS") params.activo = filtroActivo === "true";

      const data = await bloqueosService.getBloqueos(params);
      setBloqueos(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar bloqueos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarCanchas = async () => {
    try {
      const data = await canchasService.getCanchas();
      setCanchas(data);
    } catch (error) {
      console.error("Error al cargar canchas:", error);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setBloqueoSeleccionado(null);
    setFormData({
      canchaId: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      motivo: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (bloqueo: Bloqueo) => {
    setModoEdicion(true);
    setBloqueoSeleccionado(bloqueo);
    setFormData({
      canchaId: bloqueo.canchaId,
      fecha: format(new Date(bloqueo.fecha), "yyyy-MM-dd"),
      horaInicio: bloqueo.horaInicio,
      horaFin: bloqueo.horaFin,
      motivo: bloqueo.motivo,
    });
    setModalAbierto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modoEdicion && bloqueoSeleccionado) {
        await bloqueosService.updateBloqueo(bloqueoSeleccionado.id, formData);
        toast({
          title: "Bloqueo actualizado",
          description: "El bloqueo ha sido actualizado exitosamente",
        });
      } else {
        await bloqueosService.createBloqueo(formData);
        toast({
          title: "Bloqueo creado",
          description: "El bloqueo ha sido creado exitosamente",
        });
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar el bloqueo",
        variant: "destructive",
      });
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await bloqueosService.deleteBloqueo(id);
      toast({
        title: "Bloqueo eliminado",
        description: "El bloqueo ha sido desactivado exitosamente",
      });
      cargarDatos();
      setAlertEliminar(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el bloqueo",
        variant: "destructive",
      });
    }
  };

  const bloqueadosFiltrados = bloqueos;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Bloqueos</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Bloquea canchas para mantenimiento o eventos
          </p>
        </div>
        <Button onClick={abrirModalCrear} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Bloqueo
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <Label htmlFor="filtro-cancha" className="text-sm">Cancha</Label>
            <Select value={filtroCanchaId} onValueChange={setFiltroCanchaId}>
              <SelectTrigger id="filtro-cancha">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todas</SelectItem>
                {canchas.map((cancha) => (
                  <SelectItem key={cancha.id} value={cancha.id}>
                    {cancha.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filtro-fecha" className="text-sm">Fecha</Label>
            <Input
              id="filtro-fecha"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="filtro-activo" className="text-sm">Estado</Label>
            <Select value={filtroActivo} onValueChange={setFiltroActivo}>
              <SelectTrigger id="filtro-activo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFiltroCanchaId("");
                setFiltroFecha("");
                setFiltroActivo("true");
              }}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de bloqueos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : bloqueadosFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay bloqueos registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Crea un bloqueo para restringir el acceso a una cancha
          </p>
          <Button onClick={abrirModalCrear}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Bloqueo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bloqueadosFiltrados.map((bloqueo) => (
            <Card key={bloqueo.id} className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <ShieldAlert className={`h-5 w-5 ${bloqueo.activo ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {bloqueo.cancha.nombre}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bloqueo.activo
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {bloqueo.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(bloqueo.fecha), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {bloqueo.horaInicio} - {bloqueo.horaFin}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium">Motivo:</span> {bloqueo.motivo}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => abrirModalEditar(bloqueo)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setAlertEliminar(bloqueo.id)}
                    disabled={!bloqueo.activo}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {modoEdicion ? "Editar Bloqueo" : "Nuevo Bloqueo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cancha">Cancha *</Label>
              <Select
                value={formData.canchaId}
                onValueChange={(value) => setFormData({ ...formData, canchaId: value })}
                required
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

            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horaInicio">Hora Inicio *</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="horaFin">Hora Fin *</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="motivo">Motivo *</Label>
              <Textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Ej: Mantenimiento, Evento privado, etc."
                required
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {modoEdicion ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Eliminar */}
      <AlertDialog open={!!alertEliminar} onOpenChange={() => setAlertEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el bloqueo. La cancha volverá a estar disponible
              para reservas en este horario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alertEliminar && handleEliminar(alertEliminar)}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBloqueos;

