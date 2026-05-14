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

const ParticulasDoradas = () => {
  return (
    <>
      <style>{`
        @keyframes floatMagic {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(15px) translateX(-20px); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(35)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          return (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full opacity-60"
              style={{
                width: `${size}px`, height: `${size}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animationName: 'floatMagic',
                animationDuration: `${Math.random() * 6 + 4}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${Math.random() * -5}s`,
                boxShadow: '0 0 12px rgba(250, 204, 21, 0.9)'
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clips');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setClips(data);
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

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#050002] min-h-screen flex items-center justify-center">Preparando la alfombra dorada...</div>;

  return (
    // Fondo base rosado/rojizo oscuro
    <section className="min-h-screen bg-[#3b1124] pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* Sombra difuminada por los lados (negro) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050002] via-transparent to-[#050002] pointer-events-none z-0"></div>
      
      {/* Sombra difuminada por abajo (negro) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050002]/40 to-[#050002] pointer-events-none z-0"></div>

      <ParticulasDoradas />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)] mb-4 tracking-wider">
          SALÓN DE LA FAMA
        </h1>
        <p className="text-pink-200 font-medium italic tracking-wide text-lg">"Temporada Piloto: Las leyendas doradas de VTT"</p>
        <p className="text-pink-400/70 text-sm mt-2 font-bold">13 Mayo 2026 - 13 Julio 2026</p>
      </div>

      {clips.length === 0 ? (
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="border-4 border-dashed border-pink-700/50 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-[#240a16]/70 backdrop-blur-md transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <Clapperboard size={80} strokeWidth={1.5} className="text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)] animate-pulse" />
            <h3 className="text-3xl font-black text-pink-100 mb-2 tracking-tight">Esperando clip</h3>
            <p className="text-pink-300 font-medium text-center">Aún no hay obras maestras en la Temporada Piloto.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-x-auto pb-12 flex gap-6 snap-x no-scrollbar relative z-10 px-4">
          {clips.map((clip, index) => {
            const isGold = index === 0;
            const isSilver = index === 1;
            const isBronze = index === 2;

            // Arreglo maestro para la imagen de Twitch: Reemplaza las variables para pedirla en buena resolución
            const hdThumbnail = clip.thumbnail_url
              .replace('%{width}', '640')
              .replace('%{height}', '360')
              .replace('-preview-480x272', '-preview-640x360'); 

            return (
              <div 
                key={clip.id}
                className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2
                  ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5)] scale-105 bg-[#1f0712]' : 
                    isSilver ? 'ring-2 ring-slate-300 shadow-[0_0_25px_rgba(148,163,184,0.4)] bg-[#1f0712]' :
                    isBronze ? 'ring-2 ring-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.4)] bg-[#1f0712]' : 
                    'bg-[#1a050f] shadow-2xl border border-pink-800/40'}
                `}
              >
                <div className="relative w-full aspect-video bg-[#0a0205]">
                  <img src={hdThumbnail} alt={clip.title} className="w-full h-full object-cover opacity-95" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'; }} />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-pink-200 text-[10px] px-2 py-1 rounded-full border border-pink-500/30">
                    {clip.view_count.toLocaleString()} vistas
                  </div>
                  {index < 3 && (
                    <div className={`absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl shadow-[0_0_15px_rgba(0,0,0,0.8)]
                      ${isGold ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 text-black border-2 border-yellow-100' : 
                        isSilver ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black border-2 border-slate-100' : 
                        'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-2 border-amber-300'}
                    `}>
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mb-1">Creador VIP</p>
                  <h3 className={`text-xl font-black truncate drop-shadow-md
                    ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 
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
                    className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-pink-900/40 text-pink-200 border border-pink-700/50 hover:bg-pink-600 hover:text-white hover:border-pink-400 hover:shadow-[0_0_20px_rgba(219,39,119,0.6)]"
                  >
                    Ver Joya en Twitch
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto mt-12 border-t border-dashed border-pink-800/50 pt-8 text-center relative z-10">
        <p className="text-pink-300/60 text-sm font-medium">Fin de temporada y premiación en: <span className="font-bold text-yellow-500">61 días</span></p>
      </div>
    </section>
  );
};
