import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sp-blue/10 via-background to-sp-yellow/10">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="mb-6 flex justify-center">
          <div className="bg-sp-red/10 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-sp-red" />
          </div>
        </div>
        <h1 className="mb-4 text-6xl font-display font-bold text-sp-blue">404</h1>
        <p className="mb-2 text-2xl font-poppins font-semibold text-foreground">
          Página no encontrada
        </p>
        <p className="mb-8 text-muted-foreground">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-sp-yellow text-secondary-foreground hover:bg-sp-yellow/90 font-poppins font-semibold"
          size="lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
