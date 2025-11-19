import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp } from "lucide-react";

const Precios = () => {
  const precios = [
    {
      titulo: "Voley Playa",
      descripcion: "Cancha con arena de primera calidad",
      precio: "15.000",
      periodo: "por hora",
      color: "bg-primary text-primary-foreground",
      icon: Star,
      caracteristicas: [
        "Hasta 12 personas",
        "Arena profesional",
        "Red regulada",
        "Iluminación nocturna",
        "Vestuarios disponibles",
      ],
    },
    {
      titulo: "Mini Golf",
      descripcion: "18 hoyos temáticos y divertidos",
      precio: "8.000",
      periodo: "por persona",
      color: "bg-accent text-accent-foreground",
      icon: TrendingUp,
      caracteristicas: [
        "Recorrido completo",
        "Palos y pelotas incluidos",
        "Apto para todas las edades",
        "Diseño tropical",
        "Fotos permitidas",
      ],
    },
  ];

  const promociones = [
    {
      dia: "Sábados Especiales",
      descuento: "¡MEGA OFERTA!",
      precio: "90.000",
      descripcion: "Día completo de voley playa",
      highlight: true,
    },
    {
      dia: "Combo Familiar",
      descuento: "20% OFF",
      precio: "Desde 50.000",
      descripcion: "Voley + Mini Golf para toda la familia",
      highlight: false,
    },
    {
      dia: "Torneos",
      descuento: "Consultar",
      precio: "Precios especiales",
      descripcion: "Organizamos tu torneo privado",
      highlight: false,
    },
  ];

  return (
    <section id="precios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-secondary to-destructive bg-clip-text text-transparent">
              Precios y Promociones
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tarifas accesibles para que disfrutes con amigos y familia
          </p>
        </div>

        {/* Precios Principales */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {precios.map((item, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:scale-105 transition-transform shadow-lg"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 ${item.color}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <item.icon className="w-10 h-10 text-primary" />
                  <Badge className={item.color}>{item.titulo}</Badge>
                </div>
                <CardTitle className="text-3xl mt-4">{item.titulo}</CardTitle>
                <CardDescription className="text-lg">{item.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${item.precio}</span>
                  <span className="text-muted-foreground ml-2">{item.periodo}</span>
                </div>
                <ul className="space-y-3">
                  {item.caracteristicas.map((caracteristica, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promociones */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Promociones Especiales
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {promociones.map((promo, index) => (
              <Card
                key={index}
                className={`text-center hover:scale-105 transition-transform ${
                  promo.highlight ? "border-4 border-destructive shadow-xl" : ""
                }`}
              >
                <CardHeader>
                  {promo.highlight && (
                    <Badge className="bg-destructive text-destructive-foreground mx-auto mb-2 text-lg px-4 py-1">
                      {promo.descuento}
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">{promo.dia}</CardTitle>
                  <div className="text-3xl font-bold text-primary mt-2">
                    ${promo.precio}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{promo.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nota */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            * Precios sujetos a cambios. Consultá por promociones vigentes al momento de tu reserva.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Precios;
