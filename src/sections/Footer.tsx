import { Heart } from 'lucide-react';

const FOOTER_EMOJIS = ['🌸', '💕', '✨', '💖', '🎀', '🌷', '⭐'];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-14 px-4 overflow-hidden">
      {/* Gradient top fade */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,133,161,0.4), rgba(192,132,252,0.4), transparent)' }}
      />

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(ellipse, #FFB3C6 0%, #C9B1FF 50%, transparent 80%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Floating emoji row */}
        <div className="flex justify-center gap-5 mb-8 text-2xl">
          {FOOTER_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="inline-block select-none"
              style={{
                animation: `float 3.5s ease-in-out ${i * 0.25}s infinite`,
                filter: 'drop-shadow(0 2px 4px rgba(255,133,161,0.35))',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Logo text */}
        <div className="font-black text-2xl mb-3" style={{
          background: 'linear-gradient(135deg, #FF85A1, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ValentinaVTT
        </div>

        {/* Divider */}
        <div className="w-20 h-1 rounded-full mx-auto mb-4" style={{
          background: 'linear-gradient(90deg, #FF85A1, #A78BFA)',
        }} />

        {/* Copyright */}
        <p className="font-semibold text-sm mb-2" style={{ color: '#7B5064' }}>
          © {currentYear} ValentinaVTT — Todos los derechos reservados.
        </p>

        {/* Credits */}
        <p className="text-sm flex items-center justify-center gap-1.5 flex-wrap" style={{ color: '#A78BFA' }}>
          Hecho con
          <Heart className="w-4 h-4 fill-current animate-heart-beat inline" style={{ color: '#FF85A1' }} />
          para la comunidad · Creado por{' '}
          <a
            href="https://github.com/AletzWiz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-extrabold underline decoration-dotted hover:no-underline transition-all"
            style={{ color: '#FF85A1' }}
          >
            Aletzwiz
          </a>
        </p>
      </div>
    </footer>
  );
}
