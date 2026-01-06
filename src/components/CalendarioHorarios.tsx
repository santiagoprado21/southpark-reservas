import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  motivo?: string;
}

interface CalendarioHorariosProps {
  horarios: HorarioDisponible[];
  horaSeleccionada: string;
  onSeleccionarHora: (hora: string) => void;
  loading?: boolean;
  motivoNoDisponible?: string;
}

const CalendarioHorarios = ({ horarios, horaSeleccionada, onSeleccionarHora, loading = false, motivoNoDisponible }: CalendarioHorariosProps) => {
  // Mostrar loading
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="animate-spin">
            <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ⏳ Cargando horarios...
          </h3>
          <p className="text-sm text-gray-600">
            Verificando disponibilidad en tiempo real
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mostrar mensaje si no hay horarios cargados
  const mostrarPlaceholder = horarios.length === 0;

  if (mostrarPlaceholder) {
    // Si hay un motivo específico (día no operativo o todos ocupados)
    if (motivoNoDisponible) {
      return (
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ⚠️ No Disponible
            </h3>
            <p className="text-sm text-gray-700 font-medium mb-2">
              {motivoNoDisponible}
            </p>
            <p className="text-xs text-gray-600">
              Por favor, selecciona otra fecha
            </p>
          </CardContent>
        </Card>
      );
    }

    // Mensaje por defecto cuando no se ha seleccionado nada
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📅 Selecciona Cancha y Fecha
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Primero elige una cancha y una fecha arriba para ver todos los horarios disponibles
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-gray-600">Ocupado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Horarios Disponibles</h3>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Ocupado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {horarios.map((horario) => {
          const isSelected = horaSeleccionada === horario.hora;
          const isDisponible = horario.disponible;

          return (
            <button
              key={horario.hora}
              type="button"
              onClick={() => isDisponible && onSeleccionarHora(horario.hora)}
              disabled={!isDisponible}
              className={cn(
                "relative p-3 rounded-lg border-2 transition-all duration-200",
                "flex flex-col items-center justify-center gap-1",
                "hover:scale-105 active:scale-95",
                isDisponible
                  ? isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                    : "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
                  : "bg-red-50 border-red-200 cursor-not-allowed opacity-60"
              )}
              title={!isDisponible ? horario.motivo : undefined}
            >
              {/* Hora */}
              <span className={cn(
                "text-lg font-bold",
                isSelected ? "text-primary-foreground" : isDisponible ? "text-green-700" : "text-red-700"
              )}>
                {horario.hora}
              </span>

              {/* Icono de estado */}
              {isDisponible ? (
                <CheckCircle2 className={cn(
                  "w-4 h-4",
                  isSelected ? "text-primary-foreground" : "text-green-600"
                )} />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}

              {/* Badge de seleccionado */}
              {isSelected && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-xs px-1 py-0">
                  ✓
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {horarios.filter(h => h.disponible).length} horarios disponibles de {horarios.length}
          </span>
        </div>
        {horaSeleccionada && (
          <div className="font-semibold text-primary">
            Seleccionado: {horaSeleccionada}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioHorarios;

