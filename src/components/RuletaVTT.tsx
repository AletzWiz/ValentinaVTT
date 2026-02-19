import { useState, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion } from 'framer-motion';

const coloresPastel = ['#FFB7C5', '#B2E2F2', '#D0F0C0', '#FDFD96', '#E6E6FA', '#FFD1DC'];

export const RuletaVTT = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [participantes, setParticipantes] = useState([
    { option: 'Saludito 💖', style: { backgroundColor: coloresPastel[0], textColor: '#fff' } },
    { option: 'VIP ✨', style: { backgroundColor: coloresPastel[1], textColor: '#fff' } },
    { option: 'Zing 📸', style: { backgroundColor: coloresPastel[2], textColor: '#fff' } }
  ]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const agregarNombre = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim() === '') return;
    
    const nuevoColor = coloresPastel[participantes.length % coloresPastel.length];
    setParticipantes([...participantes, { option: nuevoNombre, style: { backgroundColor: nuevoColor, textColor: '#666' } }]);
    setNuevoNombre('');
  };

  const limpiarRuleta = () => setParticipantes([]);

  const girarRuleta = () => {
    if (!mustSpin && participantes.length > 1) {
      const nuevoPremio = Math.floor(Math.random() * participantes.length);
      setPrizeNumber(nuevoPremio);
      setMustSpin(true);
      
      // Reproducir sonido si existe
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => console.log("Añade un ruleta.mp3 en public/"));
      }
    }
  };

  return (
    <motion.section 
      id="ruleta"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col items-center py-20 px-4"
    >
      {/* Audio oculto */}
      <audio ref={audioRef} src="/ruleta.mp3" preload="auto" />
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-2 drop-shadow-sm">
          ✨ RuletaVTT ✨
        </h2>
        <p className="text-pink-400 font-medium">¡Añade nombres y gira por un premio!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center max-w-5xl w-full">
        
        {/* Panel de Control para Valentina */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-200 shadow-xl shadow-pink-100/50 w-full md:w-80">
          <form onSubmit={agregarNombre} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nombre del sub..."
              className="flex-1 px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-600 bg-pink-50/50"
            />
            <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 font-bold shadow-md transition-all active:scale-95">+</button>
          </form>
          
          <div className="max-h-48 overflow-y-auto mb-4 space-y-2 pr-2">
            {participantes.map((p, i) => (
              <div key={i} className="bg-pink-100/50 px-3 py-2 rounded-lg text-sm text-pink-600 font-bold flex items-center shadow-sm border border-pink-100">
                <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center mr-2 shadow-sm text-xs">{i + 1}</span>
                {p.option}
              </div>
            ))}
          </div>
          
          <button onClick={limpiarRuleta} className="w-full text-pink-400 border-2 border-pink-200 py-2 rounded-xl hover:bg-pink-50 transition-all font-bold">
            Vaciar Nombres
          </button>
        </div>

        {/* Ruleta Flotante */}
        <motion.div 
          animate={{ y: [-10, 10, -10] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {participantes.length > 0 ? (
            <div className="drop-shadow-2xl scale-110">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={participantes}
                outerBorderColor="#ffffff"
                outerBorderWidth={6}
                innerRadius={15}
                innerBorderColor="#ffffff"
                radiusLineColor="#ffffff"
                radiusLineWidth={3}
                textColors={['#ffffff', '#666666']}
                fontSize={16}
                onStopSpinning={() => setMustSpin(false)}
              />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] bg-white/50 rounded-full flex items-center justify-center border-4 border-dashed border-pink-300 text-pink-400 font-bold text-center p-4 shadow-inner">
              Añade a alguien para jugar 🌸
            </div>
          )}

          <button
            onClick={girarRuleta}
            disabled={mustSpin || participantes.length < 2}
            className={`mt-10 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-12 py-4 rounded-full font-black text-2xl shadow-[0_10px_20px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all ${mustSpin ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ¡GIRAR! 💖
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};
