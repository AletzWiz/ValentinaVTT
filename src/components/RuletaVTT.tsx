import { useState, useRef, useCallback } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Shuffle, Trophy } from 'lucide-react';

// ── Paleta kawaii vibrante para los segmentos ──
const SEGMENT_COLORS = [
  { bg: '#FF85A1', text: '#ffffff' },  // rosa principal
  { bg: '#C084FC', text: '#ffffff' },  // lavanda
  { bg: '#7DD3FC', text: '#ffffff' },  // cielo
  { bg: '#86EFAC', text: '#ffffff' },  // mint
  { bg: '#FCA5A5', text: '#ffffff' },  // coral
  { bg: '#FDE68A', text: '#5a3e00' },  // amarillo
  { bg: '#F9A8D4', text: '#ffffff' },  // rosa claro
  { bg: '#A5F3FC', text: '#0e4c54' },  // cyan suave
];

const getColor = (idx: number) => SEGMENT_COLORS[idx % SEGMENT_COLORS.length];

/**
 * Genera un índice verdaderamente aleatorio usando crypto.getRandomValues
 */
function randomIndex(length: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % length;
}

interface Participante {
  option: string;
  style: { backgroundColor: string; textColor: string };
}

export const RuletaVTT = () => {
  const [mustSpin, setMustSpin]           = useState(false);
  const [prizeNumber, setPrizeNumber]     = useState(0);
  const [nuevoNombre, setNuevoNombre]     = useState('');
  const [ganador, setGanador]             = useState<string | null>(null);
  const [showConfetti, setShowConfetti]   = useState(false);
  const [participantes, setParticipantes] = useState<Participante[]>([
    { option: 'Saludito 💖', style: { backgroundColor: getColor(0).bg, textColor: getColor(0).text } },
    { option: 'VIP ✨',       style: { backgroundColor: getColor(1).bg, textColor: getColor(1).text } },
    { option: 'Zing 📸',     style: { backgroundColor: getColor(2).bg, textColor: getColor(2).text } },
  ]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Re-asigna colores por índice
  const rebuildColors = (arr: Participante[]): Participante[] =>
    arr.map((p, i) => ({
      ...p,
      style: { backgroundColor: getColor(i).bg, textColor: getColor(i).text },
    }));

  const agregarNombre = (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    setParticipantes(prev => rebuildColors([
      ...prev,
      { option: nombre, style: { backgroundColor: '', textColor: '' } },
    ]));
    setNuevoNombre('');
    setGanador(null);
  };

  const eliminarNombre = useCallback((index: number) => {
    setParticipantes(prev => rebuildColors(prev.filter((_, i) => i !== index)));
    setGanador(null);
  }, []);

  const limpiarRuleta = () => {
    setParticipantes([]);
    setGanador(null);
  };

  const girarRuleta = () => {
    if (mustSpin || participantes.length < 2) return;

    setGanador(null);
    setShowConfetti(false);

    // 1. Reset explicit de la bandera para evitar el bug de rebozado en giros consecutivos
    setMustSpin(false);

    // 2. Calculamos premio
    const nuevoPremio = randomIndex(participantes.length);
    setPrizeNumber(nuevoPremio);

    // 3. Pequeña espera en el siguiente event-loop tick para reiniciar limpiamente
    setTimeout(() => {
      setMustSpin(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    const winner = participantes[prizeNumber]?.option ?? '';
    setGanador(winner);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <motion.div
      id="ruleta"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative min-h-screen flex flex-col items-center justify-start py-24 px-4 overflow-hidden"
    >
      {/* Audio */}
      <audio ref={audioRef} src="/ruleta.mp3" preload="auto" />

      {/* ── Background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          width: '60vw', height: '60vw', maxWidth: 700, maxHeight: 700,
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%)',
          animation: 'float-slow 12s ease-in-out infinite',
        }} />
        <div className="absolute" style={{
          width: '50vw', height: '50vw', maxWidth: 600, maxHeight: 600,
          top: '-10%', right: '-15%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.2) 0%, transparent 70%)',
          animation: 'float-slow 14s ease-in-out infinite',
          animationDelay: '-5s',
        }} />
        <div className="absolute" style={{
          width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500,
          bottom: '5%', left: '30%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.18) 0%, transparent 70%)',
          animation: 'float-slow 10s ease-in-out infinite',
          animationDelay: '-3s',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,133,161,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-12 pt-4">
        <h1
          className="font-black mb-2 leading-tight tracking-tight pt-2 pb-1"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            background: 'linear-gradient(135deg, #FF85A1, #A78BFA, #7DD3FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 4s ease infinite',
          }}
        >
          🎡 RuletaVTT
        </h1>
        <p className="font-semibold text-lg" style={{ color: '#A78BFA' }}>
          ¡Agrega nombres y gira para elegir al ganador! 💖
        </p>
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start justify-center w-full max-w-5xl">

        {/* ── Panel izquierdo: lista de participantes ── */}
        <div
          className="w-full lg:w-80 rounded-3xl p-6 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,133,161,0.2)',
            boxShadow: '0 15px 50px rgba(255,133,161,0.15)',
          }}
        >
          {/* Input agregar */}
          <form onSubmit={agregarNombre} className="flex gap-2 mb-5">
            <input
              type="text"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              placeholder="Nombre del participante..."
              maxLength={30}
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: 'rgba(255,133,161,0.3)',
                color: '#3D1A2B',
                background: 'rgba(255,240,245,0.8)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#FF85A1')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,133,161,0.3)')}
            />
            <button
              type="submit"
              title="Agregar"
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF85A1, #C084FC)', color: 'white' }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Contador */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#A78BFA' }}>
              Participantes ({participantes.length})
            </span>
            {participantes.length > 0 && (
              <button
                onClick={limpiarRuleta}
                className="flex items-center gap-1 text-xs font-bold transition-all hover:scale-105"
                style={{ color: '#FF85A1' }}
                title="Vaciar todo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar
              </button>
            )}
          </div>

          {/* Lista scrolleable */}
          <div
            className="max-h-72 overflow-y-auto space-y-2 pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFB3C6 transparent' }}
          >
            <AnimatePresence mode="popLayout">
              {participantes.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-sm font-semibold"
                  style={{ color: '#C084FC' }}
                >
                  Agrega participantes 🌸
                </motion.p>
              ) : (
                participantes.map((p, i) => (
                  <motion.div
                    key={`${p.option}-${i}`}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: 'backOut' }}
                    className="group flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-bold"
                    style={{
                      background: `${p.style.backgroundColor}22`,
                      border: `2px solid ${p.style.backgroundColor}55`,
                      color: '#3D1A2B',
                    }}
                  >
                    {/* Color dot */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: p.style.backgroundColor }}
                    />
                    {/* Name */}
                    <span className="flex-1 truncate">{p.option}</span>
                    {/* Delete button */}
                    <button
                      onClick={() => eliminarNombre(i)}
                      disabled={mustSpin}
                      title="Eliminar"
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-90 disabled:cursor-not-allowed"
                      style={{ background: '#FF85A1', color: 'white' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Aviso aleatorio */}
          <div
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold"
            style={{ background: 'rgba(167,139,250,0.12)', color: '#7C3AED' }}
          >
            <Shuffle className="w-3.5 h-3.5 flex-shrink-0" />
            Selección 100% aleatoria con crypto API
          </div>
        </div>

        {/* ── Panel derecho: ruleta + botón ── */}
        <div className="flex flex-col items-center gap-8 flex-1">

          {/* Ruleta o placeholder */}
          {participantes.length >= 2 ? (
            <div className="relative">
              {/* Glow detrás de la ruleta */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-40"
                style={{ background: 'linear-gradient(135deg, #FF85A1, #C084FC, #7DD3FC)' }}
              />
              <div
                className="relative rounded-full p-2 shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
              >
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={participantes}
                  outerBorderColor="#FFB3C6"
                  outerBorderWidth={6}
                  innerRadius={18}
                  innerBorderColor="#ffffff"
                  radiusLineColor="rgba(255,255,255,0.6)"
                  radiusLineWidth={2}
                  fontSize={15}
                  perpendicularText={true}
                  spinDuration={0.8}
                  onStopSpinning={onStopSpinning}
                />
              </div>
            </div>
          ) : (
            <div
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full flex flex-col items-center justify-center border-4 border-dashed text-center p-6 font-bold"
              style={{
                borderColor: 'rgba(255,133,161,0.4)',
                color: '#C084FC',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-4xl mb-3">🎡</span>
              <span className="text-sm">
                {participantes.length === 0
                  ? 'Agrega al menos 2 participantes 🌸'
                  : 'Necesitas 1 participante más 💕'}
              </span>
            </div>
          )}

          {/* Botón girar */}
          <motion.button
            onClick={girarRuleta}
            disabled={mustSpin || participantes.length < 2}
            whileHover={!mustSpin && participantes.length >= 2 ? { scale: 1.07 } : {}}
            whileTap={!mustSpin && participantes.length >= 2 ? { scale: 0.95 } : {}}
            className="relative px-14 py-5 rounded-full font-black text-white text-2xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: mustSpin
                ? 'linear-gradient(135deg, #d1a3b5, #b08fc4)'
                : 'linear-gradient(135deg, #FF85A1, #C084FC)',
              boxShadow: mustSpin ? 'none' : '0 10px 40px rgba(255,133,161,0.6)',
            }}
          >
            {/* Shimmer */}
            {!mustSpin && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s ease infinite',
                }}
              />
            )}
            <span className="relative">
              {mustSpin ? '⏳ Girando...' : '🎡 ¡GIRAR!'}
            </span>
          </motion.button>

          {/* Banner ganador */}
          <AnimatePresence>
            {ganador && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative text-center rounded-3xl px-10 py-6 shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FF85A1, #C084FC)',
                  boxShadow: '0 15px 50px rgba(255,133,161,0.5)',
                }}
              >
                <div className="text-white/80 text-sm font-bold mb-1 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-300" /> ¡Ganador!
                </div>
                <div className="text-white font-black text-3xl sm:text-4xl leading-tight">
                  {ganador}
                </div>
                <div className="text-white/80 text-sm mt-2 font-semibold">¡Felicidades! 🎉✨</div>

                {/* Confetti sparkles */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 12 }, (_, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-lg select-none"
                        initial={{
                          x: '50%', y: '50%',
                          opacity: 1, scale: 0,
                        }}
                        animate={{
                          x: `${15 + (i * 7) % 70}%`,
                          y: `${10 + (i * 11) % 80}%`,
                          opacity: 0,
                          scale: 1,
                        }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                      >
                        {['✨', '🌸', '💖', '⭐', '🎉', '💕'][i % 6]}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
