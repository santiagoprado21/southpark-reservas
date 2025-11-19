import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Reservas from "@/components/Reservas";
import Precios from "@/components/Precios";
import Galeria from "@/components/Galeria";
import Contacto from "@/components/Contacto";
import Nosotros from "@/components/Nosotros";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Reservas />
      <Precios />
      <Galeria />
      <Nosotros />
      <Contacto />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
