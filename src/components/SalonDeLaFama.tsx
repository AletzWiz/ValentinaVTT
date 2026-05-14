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

// ✨ Partículas doradas sutiles ✨
const ParticulasDoradas = () => {
  return (
    <>
      <style>{`
        @keyframes floatMagic {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatPodium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float-podium { animation: floatPodium 4s ease-in-out infinite; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          return (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full"
              style={{
                width: `${size}px`, height: `${size}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animationName: 'floatMagic',
                animationDuration: `${Math.random() * 6 + 4}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${Math.random() * -3}s`,
                boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)'
              }}
            />
          );
        })}
      </div>
    </>
  );
};

// 🎬 Emojis Kawaii de fondo (Sutiles) 🎬
const EmojisFondo = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.15] text-5xl select-none filter blur-[1px]">
    <span className="absolute top-[15%] left-[10%] -rotate-12">🎬</span>
    <span className="absolute top-[60%] left-[8%] rotate-12">✨</span>
    <span className="absolute top-[25%] right-[12%] rotate-45">💖</span>
    <span className="absolute bottom-[20%] right-[10%] -rotate-12">🎬</span>
    <span className="absolute top-[10%] right-[25%] rotate-12">🎀</span>
    <span className="absolute bottom-[30%] left-[20%] -rotate-45">🍿</span>
  </div>
);

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [meta, setMeta] = useState<SeasonMeta | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 0 = Clips Populares, 1 = Futura Sección
  const [currentSection, setCurrentSection] = useState(0); 

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clips');
        const data = await response.json();
        
        if (data.clips && Array.isArray(data.clips)) {
          setClips(data.clips);
          setMeta(data.meta);
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

  const changeSection = (direction: 'right' | 'left') => {
    if (direction === 'right') setCurrentSection(prev => (prev === 0 ? 1 : 0));
    if (direction === 'left') setCurrentSection(prev => (prev === 1 ? 0 : 1));
  };

  const formatearFecha = (isoString: string) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(isoString);
    return `${date.getUTCDate()} ${meses[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#1a0f14] min-h-screen flex items-center justify-center">Preparando la alfombra dorada...</div>;

  return (
    // 🎨 FONDO ROSA KAWAII CON VIÑETA NEGRA 🎨
    <section className="min-h-screen bg-[#ffccd5] pt-28 pb-12 px-4 relative overflow-hidden flex flex-col justify-center">
      
      {/* Sombra negra en los bordes (Viñeta profunda) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_rgba(0,0,0,0.85)_100%)] pointer-events-none z-0"></div>
      
      {/* Sombra extra arriba y abajo para darle más elegancia */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-0"></div>

      <ParticulasDoradas />
      <EmojisFondo />

      {/* Todo el contenido envuelto en la animación de entrada */}
      <div className="relative z-10 animate-fade-in w-full">
        
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] mb-4 tracking-widest">
            SALON DE LA FAMA
          </h1>
          
          <p className="text-pink-100 font-semibold italic tracking-wide text-lg bg-black/40 backdrop-blur-sm inline-block px-5 py-1.5 rounded-full border border-pink-500/30 shadow-lg">
            "Temporada {meta?.temporada || 1}: Piloto"
          </p>
          <p className="text-pink-300 text-xs mt-3 font-bold opacity-90">
            {meta ? `${formatearFecha(meta.fechaInicio)} - ${formatearFecha(meta.fechaFin)}` : 'Calculando temporada...'}
          </p>
        </div>

        {/* ⬅️ Flecha Izquierda (Elegante y Dorada) */}
        {currentSection > 0 && (
          <button 
            onClick={() => changeSection('left')}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/60 rounded-full text-yellow-400 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all hover:bg-yellow-500 hover:text-black hover:scale-110 hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] backdrop-blur-md"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
        )}

        {/* ➡️ Flecha Derecha (Elegante y Dorada) */}
        {currentSection < 1 && (
          <button 
            onClick={() => changeSection('right')}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/60 rounded-full text-yellow-400 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all hover:bg-yellow-500 hover:text-black hover:scale-110 hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] backdrop-blur-md"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>
        )}

        {/* --- SECCIÓN 0: CLIPS MAS POPULARES --- */}
        {currentSection === 0 && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            <h2 className="text-3xl font-black text-yellow-400 tracking-widest mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
              CLIPS MAS POPULARES
            </h2>

            {clips.length === 0 ? (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="border-2 border-dashed border-yellow-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Clapperboard size={80} strokeWidth={1.5} className="text-yellow-400/80 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse" />
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Esperando clip</h3>
                  <p className="text-pink-200 font-medium text-center">Aún no hay obras maestras en la Temporada {meta?.temporada || 1}.</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto overflow-x-auto pb-10 flex gap-6 snap-x no-scrollbar px-6 w-full justify-start md:justify-center">
                {clips.map((clip, index) => {
                  const isGold = index === 0;
                  const isSilver = index === 1;
                  const isBronze = index === 2;

                  const hdThumbnail = clip.thumbnail_url
                    .replace('%{width}', '640')
                    .replace('%{height}', '360'); 

                  return (
                    <div 
                      key={clip.id}
                      style={{ animationDelay: `${index * 0.2}s` }} // Desfase para que no floten idénticos
                      className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden bg-[#11050a] animate-float-podium border border-pink-900/50 hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] transition-all
                        ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 
                          isSilver ? 'ring-2 ring-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.3)]' :
                          isBronze ? 'ring-2 ring-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.3)]' : 
                          'shadow-2xl'}
                      `}
                    >
                      <div className="relative w-full aspect-video bg-black">
                        <img src={hdThumbnail} alt={clip.title} className="w-full h-full object-cover opacity-90" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'; }} />
                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-pink-200 text-[10px] px-2 py-1 rounded-full border border-pink-500/30">
                          {clip.view_count.toLocaleString()} vistas
                        </div>
                        
                        <div className={`absolute -top-3 -right-2 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl shadow-[0_0_15px_rgba(0,0,0,0.8)]
                          ${isGold ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 text-black border-2 border-yellow-100' : 
                            isSilver ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black border-2 border-slate-100' : 
                            isBronze ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-2 border-amber-300' : 
                            'bg-[#1a0812] text-pink-300 border-2 border-pink-800'}
                        `}>
                          {index + 1}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mb-1">Creador VIP</p>
                        <h3 className={`text-xl font-black truncate drop-shadow-md
                          ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500' : 
                            isSilver ? 'text-slate-200' : 
                            isBronze ? 'text-amber-500' : 'text-pink-100'}
                        `}>
                          {clip.creator_name}
                        </h3>
                        <p className="text-xs text-pink-200/60 truncate mt-2">{clip.title}</p>
                        
                        <a 
                          href={clip.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-black/40 text-yellow-400 border border-yellow-600/50 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                        >
                          Ver Joya en Twitch
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SECCIÓN 1: FUTURA SECCIÓN --- */}
        {currentSection === 1 && (
          <div className="w-full flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
            <h2 className="text-3xl font-black text-yellow-400 tracking-widest mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
              PROXIMAMENTE
            </h2>
            <div className="border-2 border-dashed border-pink-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span className="text-6xl mb-4 animate-bounce">🚧</span>
              <h3 className="text-2xl font-bold text-white text-center">Nuevas categorías en construcción...</h3>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-6 border-t border-dashed border-pink-500/30 pt-6 text-center">
          <p className="text-pink-200/80 text-sm font-medium">Próxima Gala de Premiación en: <span className="font-bold text-yellow-400">{meta ? `${meta.diasRestantes} días` : '...'}</span></p>
        </div>
        
      </div>
    </section>
  );
};
