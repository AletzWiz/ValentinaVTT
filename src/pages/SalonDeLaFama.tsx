import React, { useEffect, useState } from 'react';

// Tipado para los clips
interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  creator_name: string;
  thumbnail_url: string;
  view_count: number;
  title: string;
}

export const SalonDeLaFama = () => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [loading, setLoading] = useState(true);

  // Aquí pondrás la lógica para obtener los clips
  useEffect(() => {
    const fetchClips = async () => {
      try {
        // NOTA: Para producción, lo ideal es que este fetch pase por una 
        // Vercel Function para no exponer tu Client Secret en el navegador.
        // Por ahora, simulamos la carga de los 20 mejores.
        setLoading(true);
        // Lógica de fetch... (Aquí iría tu llamada a la API de Twitch)
        
        // Simulación de datos para que veas el diseño:
        const mockClips = Array.from({ length: 20 }, (_, i) => ({
          id: `clip-${i}`,
          url: "#",
          embed_url: "",
          creator_name: i === 0 ? "TopEditor1" : i === 1 ? "ClipMaster" : i === 2 ? "VTT_Fan" : `User_${i}`,
          thumbnail_url: "https://pms-strategy.com/wp-content/uploads/2023/07/twitch-clip-thumbnail-placeholder.jpg",
          view_count: 5000 - (i * 200),
          title: `Momento épico #${i + 1}`
        }));
        
        setClips(mockClips);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  if (loading) return <div className="text-center py-20 text-pink-400 font-bold">Cargando la alfombra roja...</div>;

  return (
    <section className="min-h-screen bg-[#FFF5F8] pt-24 pb-12 px-4">
      {/* Título Elegante */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm mb-4">
          Salón de la Fama
        </h1>
        <p className="text-pink-400 font-medium italic">"Donde las leyendas de ValentinaVTT brillan para siempre"</p>
      </div>

      {/* Carrusel / Lista de Clips */}
      <div className="max-w-7xl mx-auto overflow-x-auto pb-8 flex gap-6 snap-x no-scrollbar">
        {clips.map((clip, index) => {
          const isGold = index === 0;
          const isSilver = index === 1;
          const isBronze = index === 2;

          return (
            <div 
              key={clip.id}
              className={`snap-center shrink-0 w-72 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2
                ${isGold ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-105' : 
                  isSilver ? 'ring-4 ring-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.4)]' :
                  isBronze ? 'ring-4 ring-amber-600 shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 
                  'bg-white shadow-md border border-pink-100'}
              `}
            >
              {/* Miniatura del Clip */}
              <div className="relative aspect-video">
                <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full">
                  {clip.view_count.toLocaleString()} vistas
                </div>
                {index < 3 && (
                  <div className={`absolute -top-1 -right-1 w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl shadow-lg
                    ${isGold ? 'bg-yellow-400 text-yellow-900' : isSilver ? 'bg-slate-300 text-slate-700' : 'bg-amber-600 text-amber-50'}
                  `}>
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Info del Creador */}
              <div className="p-4 bg-white">
                <p className="text-[10px] uppercase tracking-widest text-pink-300 font-bold mb-1">Creado por</p>
                <h3 className={`text-lg font-black truncate
                  ${isGold ? 'text-yellow-600' : isSilver ? 'text-slate-500' : isBronze ? 'text-amber-700' : 'text-pink-500'}
                `}>
                  {clip.creator_name}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-1">{clip.title}</p>
                
                <a 
                  href={clip.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 block text-center py-2 rounded-xl text-xs font-bold transition-colors bg-pink-50 text-pink-400 hover:bg-pink-500 hover:text-white"
                >
                  Ver en Twitch
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Decoración Estilo Alfombra Roja */}
      <div className="max-w-4xl mx-auto mt-12 border-t-2 border-dashed border-pink-200 pt-8 text-center">
        <p className="text-pink-300 text-sm">Próxima actualización de ranking en: <span className="font-bold">24 horas</span></p>
      </div>
    </section>
  );
};
