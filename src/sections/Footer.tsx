import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-100/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-pink-400 mx-auto mb-8 rounded-full" />

        {/* Copyright */}
        <p className="text-gray-600 mb-2">
          © {currentYear} ValentinaVTT. Todos los derechos reservados.
        </p>

        {/* Credits */}
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1 flex-wrap">
          Hecho con
          <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
          para la comunidad | Creado por
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-600 font-semibold transition-colors"
          >
            Aletzwiz
          </a>
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-4 mt-6 text-2xl">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🌸</span>
          <span className="animate-float" style={{ animationDelay: '0.3s' }}>💕</span>
          <span className="animate-float" style={{ animationDelay: '0.6s' }}>✨</span>
          <span className="animate-float" style={{ animationDelay: '0.9s' }}>💖</span>
          <span className="animate-float" style={{ animationDelay: '1.2s' }}>🌸</span>
        </div>
      </div>
    </footer>
  );
}
