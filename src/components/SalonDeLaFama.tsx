import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Check, Sparkles, X, Heart, Star } from 'lucide-react';

interface CategoriaGala {
  id: string;
  emoji: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  lado: 'left' | 'right';
  nominados: { id: string; nombre: string; detalle: string; votos: number }[];
}

const CATEGORIAS_GALA: CategoriaGala[] = [
  {
    id: 'clip-oro',
    emoji: '🎬',
    titulo: 'El Clip de Oro',
    subtitulo: 'El momento más épico del stream',
    descripcion: 'El clip que rompió la comunidad y sacó las mejores risas.',
    lado: 'left',
    nominados: [
      { id: 'c1', nombre: 'Reacción Épica al Jumpscare', detalle: 'Clip por Juan_VT', votos: 142 },
      { id: 'c2', nombre: 'Victoria Impensable en Final', detalle: 'Clip por MariaGamer', votos: 98 },
      { id: 'c3', nombre: 'Risa Contagiosa en Directo', detalle: 'Clip por AlexVTT', votos: 210 },
    ],
  },
  {
    id: 'mvp-comunidad',
    emoji: '🛡️',
    titulo: 'MVP de la Comunidad',
    subtitulo: 'El miembro más valioso y activo',
    descripcion: 'Quien siempre está apoyando en el chat, eventos y Discord.',
    lado: 'right',
    nominados: [
      { id: 'm1', nombre: 'Aletzwiz', detalle: 'Creador de la Web & Mod activo', votos: 340 },
      { id: 'm2', nombre: 'Soto_VTT', detalle: 'Líder de Eventos en Discord', votos: 215 },
      { id: 'm3', nombre: 'PinkyStar', detalle: 'Sub #1 y apoyo incondicional', votos: 189 },
    ],
  },
  {
    id: 'mod-trabajador',
    emoji: '🛡️',
    titulo: 'El Mod más trabajador',
    subtitulo: 'El guardián del chat',
    descripcion: 'El moderador que siempre mantiene la paz y la buena onda.',
    lado: 'left',
    nominados: [
      { id: 'mo1', nombre: 'ValenMod_Zero', detalle: '120h de moderación en directo', votos: 180 },
      { id: 'mo2', nombre: 'KawaiiGuard', detalle: 'Organizador del chat & comandos', votos: 245 },
      { id: 'mo3', nombre: 'ShieldPink', detalle: 'Protector en sorteos y eventos', votos: 130 },
    ],
  },
  {
    id: 'peor-manqueada',
    emoji: '💀',
    titulo: 'Peor Manqueada / Susto',
    subtitulo: 'El momento F en el chat',
    descripcion: 'Aquella jugada que salió tan mal que dio la vuelta y fue legendaria.',
    lado: 'right',
    nominados: [
      { id: 'pm1', nombre: 'Caída al vacío en Minecraft', detalle: 'Perdió todo el diamante', votos: 310 },
      { id: 'pm2', nombre: 'Susto por el gato en directo', detalle: 'Grito de terror nivel 10', votos: 275 },
      { id: 'pm3', nombre: 'Granada a los propios compañeros', detalle: 'Eliminación en equipo accidental', votos: 190 },
    ],
  },
  {
    id: 'frase-celebre',
    emoji: '💬',
    titulo: 'Frase Célebre',
    subtitulo: 'La frase icónica de la temporada',
    descripcion: 'Esa frase espontánea que se convirtió en sticker y emote de la comunidad.',
    lado: 'left',
    nominados: [
      { id: 'fc1', nombre: '¡Eso no era un bug, era una característica! 🌸', detalle: 'En directo de terror', votos: 285 },
      { id: 'fc2', nombre: '¡Última partida y me voy a dormir! (Fueron 4h más)', detalle: 'Directo nocturno', votos: 420 },
      { id: 'fc3', nombre: '¡El chat me distrajo, lo juro!', detalle: 'Luego de fallar un salto fácil', votos: 310 },
    ],
  },
  {
    id: 'art-temporada',
    emoji: '🎨',
    titulo: 'Art de la Temporada',
    subtitulo: 'La mejor obra de arte o dibujo de un fan',
    descripcion: 'El fanart que más enamoró a Valentina y a toda la comunidad VTT.',
    lado: 'right',
    nominados: [
      { id: 'art1', nombre: 'Valentina Chibi en la Playa', detalle: 'Arte digital por SakuraArts', votos: 350 },
      { id: 'art2', nombre: 'Retrato Valentina Anime Gold', detalle: 'Ilustración por NekoDraws', votos: 290 },
      { id: 'art3', nombre: 'Stickers Emotes para Twitch', detalle: 'Set de emotes por PixelVT', votos: 240 },
    ],
  },
];

