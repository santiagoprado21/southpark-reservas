import { useState, useEffect } from "react";
import { usuariosService, Usuario } from "@/services/usuarios.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Edit, Trash2, Users, Shield, UserCog, Mail, Calendar } from "lucide-react";

const AdminUsuarios = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroRole, setFiltroRole] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("true");

  // Modal crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    role: "EMPLEADO" as "ADMIN" | "EMPLEADO",
    servicioAsignado: "VOLEY_PLAYA" as "TODOS" | "VOLEY_PLAYA" | "MINI_GOLF" | undefined,
  });

  // Alert dialog para eliminar
  const [alertEliminar, setAlertEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [filtroRole, filtroActivo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filtroRole && filtroRole !== "TODOS") params.role = filtroRole;
      if (filtroActivo !== "TODOS") params.activo = filtroActivo === "true";

      const data = await usuariosService.getUsuarios(params);
      setUsuarios(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setUsuarioSeleccionado(null);
    setFormData({
      email: "",
      password: "",
      nombre: "",
      role: "EMPLEADO",
      servicioAsignado: "VOLEY_PLAYA",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);
    setFormData({
      email: usuario.email,
      password: "", // No mostramos la contraseña
      nombre: usuario.nombre,
      role: usuario.role,
      servicioAsignado: usuario.servicioAsignado || "VOLEY_PLAYA",
    });
    setModalAbierto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modoEdicion && usuarioSeleccionado) {
        // Si no se cambió la contraseña, no la enviamos
        const updateData: any = {
          email: formData.email,
          nombre: formData.nombre,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        await usuariosService.updateUsuario(usuarioSeleccionado.id, updateData);
        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente",
        });
      } else {
        await usuariosService.createUsuario(formData);
        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente",
        });
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await usuariosService.deleteUsuario(id);
      toast({
        title: "Usuario desactivado",
        description: "El usuario ha sido desactivado exitosamente",
      });
      cargarDatos();
      setAlertEliminar(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al desactivar el usuario",
        variant: "destructive",
      });
    }
  };

  const usuariosFiltrados = usuarios;

  // Stats
  const stats = {
    total: usuarios.length,
    admins: usuarios.filter((u) => u.role === "ADMIN" && u.activo).length,
    empleados: usuarios.filter((u) => u.role === "EMPLEADO" && u.activo).length,
    inactivos: usuarios.filter((u) => !u.activo).length,
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={abrirModalCrear} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Usuarios</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Admins</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.admins}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCog className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Empleados</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.empleados}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Inactivos</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.inactivos}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div>
            <Label htmlFor="filtro-role" className="text-sm">Rol</Label>
            <Select value={filtroRole} onValueChange={setFiltroRole}>
              <SelectTrigger id="filtro-role">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EMPLEADO">Empleado</SelectItem>
              </SelectContent>
            </Select>
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
                setFiltroRole("");
                setFiltroActivo("true");
              }}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de usuarios */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay usuarios registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Crea un usuario para dar acceso al sistema
          </p>
          <Button onClick={abrirModalCrear}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Usuario
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {usuariosFiltrados.map((usuario) => (
            <Card key={usuario.id} className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {usuario.role === "ADMIN" ? (
                        <Shield className="h-5 w-5 text-purple-600" />
                      ) : (
                        <UserCog className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {usuario.nombre}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {usuario.role === "ADMIN" ? "Admin" : "Empleado"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{usuario.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Creado: {format(new Date(usuario.createdAt), "dd/MM/yyyy", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => abrirModalEditar(usuario)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setAlertEliminar(usuario.id)}
                    disabled={!usuario.activo}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Desactivar
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
              {modoEdicion ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan@southpark.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                Contraseña {modoEdicion && "(dejar en blanco para mantener actual)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                required={!modoEdicion}
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "ADMIN" | "EMPLEADO") =>
                  setFormData({ ...formData, role: value })
                }
                required
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLEADO">Empleado</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === "ADMIN"
                  ? "Acceso completo al sistema"
                  : "Acceso limitado a funciones básicas"}
              </p>
            </div>

            <div>
              <Label htmlFor="servicioAsignado">Servicio Asignado *</Label>
              <Select
                value={formData.servicioAsignado}
                onValueChange={(value: "TODOS" | "VOLEY_PLAYA" | "MINI_GOLF") =>
                  setFormData({ ...formData, servicioAsignado: value })
                }
                required
              >
                <SelectTrigger id="servicioAsignado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.role === "ADMIN" && (
                    <SelectItem value="TODOS">Todos los servicios</SelectItem>
                  )}
                  <SelectItem value="VOLEY_PLAYA">Voley Playa</SelectItem>
                  <SelectItem value="MINI_GOLF">Mini Golf</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === "ADMIN"
                  ? "Puede filtrar entre todos los servicios"
                  : formData.servicioAsignado === "VOLEY_PLAYA"
                  ? "Solo verá reservas de Voley Playa"
                  : "Solo verá reservas de Mini Golf"}
              </p>
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
              Esta acción desactivará el usuario. No podrá acceder al sistema hasta que sea
              reactivado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alertEliminar && handleEliminar(alertEliminar)}
              className="bg-red-500 hover:bg-red-600"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsuarios;

