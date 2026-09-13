import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [['Inicio','#inicio'],['Contenido','#contenido'],['Colaboraciones','#colaboraciones'],['Redes','#redes'],['Comunidad','#comunidad']];

export function Navbar() {
  const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const location=useLocation();
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>20); update(); window.addEventListener('scroll',update,{passive:true}); return()=>window.removeEventListener('scroll',update)},[]);
  return <header className={`fixed inset-x-0 top-0 z-50 border-b transition ${scrolled||open?'border-white/10 bg-[#08070c]/90 backdrop-blur-xl':'border-transparent bg-transparent'}`}>
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Navegación principal">
      <Link to="/" onClick={()=>setOpen(false)} className="font-display text-lg font-black tracking-[.08em] text-white">VALENTINA<span className="text-violet-400">VTT</span></Link>
      <div className="hidden items-center gap-7 md:flex">{location.pathname==='/'?links.map(([label,href])=><a key={href} href={href} className="text-sm font-semibold text-white/65 transition hover:text-white">{label}</a>):<Link to="/" className="text-sm font-semibold text-white/70">Volver al inicio</Link>}<Link to="/ruleta" className="text-sm font-semibold text-white/55 hover:text-white">Ruleta</Link><a href="/#contacto" className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(139,92,246,.25)] hover:bg-violet-400">Trabaja conmigo</a></div>
      <button type="button" onClick={()=>setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white md:hidden" aria-expanded={open} aria-label={open?'Cerrar menú':'Abrir menú'}>{open?<X size={20}/>:<Menu size={20}/>}</button>
    </nav>{open&&<div className="border-t border-white/10 bg-[#08070c] px-5 py-5 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">{links.map(([label,href])=><a key={href} href={`/${href}`} onClick={()=>setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-white/75 hover:bg-white/5">{label}</a>)}<Link to="/ruleta" onClick={()=>setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-white/60">Ruleta</Link><a href="/#contacto" onClick={()=>setOpen(false)} className="mt-2 rounded-xl bg-violet-500 px-4 py-3 text-center font-extrabold">Trabaja conmigo</a></div></div>}
  </header>;
}
