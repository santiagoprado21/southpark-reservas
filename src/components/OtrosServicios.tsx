import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const OtrosServicios = () => {
  // Números de WhatsApp (ACTUALIZAR CON LOS REALES)
  const WHATSAPP_SINTETICAS = "573187878792"; 
  const WHATSAPP_TENIS = "573189023553"; 

  const abrirWhatsAppServicio = (numero: string, servicio: string) => {
    const mensaje = `¡Hola! Me gustaría consultar disponibilidad y precios para ${servicio} en South Park.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="otros-servicios" className="py-12 md:py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3 md:mb-4 font-poppins">
            Otros Servicios
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            También contamos con canchas sintéticas y tenis. Contactanos por WhatsApp para reservar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Canchas Sintéticas */}
          <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow duration-300 mx-auto w-full max-w-md md:max-w-none">
            <CardHeader className="bg-gradient-to-br from-green-500 to-green-600 text-white py-6 md:py-8">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="bg-white p-3 md:p-4 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 md:w-12 md:h-12"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 0 0 20" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
                    <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-center">
                Canchas Sintéticas
              </CardTitle>
              <CardDescription className="text-white/90 text-center text-sm md:text-base">
                Fútbol 5 y 7
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                <p className="text-gray-700 text-center text-sm md:text-base">
                  Canchas de fútbol sintético con iluminación profesional para tus partidos.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                  <li className="flex items-center">
                    <span className="mr-2">⚽</span>
                    Canchas de fútbol 5 y 7
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">💡</span>
                    Iluminación nocturna
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🏆</span>
                    Césped sintético de calidad
                  </li>
                </ul>
                <Button
                  onClick={() => abrirWhatsAppServicio(WHATSAPP_SINTETICAS, "Canchas Sintéticas")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-5 md:py-6 text-base md:text-lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Reservar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tenis */}
          <Card className="border-2 border-orange-500 hover:shadow-xl transition-shadow duration-300 mx-auto w-full max-w-md md:max-w-none">
            <CardHeader className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-6 md:py-8">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="bg-white p-3 md:p-4 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-600 md:w-12 md:h-12"
                  >
                    <ellipse cx="12" cy="11" rx="3" ry="9" />
                    <path d="M7 5.5a9 9 0 1 1 10 0" />
                    <path d="M7 16.5a9 9 0 0 0 10 0" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-center">
                Tenis
              </CardTitle>
              <CardDescription className="text-white/90 text-center text-sm md:text-base">
                Cancha profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                <p className="text-gray-700 text-center text-sm md:text-base">
                  Cancha de tenis con superficie profesional para disfrutar de tu deporte favorito.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                  <li className="flex items-center">
                    <span className="mr-2">🎾</span>
                    Superficie de polvo de ladrillo
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🌙</span>
                    Disponible de día y noche
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🏅</span>
                    Equipamiento de calidad
                  </li>
                </ul>
                <Button
                  onClick={() => abrirWhatsAppServicio(WHATSAPP_TENIS, "Tenis")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 md:py-6 text-base md:text-lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Reservar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 md:mt-8 text-center px-4">
          <p className="text-gray-500 text-xs md:text-sm">
            * Precios y disponibilidad sujetos a confirmación por WhatsApp
          </p>
        </div>
      </div>
    </section>
  );
};

export default OtrosServicios;

