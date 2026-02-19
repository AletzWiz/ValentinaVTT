import { Navbar } from './components/Navbar';
import { RuletaVTT } from './components/RuletaVTT';
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

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF0F5]">
      <Navbar />
      {/* Hero Section */}
      <Hero />

      {/* Live Stream Section */}
      <LiveStream />
      {/* Ruleta Section */}
      <RuletaVTT />

      {/* Social Grid Section */}
      <SocialGrid />

      {/* Discord Section */}
      <Discord />

      {/* Wishlist Section */}
      <Wishlist />

      {/* Sponsors Section */}
      <Sponsors />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default App;
