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

// ✨ COMPONENTE DE PARTÍCULAS DORADAS ✨
const ParticulasDoradas = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 4 + 2;
        return (
          <div
            key={i}
            className="absolute bg-yellow-300 rounded-full opacity-40 animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 10px rgba(250, 204, 21, 0.8)'
            }}
          />
        );
      })}
    </div>
  );
};

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔴 CAMBIA ESTO A "true" SI QUIERES VER LOS CUADROS DE PRUEBA
  const TEST_MODE = false;

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        
        if (TEST_MODE) {
          // Datos de prueba para ver el diseño arreglado
          const mockClips = Array.from({ length: 20 }, (_, i) => ({
            id: `clip-${i}`,
            url: "#",
            embed_url: "",
            creator_name: i === 0 ? "TopEditor1" : i === 1 ? "ClipMaster" : i === 2 ? "VTT_Fan" : `User_${i}`,
            thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400", // Imagen real de fallback
            view_count: 5000 - (i * 200),
            title: `Momento épico #${i + 1}`
          }));
          setClips(mockClips);
        } else {
          // Aquí conectaremos la API real. Por ahora, lo dejamos vacío para mostrar "Esperando clip"
          setClips([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, [TEST_MODE]);

  if (loading) return <div className="text-center py-20 text-yellow-500 font-bold bg-[#1a0f14] min-h-screen flex items-center justify-center">Preparando el escenario dorado...</div>;

  return (
    // Fondo más claro (Mora oscuro/Chocolate)
    <section className="min-h-screen bg-[#1a0f14] pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* Luces y Partículas */}
      <ParticulasDoradas />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)] mb-4">
          Salón de la Fama
        </h1>
        <p className="text-pink-300 font-medium italic tracking-wide">"Temporada 1: Las leyendas doradas de VTT"</p>
        <p className="text-gray-400 text-sm mt-2">13 Mayo 2026 - 13 Julio 2026</p>
      </div>

      {/* Condición: Si no hay clips, mostramos la claqueta. Si hay, mostramos el carrusel */}
      {clips.length === 0 ? (
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="border-4 border-dashed border-pink-900/50 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-[#24131d]/50 backdrop-blur-sm transition-all hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(219,39,119,0.1)]">
            <Clapperboard size={80} strokeWidth={1.5} className="text-pink-400/60 mb-6 drop-shadow-lg" />
            <h3 className="text-3xl font-black text-slate-200 mb-2 tracking-tight">Esperando clip</h3>
            <p className="text-pink-400/80 font-medium">Aún no hay obras maestras en esta temporada.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-x-auto pb-12 flex gap-6 snap-x no-scrollbar relative z-10 px-4">
          {clips.map((clip, index) => {
            const isGold = index === 0;
            const isSilver = index === 1;
            const isBronze = index === 2;

            return (
              <div 
                key={clip.id}
                className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2
                  ${isGold ? 'ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] scale-105 bg-[#24131d]' : 
                    isSilver ? 'ring-2 ring-slate-400 shadow-[0_0_25px_rgba(148,163,184,0.3)] bg-[#24131d]' :
                    isBronze ? 'ring-2 ring-amber-700 shadow-[0_0_20px_rgba(180,83,9,0.3)] bg-[#24131d]' : 
                    'bg-[#1e1018] shadow-lg border border-pink-900/30'}
                `}
              >
                {/* Contenedor de imagen arreglado con altura fija (h-40) */}
                <div className="relative w-full h-40 bg-black/50">
                  <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover opacity-90" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400'; }} />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-pink-200 text-[10px] px-2 py-1 rounded-full border border-pink-500/30">
                    {clip.view_count.toLocaleString()} vistas
                  </div>
                  {index < 3 && (
                    <div className={`absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl shadow-[0_0_15px_rgba(0,0,0,0.8)]
                      ${isGold ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 text-black border-2 border-yellow-100' : 
                        isSilver ? 'bg-gradient-to-br from-slate-200 to-slate-500 text-black border-2 border-slate-100' : 
                        'bg-gradient-to-br from-amber-500 to-amber-800 text-white border-2 border-amber-300'}
                    `}>
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mb-1">Creador VIP</p>
                  <h3 className={`text-xl font-black truncate drop-shadow-md
                    ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 
                      isSilver ? 'text-slate-300' : 
                      isBronze ? 'text-amber-500' : 'text-pink-100'}
                  `}>
                    {clip.creator_name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate mt-2">{clip.title}</p>
                  
                  <a 
                    href={clip.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-5 block text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-pink-950/50 text-pink-300 border border-pink-800/50 hover:bg-pink-600 hover:text-white hover:border-pink-500 hover:shadow-[0_0_15px_rgba(219,39,119,0.5)]"
                  >
                    Ver Joya en Twitch
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto mt-12 border-t border-dashed border-pink-900/50 pt-8 text-center relative z-10">
        <p className="text-gray-400 text-sm">Fin de temporada y premiación en: <span className="font-bold text-yellow-500">61 días</span></p>
      </div>
    </section>
  );
};
