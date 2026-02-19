import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#ffe6ef]/80 backdrop-blur-md border-b border-pink-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Text */}
        <div className="text-pink-500 font-extrabold text-xl tracking-tight">
          Valentina<span className="text-pink-300">VTT</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-bold text-pink-400">
          <Link to="#" className="hover:text-pink-600 transition">Inicio</a>
          <Link to="#ruleta" className="hover:text-pink-600 transition">RuletaVTT</a>
          <a href to="https://discord.gg/TU_LINK_AQUI" target="_blank" rel="noreferrer" className="bg-[#5865F2] text-white px-6 py-2 rounded-full hover:bg-[#4752C4] transition shadow-lg shadow-indigo-200">
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
            <Link to="#" onClick={() => setIsOpen(false)}>Inicio</a>
            <Link to="#ruleta" onClick={() => setIsOpen(false)}>RuletaVTT</a>
            <Link to="https://discord.gg/TU_LINK_AQUI" target="_blank" rel="noreferrer" className="bg-[#5865F2] text-white py-2 rounded-xl shadow-md">Unirme al Discord</a>
          </div>
        </div>
      )}
    </nav>
  );
};
