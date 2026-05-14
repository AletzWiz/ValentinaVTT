import { useEffect, useState } from 'react';
import { Clapperboard, ChevronRight, ChevronLeft, Flame, Smartphone, Play } from 'lucide-react';

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

interface RachaData {
  nombre: string;
  dias: number;
  fecha?: string;
}

interface TiktokData {
  creador: string;
  vistas: number;
  url: string;
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
        @keyframes floatTitle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes floatPodium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        /* ANIMACIONES DE FUEGO PARA LAS RACHAS */
        @keyframes flameIntense {
          0%, 100% { transform: scale(1) rotate(-5deg); opacity: 1; filter: drop-shadow(0 0 8px rgba(250,204,21,0.8)); }
          50% { transform: scale(1.25) rotate(5deg); opacity: 0.9; filter: drop-shadow(0 0 15px rgba(250,204,21,1)); }
        }
        @keyframes flameMedium {
          0%, 100% { transform: scale(1); opacity: 0.9; filter: drop-shadow(0 0 5px rgba(251,146,60,0.5)); }
          50% { transform: scale(1.15); opacity: 0.7; filter: drop-shadow(0 0 10px rgba(251,146,60,0.8)); }
        }
        @keyframes flameSubtle {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.6; filter: drop-shadow(0 0 5px rgba(248,113,113,0.5)); }
        }

        .animate-fade-in { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float-title { animation: floatTitle 5s ease-in-out infinite; }
        .animate-float-podium { animation: floatPodium 5s ease-in-out infinite; }
        
        .animate-flame-1 { animation: flameIntense 0.6s ease-in-out infinite; }
        .animate-flame-2 { animation: flameMedium 1.2s ease-in-out infinite; }
        .animate-flame-3 { animation: flameSubtle 1.8s ease-in-out infinite; }
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
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.12] text-5xl select-none filter blur-[1px]">
    <span className="absolute top-[15%] left-[10%] -rotate-12">🎬</span>
    <span className="absolute top-[60%] left-[8%] rotate-12">🔥</span>
    <span className="absolute top-[25%] right-[12%] rotate-45">💖</span>
    <span className="absolute bottom-[20%] right-[10%] -rotate-12">🎬</span>
    <span className="absolute top-[10%] right-[25%] rotate-12">🎀</span>
    <span className="absolute bottom-[30%] left-[20%] -rotate-45">🍿</span>
  </div>
);

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [rachas, setRachas] = useState<RachaData[]>([]);
  const [tiktoks, setTiktoks] = useState<TiktokData[]>([]);
  const [meta, setMeta] = useState<SeasonMeta | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 0 = Clips Populares, 1 = Mejores Rachas, 2 = TikToks, 3 = Próximamente
  const [currentSection, setCurrentSection] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Buscamos los clips
        const clipsResponse = await fetch('/api/clips');
        const clipsData = await clipsResponse.json();
        
        if (clipsData.clips && Array.isArray(clipsData.clips)) {
          setClips(clipsData.clips);
          setMeta(clipsData.meta);
        }

        // 2. Buscamos archivo manual de rachas con CÁLCULO AUTOMÁTICO
        const rachasResponse = await fetch('/rachas.json');
        if (rachasResponse.ok) {
          const rachasData: RachaData[] = await rachasResponse.json();
          
          // Magia del tiempo: Calculamos los días en piloto automático
          const rachasCalculadas = rachasData.map((r) => {
            let diasCalculados = r.dias;
            
            // Solo sumamos si los días base no son 0 y existe una fecha
            if (r.dias > 0 && r.fecha) {
              const hoy = new Date().getTime();
              const base = new Date(`${r.fecha}T00:00:00`).getTime();
              
              // Cuántos días exactos han pasado
              const diffDias = Math.floor((hoy - base) / (1000 * 60 * 60 * 24));
              
              if (diffDias > 0) {
                diasCalculados += diffDias;
              }
            }
            return { ...r, dias: diasCalculados };
          });

          // Ordenamos para que el que tenga más días siempre quede arriba
          rachasCalculadas.sort((a, b) => b.dias - a.dias);

          setRachas(rachasCalculadas.slice(0, 10));
        }

        // 3. Buscamos archivo manual de TikToks
        const tiktokResponse = await fetch('/tiktok.json');
        if (tiktokResponse.ok) {
          const tiktokData = await tiktokResponse.json();
          setTiktoks(tiktokData.slice(0, 10));
        }

      } catch (error) {
        console.error("Error cargando los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const changeSection = (direction: 'right' | 'left') => {
    if (direction === 'right') setCurrentSection(prev => (prev < 3 ? prev + 1 : prev));
    if (direction === 'left') setCurrentSection(prev => (prev > 0 ? prev - 1 : prev));
  };

  const formatearFecha = (isoString: string) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(isoString);
    return `${date.getUTCDate()} ${meses[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#1a0f14] min-h-screen flex items-center justify-center">Preparando la alfombra dorada...</div>;

  return (
    <section className="min-h-screen bg-[#ffccd5] pt-28 pb-12 px-4 relative overflow-hidden flex flex-col justify-center">
      
      {/* Sombra negra en los bordes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none z-0"></div>

      <ParticulasDoradas />
      <EmojisFondo />

      <div className="relative z-10 animate-fade-in w-full flex flex-col items-center">
        
        <div className="max-w-6xl mx-auto text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)] mb-4 tracking-[0.15em] uppercase animate-float-title text-center">
            SALON DE LA FAMA
          </h1>
          
          <p className="text-pink-100 font-medium italic tracking-wide text-sm md:text-base bg-black/40 backdrop-blur-sm inline-block px-5 py-1.5 rounded-full border border-pink-500/30 shadow-lg mt-2">
            "Temporada {meta?.temporada || 1}: Piloto"
          </p>
          <p className="text-pink-200 text-xs mt-3 font-bold opacity-90 tracking-widest">
            {meta ? `${formatearFecha(meta.fechaInicio)} - ${formatearFecha(meta.fechaFin)}` : 'Calculando temporada...'}
          </p>
        </div>

        {/* ⬅️ Flecha Izquierda */}
        {currentSection > 0 && (
          <button 
            onClick={() => changeSection('left')}
            className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/60 rounded-full text-yellow-400 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all hover:bg-yellow-500 hover:text-black hover:scale-110 hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] backdrop-blur-md"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
        )}

        {/* ➡️ Flecha Derecha */}
        {currentSection < 3 && (
          <button 
            onClick={() => changeSection('right')}
            className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/60 rounded-full text-yellow-400 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all hover:bg-yellow-500 hover:text-black hover:scale-110 hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] backdrop-blur-md"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>
        )}

        {/* ======================================= */}
        {/* === SECCIÓN 0: CLIPS MAS POPULARES ==== */}
        {/* ======================================= */}
        {currentSection === 0 && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wide mb-2 mt-6 font-sans">
              Clips más populares
            </h2>

            {clips.length === 0 ? (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="border-2 border-dashed border-yellow-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Clapperboard size={80} strokeWidth={1.5} className="text-yellow-400/80 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-sans font-bold text-white mb-2 tracking-tight">Esperando clip</h3>
                  <p className="text-pink-200 font-medium text-center">Aún no hay obras maestras en la Temporada {meta?.temporada || 1}.</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto overflow-x-auto pt-20 pb-24 flex gap-8 snap-x no-scrollbar px-6 w-full justify-start xl:justify-center">
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
                      style={{ animationDelay: `${index * 0.3}s` }} 
                      className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden bg-[#11050a] animate-float-podium border border-pink-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]
                        ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 
                          isSilver ? 'ring-2 ring-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.3)]' :
                          isBronze ? 'ring-2 ring-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.3)]' : 
                          'shadow-2xl'}
                      `}
                    >
                      <div className="relative w-full aspect-video bg-black">
                        <img src={hdThumbnail} alt={clip.title} className="w-full h-full object-cover opacity-90" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'; }} />
                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-pink-200 text-[10px] px-2 py-1 rounded-full border border-pink-500/30 tracking-wider">
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
                        <p className="text-xs text-pink-200/60 truncate mt-2 font-medium">{clip.title}</p>
                        
                        <a 
                          href={clip.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-black/40 text-yellow-400 border border-yellow-600/50 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] tracking-widest"
                        >
                          VER JOYA EN TWITCH
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* ===== SECCIÓN 1: MEJORES RACHAS ======= */}
        {/* ======================================= */}
        {currentSection === 1 && (
          <div className="w-full flex flex-col items-center animate-fade-in px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wide mb-2 mt-6 font-sans">
              Mejores rachas
            </h2>

            {rachas.length === 0 ? (
              <div className="max-w-2xl mx-auto mt-8">
                <div className="border-2 border-dashed border-pink-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Flame size={80} strokeWidth={1.5} className="text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)] animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-sans font-bold text-white text-center tracking-wide">Buscando las leyendas...</h3>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full mt-8 bg-[#11050a]/80 backdrop-blur-xl border border-yellow-600/30 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.6)] p-4 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-600/10 blur-[50px] pointer-events-none"></div>

                <div className="flex flex-col gap-3 md:gap-4 relative z-10">
                  {rachas.map((racha, index) => {
                    const isGold = index === 0;
                    const isSilver = index === 1;
                    const isBronze = index === 2;
                    const avatarUrl = racha.dias > 0 
                      ? `https://ui-avatars.com/api/?name=${racha.nombre}&background=db2777&color=fff&size=128&bold=true`
                      : `https://ui-avatars.com/api/?name=Usuario&background=1f2937&color=fff&size=128`;

                    let flameClass = "text-gray-500 opacity-50"; 
                    if (racha.dias > 0) {
                      if (isGold) flameClass = "text-yellow-400 animate-flame-1";
                      else if (isSilver) flameClass = "text-orange-400 animate-flame-2";
                      else if (isBronze) flameClass = "text-red-400 animate-flame-3";
                    }

                    return (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 hover:bg-white/10 border hover:scale-[1.02]
                          ${isGold && racha.dias > 0 ? 'border-yellow-500/60 bg-yellow-900/20 shadow-[0_0_15px_rgba(250,204,21,0.15)]' : 
                            isSilver && racha.dias > 0 ? 'border-slate-400/50 bg-slate-900/30' : 
                            isBronze && racha.dias > 0 ? 'border-amber-700/50 bg-amber-900/20' : 
                            'border-pink-900/30 bg-black/40'}
                        `}
                      >
                        <div className="flex items-center gap-3 md:gap-5">
                          <div className={`w-8 h-8 md:w-10 md:h-10 flex shrink-0 items-center justify-center rounded-full font-black text-sm md:text-lg shadow-md
                            ${isGold && racha.dias > 0 ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 text-black' : 
                              isSilver && racha.dias > 0 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black' : 
                              isBronze && racha.dias > 0 ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white' : 
                              'bg-[#1a0812] text-pink-400 border border-pink-900'}
                          `}>
                            {index + 1}
                          </div>
                          
                          <img src={avatarUrl} alt={racha.nombre} className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 hidden sm:block
                            ${isGold && racha.dias > 0 ? 'border-yellow-400' : isSilver && racha.dias > 0 ? 'border-slate-300' : isBronze && racha.dias > 0 ? 'border-amber-600' : 'border-gray-800'}`} 
                          />
                          
                          <span className={`font-black text-base md:text-xl truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs
                            ${racha.dias === 0 ? 'text-gray-500' :
                              isGold ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 
                              isSilver ? 'text-slate-200' : 
                              isBronze ? 'text-amber-500' : 'text-pink-100'}
                          `}>
                            {racha.nombre}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2 bg-black/60 px-3 md:px-5 py-2 rounded-xl border border-pink-900/50 shrink-0">
                          <Flame className={flameClass} size={20} />
                          <span className={`font-bold text-sm md:text-lg tracking-wider ${racha.dias > 0 ? 'text-white' : 'text-gray-500'}`}>
                            {racha.dias} <span className="text-xs md:text-sm text-gray-500">DÍAS</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* ===== SECCIÓN 2: MEJORES TIKTOKS ====== */}
        {/* ======================================= */}
        {currentSection === 2 && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wide mb-2 mt-6 font-sans">
              Mejores TikToks
            </h2>

            {tiktoks.length === 0 ? (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="border-2 border-dashed border-cyan-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Smartphone size={80} strokeWidth={1.5} className="text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(37,244,238,0.6)] animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-sans font-bold text-white text-center tracking-wide">Esperando TikToks...</h3>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto overflow-x-auto pt-20 pb-24 flex gap-8 snap-x no-scrollbar px-6 w-full justify-start xl:justify-center">
                {tiktoks.map((tiktok, index) => {
                  const isGold = index === 0;
                  const isSilver = index === 1;
                  const isBronze = index === 2;
                  const avatarUrl = `https://ui-avatars.com/api/?name=${tiktok.creador}&background=25F4EE&color=fff&size=200&bold=true`;

                  return (
                    <div 
                      key={index}
                      style={{ animationDelay: `${index * 0.3}s` }} 
                      className={`snap-center shrink-0 w-60 aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black animate-float-podium border-2 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative
                        ${isGold ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5)]' : 
                          isSilver ? 'border-cyan-400 shadow-[0_0_30px_rgba(37,244,238,0.4)]' :
                          isBronze ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 
                          'border-gray-800 shadow-2xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>
                      
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-full font-black text-2xl shadow-[0_0_15px_rgba(0,0,0,0.8)] mt-2
                          ${isGold ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 text-black border-2 border-yellow-100' : 
                            isSilver ? 'bg-gradient-to-br from-cyan-200 to-cyan-500 text-black border-2 border-cyan-100' : 
                            isBronze ? 'bg-gradient-to-br from-rose-400 to-rose-700 text-white border-2 border-rose-300' : 
                            'bg-gray-800 text-gray-300 border-2 border-gray-600'}
                        `}>
                          #{index + 1}
                        </div>

                        <div className="flex flex-col items-center my-auto">
                          <div className={`relative p-1 rounded-full bg-gradient-to-tr ${isGold ? 'from-yellow-400 to-yellow-600' : 'from-cyan-400 to-rose-500'}`}>
                            <img src={avatarUrl} alt={tiktok.creador} className="w-24 h-24 rounded-full border-4 border-black" />
                          </div>
                          <h3 className="text-xl font-black text-white mt-4 drop-shadow-md tracking-wider">
                            @{tiktok.creador}
                          </h3>
                        </div>

                        <div className="w-full flex flex-col items-center gap-4">
                          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                            <Play size={16} fill="white" className="text-white" />
                            <span className="font-bold text-white">{tiktok.vistas.toLocaleString()}</span>
                          </div>
                          <a 
                            href={tiktok.url} target="_blank" rel="noreferrer"
                            className={`w-full text-center py-3 rounded-2xl text-sm font-black transition-all duration-300 text-white tracking-widest uppercase shadow-lg
                              ${isGold ? 'bg-yellow-600 hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 
                                'bg-gradient-to-r from-cyan-600 to-rose-600 hover:from-cyan-500 hover:to-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]'}
                            `}
                          >
                            Ver en TikTok
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* ===== SECCIÓN 3: PRÓXIMAMENTE ========= */}
        {/* ======================================= */}
        {currentSection === 3 && (
          <div className="w-full flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wide mb-8 mt-6 font-sans">
              Próximamente
            </h2>
            <div className="border-2 border-dashed border-pink-500/40 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span className="text-6xl mb-4 animate-bounce">🚧</span>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-white text-center tracking-wide">Nuevas categorías en construcción...</h3>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-2 border-t border-dashed border-pink-500/30 pt-6 text-center w-full px-4">
          <p className="text-pink-200/80 text-xs md:text-sm font-medium tracking-widest">
            Próxima Gala de Premiación en: <span className="font-bold text-yellow-400">{meta ? `${meta.diasRestantes} días` : '...'}</span>
          </p>
        </div>
        
      </div>
    </section>
  );
};
