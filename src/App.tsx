import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MisReservas from "./pages/MisReservas";
import Login from "./pages/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservasHoy from "./pages/admin/AdminReservasHoy";
import AdminReservas from "./pages/admin/AdminReservas";
import AdminBloqueos from "./pages/admin/AdminBloqueos";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="reservas-hoy" element={<AdminReservasHoy />} />
            <Route path="reservas" element={<AdminReservas />} />
            <Route path="bloqueos" element={<AdminBloqueos />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
