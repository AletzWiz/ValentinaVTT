import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './sections/Hero';
import LiveStream from './sections/LiveStream';
import SocialGrid from './sections/SocialGrid';
import Discord from './sections/Discord';
import Wishlist from './sections/Wishlist';
import Sponsors from './sections/Sponsors';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import { RuletaVTT } from './components/RuletaVTT';

import './App.css';

// 1. Agrupamos todo tu contenido principal en un componente "Inicio"
const Inicio = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });
    ScrollTrigger.refresh();
    return () => { ScrollTrigger.getAll().forEach(trigger => trigger.kill()); };
  }, []);

  return (
    <>
      <Hero />
      <LiveStream />
      <SocialGrid />
      <Discord />
      <Wishlist />
      <Sponsors />
      <Contact />
      <Footer />
    </>
  );
};

// 2. Aquí creamos las rutas de tu página web
export default function App() {
  return (
    <Router>
      <main className="min-h-screen bg-[#FFF0F5]">
        <Navbar />
        
        <Routes>
          {/* Ruta principal: valentinavtt.com */}
          <Route path="/" element={<Inicio />} />
          
          {/* Ruta separada: valentinavtt.com/ruleta */}
          <Route path="/ruleta" element={<RuletaVTT />} />
        </Routes>
      </main>
    </Router>
  );
}

