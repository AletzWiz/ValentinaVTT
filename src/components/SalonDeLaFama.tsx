import { useEffect, useState } from 'react';
import { Clapperboard } from 'lucide-react';

interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
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
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-40px) translateX(20px); }
          66% { transform: translateY(20px) translateX(-25px); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          return (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full opacity-70"
              style={{
                width: `${size}px`, height: `${size}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animationName: 'floatMagic',
                animationDuration: `${Math.random() * 7 + 5}s`,
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

// SVG de la cuerda VIP para no cargar imágenes
const CuerdaVIP = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className={className}>
    <pattern id="pattern-rope" x="0" y="0" width="1" height="0.01" patternUnits="objectBoundingBox">
      <circle cx="50" cy="50" r="15" fill="#facc15" />
      <circle cx="50" cy="50" r="10" fill="#a16207" />
    </pattern>
    <rect x="40" y="0" width="20" height="1000" fill="url(#pattern-rope)" />
    <rect x="40" y="0" width="20" height="1000" fill="#facc15" opacity="0.3" filter="blur(10px)" />
  </svg>
);

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [meta, setMeta] = useState<SeasonMeta | null>(null);
  const [loading, setLoading] = useState(true);

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

  const formatearFecha = (isoString: string) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(isoString);
    return `${date.getUTCDate()} ${meses[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#140409] min-h-screen flex items-center justify-center">Preparando la alfombra dorada...</div>;

  return (
    // Fondo base aclarado (Chocolate/Mora)
    <section className="min-h-screen bg-[#4a162d] pt-28 pb-12 px-4 relative overflow-hidden">
      
      {/* 🔴 ALFOMBRA ROJA (Central) 🔴 */}
      <div className="absolute inset-0 flex justify-center z-0 pointer-events-none">
        <div className="w-[100%] max-w-7xl h-full bg-gradient-to-b from-[#a31d4e] via-[#6e0c32] to-[#a31d4e] opacity-80 shadow-[0_0_100px_rgba(110,12,50,1)]">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPjxnIGZpbGwtb3BhY2l0eT0iMC4wNSIgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTAgMGg0djRIMGV6TTEgMWgydjJMMXpNMCAwaDJ2Mkgwek0yIDJoMnYySDJ6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>
      </div>
      
      {/* Viñeta sutil en los bordes para dar profundidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0205]/60 via-transparent to-[#0a0205]/60 pointer-events-none z-0"></div>

      <ParticulasDoradas />
      
      {/* 🚪 ARCO VIP / PUERTA DE GALA (Detrás del Título) 🚪 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[350px] border-[16px] border-yellow-500/20 rounded-t-[150px] z-0 pointer-events-none shadow-[0_0_80px_rgba(250,204,21,0.2)]">
        <div className="absolute inset-[-8px] border-8 border-yellow-300/10 rounded-t-[142px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/10 blur-[110px] rounded-full pointer-events-none z-0"></div>
      </div>

      {/* 🎗️ CUERDAS VIP FLOTANTES (Laterales) 🎗️ */}
      <CuerdaVIP className="absolute top-40 left-[calc(50%-650px)] w-4 h-[70vh] opacity-80 z-0 hidden xl:block drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
      <CuerdaVIP className="absolute top-40 right-[calc(50%-650px)] w-4 h-[70vh] opacity-80 z-0 hidden xl:block drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />

      <div className="max-w-6xl mx-auto text-center mb-6 relative z-10 mt-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] mb-4 tracking-wider">
          SALÓN DE LA FAMA
        </h1>
        
        <p className="text-pink-100 font-medium italic tracking-wide text-lg bg-[#240a16]/60 backdrop-blur-sm inline-block px-4 py-1 rounded-full border border-pink-700/30 shadow-lg">
          "Temporada {meta?.temporada || 1}: Píloto"
        </p>
        <p className="text-pink-300/80 text-sm mt-3 font-bold">
          {meta ? `${formatearFecha(meta.fechaInicio)} - ${formatearFecha(meta.fechaFin)}` : 'Calculando temporada...'}
        </p>
      </div>

      {clips.length === 0 ? (
        <div className="max-w-2xl mx-auto relative z-10 mt-16">
          <div className="border-4 border-dashed border-pink-700/60 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-[#240a16]/80 backdrop-blur-md transition-all shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <Clapperboard size={80} strokeWidth={1.5} className="text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)] animate-pulse" />
            <h3 className="text-3xl font-black text-pink-50 mb-2 tracking-tight">Esperando clip</h3>
            <p className="text-pink-200 font-medium text-center">Aún no hay obras maestras en la Temporada {meta?.temporada || 1}.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-x-auto overflow-y-visible pt-10 pb-20 flex gap-6 snap-x no-scrollbar relative z-10 px-8 mt-12 bg-black/10 rounded-full shadow-inner border border-white/5">
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
                className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)]
                  ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)] bg-[#2b0c1b]' : 
                    isSilver ? 'ring-2 ring-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.5)] bg-[#2b0c1b]' :
                    isBronze ? 'ring-2 ring-amber-600 shadow-[0_0_25px_rgba(180,83,9,0.5)] bg-[#2b0c1b]' : 
                    'bg-[#240a16] shadow-2xl border border-pink-800/50'}
                `}
              >
                <div className="relative w-full aspect-video bg-[#0a0205]">
                  <img src={hdThumbnail} alt={clip.title} className="w-full h-full object-cover opacity-95" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'; }} />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-pink-100 text-[10px] px-2 py-1 rounded-full border border-pink-500/30">
                    {clip.view_count.toLocaleString()} vistas
                  </div>
                  
                  <div className={`absolute -top-3 -right-2 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl shadow-[0_0_20px_rgba(0,0,0,0.9)]
                    ${isGold ? 'bg-gradient-to-br from-yellow-100 to-yellow-600 text-black border-2 border-yellow-100' : 
                      isSilver ? 'bg-gradient-to-br from-slate-100 to-slate-400 text-black border-2 border-slate-100' : 
                      isBronze ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-2 border-amber-300' : 
                      'bg-[#0a0205] text-pink-200 border-2 border-pink-900'}
                  `}>
                    {index + 1}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mb-1">Creador VIP</p>
                  <h3 className={`text-xl font-black truncate drop-shadow-md
                    ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-500' : 
                      isSilver ? 'text-slate-100' : 
                      isBronze ? 'text-amber-500' : 'text-pink-50'}
                  `}>
                    {clip.creator_name}
                  </h3>
                  <p className="text-xs text-pink-200/70 truncate mt-2 font-medium">{clip.title}</p>
                  
                  <a 
                    href={clip.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-pink-800/40 text-pink-100 border border-pink-700/50 hover:bg-pink-600 hover:text-white hover:border-pink-400 hover:shadow-[0_0_25px_rgba(219,39,119,0.7)]"
                  >
                    Ver Joya en Twitch
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto mt-8 border-t border-dashed border-pink-800/50 pt-8 text-center relative z-10">
        <p className="text-pink-200/60 text-sm font-medium">Próxima Gala de Premiación en: <span className="font-bold text-yellow-400">{meta ? `${meta.diasRestantes} días` : '...'}</span></p>
      </div>
    </section>
  );
};
