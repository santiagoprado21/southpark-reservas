import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Volleyball, Flag } from "lucide-react";

const Precios = () => {
  const precios = [
    {
      titulo: "Voley Playa",
      descripcion: "Cancha con arena de primera calidad",
      precio: "80.000",
      periodo: "por hora",
      color: "bg-sp-yellow text-secondary-foreground",
      icon: Volleyball,
      caracteristicas: [
        "Hasta 12 personas",
        "Arena profesional",
        "Red regulada",
        "Iluminación nocturna",
        "Vestuarios disponibles",
      ],
      precios_adicionales: [
        { duracion: "1 hora", precio: "$80.000" },
        { duracion: "2 horas (Happy Hour 4-8pm)", precio: "$110.000", destacado: true },
        { duracion: "2 horas (8-12am)", precio: "$130.000" },
        { duracion: "3 horas", precio: "$180.000" },
      ],
    },
    {
      titulo: "Mini Golf",
      descripcion: "18 hoyos temáticos y divertidos",
      precio: "25.000",
      periodo: "por persona",
      color: "bg-sp-green text-accent-foreground",
      icon: Flag,
      caracteristicas: [
        "Recorrido completo de 18 hoyos",
        "Palos y pelotas incluidos",
        "Apto para todas las edades",
        "Diseño tropical",
        "Fotos permitidas",
      ],
      precios_adicionales: [
        { duracion: "1 circuito (18 hoyos)", precio: "$25.000/persona" },
        { duracion: "2 circuitos (36 hoyos)", precio: "$45.000/persona", destacado: true },
      ],
    },
  ];

  // Promociones - Descomentar cuando se activen
  /* const promociones = [
    {
      dia: "Happy Hour",
      descuento: "¡OFERTA!",
      precio: "110.000",
      descripcion: "2 horas de Voley - 4pm a 8pm",
      highlight: true,
    },
    {
      dia: "Mini Golf Doble",
      descuento: "AHORRÁ",
      precio: "45.000",
      descripcion: "2 circuitos completos por persona",
      highlight: false,
    },
    {
      dia: "Eventos Privados",
      descuento: "Consultar",
      precio: "Precios especiales",
      descripcion: "Torneos, cumpleaños y eventos corporativos",
      highlight: false,
    },
  ]; */

  return (
    <section id="precios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Precios
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
                  <item.icon className={`w-10 h-10 ${item.titulo === 'Voley Playa' ? 'text-sp-yellow' : 'text-sp-green'}`} />
                  <Badge className={item.color}>{item.titulo}</Badge>
                </div>
                <CardTitle className="text-3xl mt-4">{item.titulo}</CardTitle>
                <CardDescription className="text-lg">{item.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Desde ${item.precio}</span>
                  <span className="text-muted-foreground ml-2">{item.periodo}</span>
                </div>
                
                {/* Precios detallados */}
                <div className="mb-6 space-y-2">
                  {item.precios_adicionales.map((precioItem, idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center p-2 rounded ${
                        precioItem.destacado ? 'bg-muted border-2 border-current' : ''
                      }`}
                    >
                      <span className="text-sm">{precioItem.duracion}</span>
                      <span className={`font-bold ${precioItem.destacado ? 'text-lg' : ''}`}>
                        {precioItem.precio}
                        {precioItem.destacado && ' ⭐'}
                      </span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {item.caracteristicas.map((caracteristica, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promociones - OCULTA TEMPORALMENTE */}
        {/* Descomentar cuando haya promociones especiales */}
        {/* <div className="max-w-5xl mx-auto">
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
        </div> */}

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
