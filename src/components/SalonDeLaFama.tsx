import { useEffect, useState, useRef } from 'react';
import { Clapperboard, ChevronRight, ChevronLeft } from 'lucide-react';

interface TwitchClip {
  id: string;
  url: string;
  creator_name: string;
  thumbnail_url: string;
  view_count: number;
  title: string;
}

interface SeasonMeta {
  temporada: number;
  diasRestantes: number;
  fechaInicio: string;
  fechaFin: string;
}

const ParticulasDoradas = () => {
  return (
    <>
      <style>{`
        @keyframes floatMagic {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          33% { transform: translateY(-40px) translateX(20px); opacity: 0.4; }
          66% { transform: translateY(20px) translateX(-25px); opacity: 0.7; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          return (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full"
              style={{
                width: `${size}px`, height: `${size}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animationName: 'floatMagic',
                animationDuration: `${Math.random() * 8 + 6}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${Math.random() * -5}s`,
                boxShadow: '0 0 14px rgba(250, 204, 21, 1)'
              }}
            />
          );
        })}
      </div>
    </>
  );
};

// SVG de la Puerta Super Elegante para no cargar imágenes
const PuertaElegante = ({ currentSection }: { currentSection: number }) => (
  // El truco está en el scale. Aumenta con la sección.
  <div 
    className="absolute top-1/2 -translate-y-1/2 right-12 z-0 pointer-events-none transition-transform duration-1000 ease-in-out origin-center-right"
    style={{ transform: `scale(${1 + (currentSection * 0.15)}) translateY(-50%)` }}
  >
    <svg width="400" height="700" viewBox="0 0 400 700" fill="none">
      <defs>
        <filter id="glow_door" x="-20%" y="-10%" width="140%" height="120%">
          <feGaussianBlur stdDeviation="15" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="gold_grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fee692" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="360" height="660" rx="100" stroke="url(#gold_grad)" strokeWidth="15" fill="#50162e" opacity="0.9" filter="url(#glow_door)" />
      <rect x="50" y="50" width="300" height="600" rx="70" stroke="url(#gold_grad)" strokeWidth="6" opacity="0.4" />
      <circle cx="200" cy="350" r="100" stroke="url(#gold_grad)" strokeWidth="20" opacity="0.3" fill="#2d0a1b" />
      <path d="M150 350 H250" stroke="url(#gold_grad)" strokeWidth="12" />
    </svg>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[600px] bg-pink-500/10 blur-[100px] rounded-full"></div>
  </div>
);

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [meta, setMeta] = useState<SeasonMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0); // Sección actual (0 a N)
  const [clipsPorSeccion, setClipsPorSeccion] = useState<TwitchClip[][]>([]);
  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clips');
        const data = await response.json();
        
        if (data.clips && Array.isArray(data.clips)) {
          setClips(data.clips);
          setMeta(data.meta);
          
          // Agrupamos los clips en "Secciones de Gala" (ej. de 3 en 3)
          const totalClips = data.clips;
          const agrupados: TwitchClip[][] = [];
          for (let i = 0; i < totalClips.length; i += 3) {
            agrupados.push(totalClips.slice(i, i + 3));
          }
          setClipsPorSeccion(agrupados);
          
        } else {
          setClips([]);
        }
      } catch (error) {
        setClips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  useEffect(() => {
    // Al cambiar la sección, hacemos scroll al inicio de esa sección
    if (carruselRef.current) {
      const seccionAncho = carruselRef.current.offsetWidth;
      carruselRef.current.scrollTo({
        left: currentSection * seccionAncho,
        behavior: 'smooth'
      });
    }
  }, [currentSection]);

  const changeSection = (direction: 'right' | 'left') => {
    if (direction === 'right' && currentSection < clipsPorSeccion.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else if (direction === 'left' && currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const formatearFecha = (isoString: string) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(isoString);
    return `${date.getUTCDate()} ${meses[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#FFF5F8] min-h-screen flex items-center justify-center">Preparando la alfombra dorada...</div>;

  return (
    // 🎨 FONDO SÚPER LIMPIO Y CLARO (como la principal) 🎨
    <section className="min-h-screen bg-[#FFF5F8] pt-28 pb-12 px-4 relative overflow-hidden">
      
      <ParticulasDoradas />
      
      {/* 🔴 ALFOMBRA ROJA EN EL SUELO (Horizontal y PERSPECTIVA) 🔴 */}
      <div 
        className="absolute bottom-0 left-0 h-40 w-[200vw] z-0 pointer-events-none transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(${-currentSection * 10}vw)`, // Se mueve más lento que los clips para dar profundidad
          background: 'linear-gradient(to top, #991b1b, #b91c1c 20%, #991b1b 40%, transparent)'
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPjxnIGZpbGwtb3BhY2l0eT0iMC4wMyIgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTAgMGg0djRIMGV6TTEgMWgydjJMMXpNMCAwaDJ2Mkgwek0yIDJoMnYySDJ6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      </div>
      
      {/* 🚪 PUERTA SUPER ELEGANTE (Al fondo, Interactiva) 🚪 */}
      <PuertaElegante currentSection={currentSection} />

      <div className="max-w-6xl mx-auto text-center mb-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)] mb-4 tracking-wider">
          SALÓN DE LA FAMA
        </h1>
        
        <p className="text-pink-900/80 font-semibold italic tracking-wide text-lg bg-pink-100 backdrop-blur-sm inline-block px-5 py-1.5 rounded-full border border-pink-200 shadow-md">
          "Temporada {meta?.temporada || 1}: Píloto"
        </p>
        <p className="text-pink-500 text-xs mt-3 font-bold opacity-80">
          {meta ? `${formatearFecha(meta.fechaInicio)} - ${formatearFecha(meta.fechaFin)}` : 'Calculando temporada...'}
        </p>
      </div>

      {clips.length === 0 ? (
        <div className="max-w-2xl mx-auto relative z-10 mt-16">
          <div className="border-4 border-dashed border-pink-700/60 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-pink-100 backdrop-blur-md transition-all shadow-[0_0_30px_rgba(0,0,0,0.1)]">
            <Clapperboard size={80} strokeWidth={1.5} className="text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)] animate-pulse" />
            <h3 className="text-3xl font-black text-pink-950 mb-2 tracking-tight">Esperando clip</h3>
            <p className="text-pink-800 font-medium text-center">Aún no hay obras maestras en la Temporada {meta?.temporada || 1}.</p>
          </div>
        </div>
      ) : (
        <div className="relative max-w-7xl mx-auto mt-12 px-12 z-10">
          
          {/* ⬅️ Flecha Izquierda */}
          {currentSection > 0 && (
            <button 
              onClick={() => changeSection('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-pink-100 rounded-full text-pink-700 border border-pink-200 shadow-xl transition-all hover:bg-pink-600 hover:text-white hover:scale-110"
            >
              <ChevronLeft size={32} strokeWidth={2.5} />
            </button>
          )}

          {/* ➡️ Flecha Derecha */}
          {currentSection < clipsPorSeccion.length - 1 && (
            <button 
              onClick={() => changeSection('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-pink-100 rounded-full text-pink-700 border border-pink-200 shadow-xl transition-all hover:bg-pink-600 hover:text-white hover:scale-110"
            >
              <ChevronRight size={32} strokeWidth={2.5} />
            </button>
          )}

          {/* Contenedor del carrusel con scroll oculto */}
          <div 
            ref={carruselRef}
            className="w-full overflow-hidden flex gap-0 snap-x snap-mandatory relative z-10 no-scrollbar"
          >
            {clipsPorSeccion.map((seccion, sIndex) => (
              <div 
                key={sIndex}
                className="shrink-0 w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 pb-16 transition-opacity duration-1000 ease-in-out snap-center"
                style={{ opacity: sIndex === currentSection ? 1 : 0.2 }}
              >
                {seccion.map((clip, index) => {
                  const trueIndex = (sIndex * 3) + index; // Índice real del 1 al 10
                  const isGold = trueIndex === 0;
                  const isSilver = trueIndex === 1;
                  const isBronze = trueIndex === 2;

                  const hdThumbnail = clip.thumbnail_url
                    .replace('%{width}', '640')
                    .replace('%{height}', '360'); 

                  return (
                    <div 
                      key={clip.id}
                      className={`rounded-3xl overflow-hidden transition-all duration-500 bg-white border border-pink-100 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]
                        ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.2)]' : 
                          isSilver ? 'ring-2 ring-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.15)]' :
                          isBronze ? 'ring-2 ring-amber-600 shadow-[0_0_25px_rgba(180,83,9,0.15)]' : 
                          'shadow-xl'}
                      `}
                    >
                      <div className="relative w-full aspect-video bg-pink-50">
                        <img src={hdThumbnail} alt={clip.title} className="w-full h-full object-cover opacity-95" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'; }} />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-pink-100 text-[10px] px-2 py-1 rounded-full border border-pink-500/30">
                          {clip.view_count.toLocaleString()} vistas
                        </div>
                        
                        <div className={`absolute -top-3 -right-2 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl shadow-[0_0_15px_rgba(0,0,0,0.1)]
                          ${isGold ? 'bg-gradient-to-br from-yellow-100 to-yellow-600 text-black border-2 border-yellow-100' : 
                            isSilver ? 'bg-gradient-to-br from-slate-100 to-slate-400 text-black border-2 border-slate-100' : 
                            isBronze ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-2 border-amber-300' : 
                            'bg-pink-100 text-pink-950 border-2 border-pink-200'}
                        `}>
                          {trueIndex + 1}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-widest text-pink-600 font-bold mb-1">Creador VIP</p>
                        <h3 className={`text-xl font-black truncate drop-shadow-sm
                          ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            isSilver ? 'text-slate-700' : 
                            isBronze ? 'text-amber-800' : 'text-pink-950'}
                        `}>
                          {clip.creator_name}
                        </h3>
                        <p className="text-xs text-pink-900/60 truncate mt-2 font-medium">{clip.title}</p>
                        
                        <a 
                          href={clip.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-600 hover:text-white hover:border-pink-400 hover:shadow-[0_0_20px_rgba(219,39,119,0.2)]"
                        >
                          Ver Joya en Twitch
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto mt-12 border-t border-dashed border-pink-200 pt-8 text-center relative z-10">
        <p className="text-pink-900/60 text-sm font-medium bg-[#FFF5F8] inline-block px-4">Próxima Gala de Premiación en: <span className="font-bold text-pink-700">{meta ? `${meta.diasRestantes} días` : '...'}</span></p>
      </div>
    </section>
  );
};
