import { Heart, Users, Trophy, Sparkles } from "lucide-react";

const Nosotros = () => {
  const valores = [
    {
      icon: Heart,
      titulo: "Pasión por el Deporte",
      descripcion: "Amamos lo que hacemos y queremos compartir esa pasión con vos",
      color: "text-destructive",
    },
    {
      icon: Users,
      titulo: "Ambiente Familiar",
      descripcion: "Un espacio para todas las edades, donde todos son bienvenidos",
      color: "text-primary",
    },
    {
      icon: Trophy,
      titulo: "Calidad Premium",
      descripcion: "Las mejores instalaciones y mantenimiento constante",
      color: "text-secondary",
    },
    {
      icon: Sparkles,
      titulo: "Diversión Garantizada",
      descripcion: "Cada visita es una nueva aventura y momento inolvidable",
      color: "text-accent",
    },
  ];

  return (
    <section id="nosotros" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent to-destructive bg-clip-text text-transparent">
              Conocé South Park
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Más que un complejo deportivo, somos una comunidad
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Historia */}
          <div className="bg-card p-8 rounded-2xl shadow-lg mb-12">
            <h3 className="text-3xl font-bold mb-6 text-center">Nuestra Historia</h3>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                South Park nació del sueño de crear un espacio donde el deporte, la diversión y la amistad se encuentran. 
                Comenzamos con una cancha de voley playa y la visión de construir un lugar especial para nuestra comunidad.
              </p>
              <p>
                Con el tiempo, agregamos el mini golf y otras actividades, siempre manteniendo nuestro compromiso con la calidad 
                y el ambiente familiar que nos caracteriza. Hoy somos el destino preferido para quienes buscan pasar un gran momento 
                al aire libre.
              </p>
              <p>
                Nuestro equipo trabaja cada día para mantener las instalaciones impecables y crear experiencias memorables. 
                Ya sea que vengas a jugar un partido competitivo o simplemente a disfrutar con amigos, en South Park encontrás 
                tu lugar.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid md:grid-cols-2 gap-6">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`${valor.color} bg-muted p-3 rounded-full`}>
                    <valor.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{valor.titulo}</h4>
                    <p className="text-muted-foreground">{valor.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Llamado a la acción */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold mb-4">¿Listo para la Aventura?</h3>
            <p className="text-xl text-muted-foreground mb-6">
              Vení a South Park y descubrí por qué somos el mejor complejo deportivo de la zona
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold">
                +10,000 visitantes felices
              </span>
              <span className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold">
                5⭐ en Google
              </span>
              <span className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-semibold">
                Arena Premium
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
