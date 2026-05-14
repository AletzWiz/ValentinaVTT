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
          <div className="border-4 border-dashed border-pink-900/50 rounded-[3rem] p-16 flex flex-col items-center justify-center bg-[#24131d]/50 backdrop-blur-sm transition-all hover:border-pink-500/50 hover:shadow