export const SalonDeLaFama = () => {
  const [votosLocal, setVotosLocal] = useState<Record<string, string>>({});
  const [modalCat, setModalCat]     = useState<CategoriaGala | null>(null);

  // Cargar votos guardados
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vtt_votos');
      if (saved) setVotosLocal(JSON.parse(saved));
    } catch {}
  }, []);

  const votar = (catId: string, nominadoId: string) => {
    const nuevosVotos = { ...votosLocal, [catId]: nominadoId };
    setVotosLocal(nuevosVotos);
    try {
      localStorage.setItem('vtt_votos', JSON.stringify(nuevosVotos));
    } catch {}
  };

  return (
    <section className="min-h-screen text-white pt-24 pb-32 px-4 relative overflow-hidden bg-[#180612]">

      {/* ── Fondo de Luces y Brillos Gala ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4a152e] via-[#1b0613] to-[#0c0208] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-pink-500/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />

      {/* ── HEADER PRINCIPAL ── */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 via-pink-500/15 to-amber-400/15 border border-amber-300/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(253,230,138,0.2)]">
          <Trophy className="w-4 h-4 text-amber-300" /> GALA DE LA COMUNIDAD VTT
        </div>

        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-widest uppercase mb-3 drop-shadow-[0_4px_30px_rgba(255,133,161,0.5)]"
          style={{
            background: 'linear-gradient(135deg, #FFF0F5 0%, #FFB3C6 35%, #FDE68A 70%, #FF85A1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SALÓN DE LA FAMA
        </h1>

        <p className="text-pink-200/90 font-extrabold text-sm md:text-base tracking-wider max-w-md mx-auto">
          Recorre la alfombra roja y vota por tus favoritos en cada categoría 🏆
        </p>
      </div>

      {/* ── PASEO DE LA ALFOMBRA ROJA (RED CARPET CORRIDOR) ── */}
      <div className="relative max-w-5xl mx-auto z-10">

        {/* ── ALFOMBRA ROJA PERSPECTIVA PERMANENTE EN EL CENTRO ── */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 sm:w-36 md:w-44 pointer-events-none z-0 overflow-hidden flex flex-col items-center">
          {/* Desenrolle de la alfombra con Framer Motion */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="w-full h-full origin-top relative shadow-[0_0_50px_rgba(239,68,68,0.4)]"
            style={{
              background: 'linear-gradient(90deg, #991b1b 0%, #dc2626 30%, #ef4444 50%, #dc2626 70%, #991b1b 100%)',
              borderLeft: '4px solid #fde047',
              borderRight: '4px solid #fde047',
            }}
          >
            {/* Destellos dorados en la alfombra */}
            <div className="absolute inset-0 opacity-25" style={{
              backgroundImage: 'radial-gradient(circle, #fde047 1px, transparent 1px)',
              backgroundSize: '24px 48px',
            }} />
          </motion.div>
        </div>

        {/* ── TARJETAS ZIG-ZAG A LO LARGO DE LA ALFOMBRA ── */}
        <div className="relative z-10 space-y-16 py-8">
          {CATEGORIAS_GALA.map((cat, idx) => {
            const esIzquierda = cat.lado === 'left';
            const votoId = votosLocal[cat.id];
            const yaVoto = !!votoId;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: esIzquierda ? -80 : 80, y: 40 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className={`flex w-full ${esIzquierda ? 'justify-start pr-8 md:pr-0' : 'justify-end pl-8 md:pl-0'}`}
              >
                <div className="w-full md:w-[45%] relative group">

                  {/* Conector desde la tarjeta hacia la alfombra central */}
                  <div
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-300 to-pink-400 opacity-60 z-0 ${
                      esIzquierda ? '-right-16 w-16' : '-left-16 w-16'
                    }`}
                  />

                  {/* Tarjeta Flotante de Gala */}
                  <div
                    className="relative rounded-3xl p-6 sm:p-7 overflow-hidden transition-all duration-500 hover:scale-[1.03] shadow-2xl"
                    style={{
                      background: 'linear-gradient(145deg, rgba(65,18,40,0.92) 0%, rgba(28,8,18,0.96) 100%)',
                      border: '2px solid rgba(253,230,138,0.35)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(255,133,161,0.15)',
                    }}
                  >
                    {/* Esquinas doradas */}
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-amber-300/70" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-amber-300/70" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-amber-300/70" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-amber-300/70" />

                    {/* Encabezado de la Tarjeta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/25 to-amber-400/25 border border-amber-300/40 flex items-center justify-center text-2xl shadow-lg">
                        {cat.emoji}
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        yaVoto
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-amber-400/15 text-amber-300 border-amber-300/40'
                      }`}>
                        {yaVoto ? '✓ VOTO REGISTRADO' : '✨ VOTACIÓN ABIERTA'}
                      </span>
                    </div>

                    {/* Título & Subtítulo */}
                    <h3 className="text-2xl font-black text-white mb-1 tracking-wide group-hover:text-amber-300 transition-colors">
                      {cat.titulo}
                    </h3>
                    <p className="text-xs font-bold text-amber-300/80 mb-2 uppercase tracking-wider">
                      {cat.subtitulo}
                    </p>
                    <p className="text-xs text-pink-200/70 mb-6 font-semibold leading-relaxed">
                      {cat.descripcion}
                    </p>

                    {/* Botón para Abrir Votaciones */}
                    <button
                      onClick={() => setModalCat(cat)}
                      className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-xs tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-amber-300 via-pink-400 to-amber-400 text-black shadow-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(253,230,138,0.6)]"
                    >
                      <Sparkles className="w-4 h-4" />
                      {yaVoto ? 'Ver Nominados & Cambiar Voto' : 'Votar por esta Categoría'}
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── PUERTAS CERRADAS DEL SALÓN AL FINAL DE LA ALFOMBRA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative mt-20 pt-10 text-center"
        >
          {/* Estructura de las Grandes Puertas Doradas Cerradas */}
          <div className="relative max-w-md mx-auto rounded-3xl p-8 bg-gradient-to-b from-[#3a1024] to-[#16050e] border-2 border-amber-300/60 shadow-[0_0_60px_rgba(253,230,138,0.25)] overflow-hidden">
            {/* Brillo de las Puertas */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

            {/* Ilustración visual de puertas cerradas de gala */}
            <div className="relative w-48 h-56 mx-auto mb-6 flex rounded-2xl overflow-hidden border-2 border-amber-300/50 shadow-2xl bg-[#0f0409]">
              {/* Puerta Izquierda */}
              <div className="w-1/2 h-full bg-gradient-to-r from-[#4a152e] to-[#2b0c1b] border-r border-amber-300/60 flex flex-col justify-center items-end pr-2">
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
              </div>
              {/* Puerta Derecha */}
              <div className="w-1/2 h-full bg-gradient-to-l from-[#4a152e] to-[#2b0c1b] border-l border-amber-300/60 flex flex-col justify-center items-start pl-2">
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-amber-300 tracking-wider uppercase mb-2">
              Puertas de la Gran Gala
            </h3>
            <p className="text-xs font-semibold text-pink-200/80 mb-4">
              Las puertas se abrirán oficialmente al finalizar el periodo de votaciones.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-xs font-black tracking-widest uppercase">
              ✨ Próxima Gran Gala: 30 Días
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── MODAL INTERACTIVO DE VOTACIÓN ── */}
      <AnimatePresence>
        {modalCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalCat(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 overflow-hidden text-white shadow-2xl z-10"
              style={{
                background: 'linear-gradient(160deg, #3d1226 0%, #1a0611 100%)',
                border: '2px solid rgba(253,230,138,0.5)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(255,133,161,0.25)',
              }}
            >
              {/* Botón Cerrar */}
              <button
                onClick={() => setModalCat(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-amber-300" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{modalCat.emoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{modalCat.titulo}</h3>
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{modalCat.subtitulo}</p>
                </div>
              </div>

              <p className="text-xs text-pink-200/70 mb-6 font-semibold">
                Selecciona tu candidato preferido para registrar tu voto en esta categoría:
              </p>

              {/* Lista de Nominados */}
              <div className="space-y-3 mb-6">
                {modalCat.nominados.map((nom) => {
                  const selec = votosLocal[modalCat.id] === nom.id;

                  return (
                    <div
                      key={nom.id}
                      onClick={() => votar(modalCat.id, nom.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        selec
                          ? 'bg-gradient-to-r from-amber-400/25 to-pink-500/25 border-amber-300 shadow-[0_0_20px_rgba(253,230,138,0.3)] scale-[1.02]'
                          : 'bg-white/5 border-pink-500/20 hover:border-amber-300/40 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-sm text-white flex items-center gap-2">
                          {nom.nombre}
                          {selec && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="text-xs text-pink-200/60 font-semibold">{nom.detalle}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-300 block">
                          {nom.votos + (selec ? 1 : 0)} VOTOS
                        </span>
                        <span className="text-[10px] text-pink-200/50 font-bold">
                          {selec ? '¡Tu Voto!' : 'Hacer clic para votar'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setModalCat(null)}
                className="w-full py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase bg-gradient-to-r from-amber-300 to-pink-400 text-black shadow-lg hover:scale-105 transition-all"
              >
                Confirmar & Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
