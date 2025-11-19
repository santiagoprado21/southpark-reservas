import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-volleyball.jpg";

const Hero = () => {
  const scrollToReservas = () => {
    const element = document.getElementById("reservas");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Cancha de voley playa South Park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-16 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Jugá, Disfrutá y Viví
          </span>
          <br />
          <span className="text-foreground">
            la Experiencia South Park
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          El mejor complejo de voley playa y mini golf. Arena perfecta, ambiente familiar y diversión garantizada al aire libre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={scrollToReservas}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all group"
          >
            Reservá tu Cancha Hoy
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToReservas}
            className="text-lg px-8 py-6 border-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            Ver Precios
          </Button>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 left-10 hidden lg:block animate-float">
          <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold shadow-lg">
            ¡Voley Playa!
          </div>
        </div>
        <div className="absolute bottom-32 right-10 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
          <div className="bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold shadow-lg">
            ¡Mini Golf!
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
