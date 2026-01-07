import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  BarChart3,
  Users,
  ShieldAlert,
  UserCog,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

const allMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { id: "reservas-hoy", label: "Reservas Hoy", icon: CalendarClock, path: "/admin/reservas-hoy" },
  { id: "reservas", label: "Todas las Reservas", icon: Calendar, path: "/admin/reservas" },
  { id: "bloqueos", label: "Bloqueos", icon: ShieldAlert, path: "/admin/bloqueos" },
  { id: "reportes", label: "Reportes y Estadísticas", icon: BarChart3, path: "/admin/reportes" },
  { id: "clientes", label: "Gestión de Clientes", icon: Users, path: "/admin/clientes" },
  { id: "usuarios", label: "Usuarios del Sistema", icon: UserCog, path: "/admin/usuarios" },
];

// Opciones permitidas para empleados (solo lectura)
const empleadoMenuItems = ["dashboard", "reservas-hoy", "reservas"];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });
  
  // Filtrar menú según rol
  const isAdmin = user?.role === "ADMIN";
  const menuItems = isAdmin 
    ? allMenuItems 
    : allMenuItems.filter(item => empleadoMenuItems.includes(item.id));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const MenuContent = () => (
    <>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                "hover:bg-white/10",
                active && "bg-white/20 shadow-lg"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="mb-3 px-4 py-2 bg-white/10 rounded-lg">
            <p className="text-sm font-semibold">{user.nombre} {user.apellido}</p>
            <p className="text-xs opacity-80">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-white hover:bg-white/10 justify-start"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Cerrar Sesión</span>
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-primary text-white shadow-lg">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold">South Park Admin</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-primary to-primary/90 text-white border-0">
          <SheetHeader className="p-4 border-b border-white/10">
            <SheetTitle className="text-white text-left">South Park Admin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100%-80px)]">
            <MenuContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-gradient-to-b from-primary to-primary/90 text-white">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h1 className="text-xl font-bold">South Park Admin</h1>
          </div>
          <MenuContent />
        </aside>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          isMobile ? "pt-16" : "ml-64"
        )}
      >
        <div className={cn(
          "p-3 md:p-6"
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

