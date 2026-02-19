import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#ffe6ef]/80 backdrop-blur-md border-b border-pink-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Text - Ahora todo del mismo color rosa */}
        <div className="text-pink-500 font-extrabold text-xl tracking-tight">
          ValentinaVTT
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-bold text-pink-400">
          <Link to="/" className="hover:text-pink-600 transition">Inicio</Link>
          <Link to="/ruleta" className="hover:text-pink-600 transition">RuletaVTT</Link>
          <a href="https://discord.gg/TU_LINK_AQUI" target="_blank" rel="noreferrer" className="bg-[#5865F2] text-white px-5 py-2 rounded-full hover:bg-[#4752C4] transition shadow-lg shadow-indigo-200 flex items-center gap-2">
            {/* Logotipo de Discord en código (SVG) */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.36,46,96.25,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Discord
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-pink-500">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-b border-pink-100 shadow-xl absolute w-full left-0">
          <div className="flex flex-col p-4 gap-4 text-center font-bold text-pink-400">
            <Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link to="/ruleta" onClick={() => setIsOpen(false)}>RuletaVTT</Link>
            <a href="https://discord.gg/TU_LINK_AQUI" target="_blank" rel="noreferrer" className="bg-[#5865F2] text-white py-2 rounded-xl shadow-md flex justify-center items-center gap-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.36,46,96.25,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Unirme al Discord
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
