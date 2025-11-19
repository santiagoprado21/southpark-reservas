import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const Galeria = () => {
  const imagenes = [
    {
      src: gallery1,
      alt: "Grupo de amigos jugando voley playa",
      titulo: "Diversión con Amigos",
    },
    {
      src: gallery2,
      alt: "Mini golf colorido con obstáculos divertidos",
      titulo: "Mini Golf Temático",
    },
    {
      src: gallery3,
      alt: "Partido de voley al atardecer",
      titulo: "Atardeceres Épicos",
    },
    {
      src: gallery4,
      alt: "Vista aérea de cancha de voley",
      titulo: "Instalaciones de Primera",
    },
  ];

  return (
    <section id="galeria" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Viví la Experiencia
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mirá cómo se disfruta en South Park
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {imagenes.map((imagen, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <img
                src={imagen.src}
                alt={imagen.alt}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {imagen.titulo}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Lo que Dicen Nuestros Clientes
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-secondary text-xl">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "El mejor lugar para pasar el día con amigos. La arena es perfecta y el ambiente es increíble!"
              </p>
              <p className="font-semibold">- Martín R.</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-secondary text-xl">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Excelente para toda la familia. Mis hijos se divirtieron mucho con el mini golf!"
              </p>
              <p className="font-semibold">- Carolina M.</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-secondary text-xl">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Organizamos nuestro torneo acá. Todo impecable, muy profesionales. 100% recomendado!"
              </p>
              <p className="font-semibold">- Diego L.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
