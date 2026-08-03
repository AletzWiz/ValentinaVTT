import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location]);

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/ruleta', label: '🎡 Ruleta' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(255,133,161,0.2)] border-b border-pink-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl group-hover:animate-wiggle inline-block transition-transform">🌸</span>
          <span
            className="font-black text-xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #FF85A1, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ValentinaVTT
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                location.pathname === to
                  ? 'bg-pink-100 text-pink-600 shadow-inner'
                  : 'text-pink-400 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Salón de la Fama */}
          <Link
            to="/salon-de-la-fama"
            className={`relative inline-flex items-center justify-center px-5 py-2 text-sm font-extrabold text-yellow-800 transition-all duration-300 rounded-full ${
              location.pathname === '/salon-de-la-fama'
                ? 'shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.6)]'
            }`}
            style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A, #F59E0B)',
            }}
          >
            ✨ Salón de la Fama
          </Link>

          {/* Discord */}
          <a
            href="https://discord.gg/TvbUCvdsaN"
            target="_blank"
            rel="noreferrer"
            className="btn-kawaii bg-[#5865F2] text-white text-sm font-bold px-5 py-2 flex items-center gap-2 hover:bg-[#4752C4]"
          >
            <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.36,46,96.25,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Discord
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl border-b border-pink-100 shadow-xl px-4 py-4 flex flex-col gap-3">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="py-2 px-4 rounded-2xl font-bold text-pink-500 hover:bg-pink-50 hover:text-pink-700 transition text-center"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/salon-de-la-fama"
            className="py-2 px-4 rounded-2xl font-extrabold text-yellow-800 text-center"
            style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A, #F59E0B)' }}
          >
            ✨ Salón de la Fama
          </Link>
          <a
            href="https://discord.gg/TvbUCvdsaN"
            target="_blank"
            rel="noreferrer"
            className="py-2 px-4 rounded-2xl bg-[#5865F2] text-white font-bold text-center flex justify-center items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.36,46,96.25,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Discord
          </a>
        </div>
      </div>
    </nav>
  );
};
