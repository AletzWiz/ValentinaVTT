import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Check, Sparkles, X, Heart, ExternalLink, Play, Crown, Award, LogIn, LogOut, ShieldCheck } from 'lucide-react';

interface Nominado {
  id: string;
  nombre: string;
  creador?: string;
  detalle: string;
  clipUrl?: string;
  votos: number;
}

interface CategoriaGala {
  id: string;
  emoji: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  lado: 'left' | 'right';
  nominados: Nominado[];
}

interface TopRachaUser {
  posicion: number;
  nombre: string;
  dias: number;
  rango: string;
  avatar: string;
  frase: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
}

// 🌟 Esquinas de Gala Rosa Dorado 🌟
const CornerBrackets = ({ color = 'border-amber-300/60' }: { color?: string }) => (
  <>
    <div className={`absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 ${color} pointer-events-none z-20`} />
    <div className={`absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 ${color} pointer-events-none z-20`} />
    <div className={`absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 ${color} pointer-events-none z-20`} />
    <div className={`absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 ${color} pointer-events-none z-20`} />
  </>
);

// Extraer el slug del clip de Twitch
function getTwitchClipSlug(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/clip\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export const SalonDeLaFama = () => {
  const [categorias, setCategorias]   = useState<CategoriaGala[]>([]);
  const [topRachas, setTopRachas]     = useState<TopRachaUser[]>([]);
  const [temporada, setTemporada]     = useState(1);
  const [diasRestantes, setDias]     = useState(30);
  const [loading, setLoading]         = useState(true);

  // Votaciones: mapa de catId -> Array de nId elegidos (máx 3)
  const [misVotos, setMisVotos]       = useState<Record<string, string[]>>({});
  const [modalCat, setModalCat]       = useState<CategoriaGala | null>(null);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [showRachasSec, setShowRachasSec] = useState(false);

  // Cargar configuración editable desde JSON
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);

        // 1. Cargar gala_config.json
        const resGala = await fetch('/gala_config.json?v=' + Date.now());
        if (resGala.ok) {
          const dataGala = await resGala.json();
          setCategorias(dataGala.categorias || []);
          setTemporada(dataGala.temporada || 1);
          setDias(dataGala.diasRestantesGala || 30);
        }

        // 2. Cargar top_rachas.json
        const resRachas = await fetch('/top_rachas.json?v=' + Date.now());
        if (resRachas.ok) {
          const dataRachas = await resRachas.json();
          setTopRachas(dataRachas || []);
        }

        // 3. Cargar votos y usuario Discord local
        const savedVotos = localStorage.getItem('vtt_votos_multi');
        if (savedVotos) setMisVotos(JSON.parse(savedVotos));

        const savedUser = localStorage.getItem('vtt_discord_user');
        if (savedUser) setDiscordUser(JSON.parse(savedUser));

      } catch (err) {
        console.error("Error al cargar gala_config.json:", err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Simular conexión segura con Discord OAuth2
  const conectarDiscord = () => {
    // Generar sesión segura simulada de Discord
    const userSimulado: DiscordUser = {
      id: 'discord_' + Math.floor(Math.random() * 899999 + 100000),
      username: 'ViewerVTT_' + Math.floor(Math.random() * 90 + 10),
      avatar: 'https://ui-avatars.com/api/?name=Discord+User&background=5865F2&color=fff&bold=true',
    };
    setDiscordUser(userSimulado);
    localStorage.setItem('vtt_discord_user', JSON.stringify(userSimulado));
  };

  const desconectarDiscord = () => {
    setDiscordUser(null);
    localStorage.removeItem('vtt_discord_user');
  };

  // Votar o desvotar (hasta 3 votos por categoría)
  const toggleVoto = (catId: string, nomId: string) => {
    const votosActuales = misVotos[catId] || [];
    let nuevosVotosCat: string[];

    if (votosActuales.includes(nomId)) {
      // Remover voto
      nuevosVotosCat = votosActuales.filter(id => id !== nomId);
    } else {
      // Agregar voto si aún no llega a 3
      if (votosActuales.length >= 3) return;
      nuevosVotosCat = [...votosActuales, nomId];
    }

    const nuevoMapa = { ...misVotos, [catId]: nuevosVotosCat };
    setMisVotos(nuevoMapa);
    try {
      localStorage.setItem('vtt_votos_multi', JSON.stringify(nuevoMapa));
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#180612] flex flex-col items-center justify-center text-amber-300 font-bold">
        <Sparkles className="w-12 h-12 animate-spin text-pink-400 mb-4" />
        <span className="tracking-widest uppercase text-sm">Cargando el Salón de la Fama...</span>
      </div>
    );
  }

  return (
    <section className="min-h-screen text-white pt-24 pb-32 px-4 relative overflow-hidden bg-[#180612]">

      {/* ── Fondo de Luces y Brillos Gala ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4a152e] via-[#1b0613] to-[#0c0208] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-pink-500/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />

      {/* ── BARRA SUPERIOR DE DISCORD & SECCIONES ── */}
      <div className="relative z-30 max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-pink-500/20">
        
        {/* Switch entre Gala & Reconocimiento Top 5 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRachasSec(false)}
            className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${
              !showRachasSec
                ? 'bg-gradient-to-r from-amber-300 to-pink-400 text-black shadow-lg scale-105'
                : 'bg-white/5 border border-pink-500/20 text-pink-200/70 hover:text-white'
            }`}
          >
            🏆 Nominaciones & Votaciones
          </button>
          <button
            onClick={() => setShowRachasSec(true)}
            className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${
              showRachasSec
                ? 'bg-gradient-to-r from-amber-300 to-pink-400 text-black shadow-lg scale-105'
                : 'bg-white/5 border border-pink-500/20 text-pink-200/70 hover:text-white'
            }`}
          >
            🔥 Top 5 Leyendas de Racha
          </button>
        </div>

        {/* Discord Auth Box */}
        <div className="flex items-center gap-3">
          {discordUser ? (
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-emerald-300">
                {discordUser.username} (Autenticado)
              </span>
              <button
                onClick={desconectarDiscord}
                title="Desconectar"
                className="text-pink-300 hover:text-red-400 ml-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={conectarDiscord}
              className="btn-kawaii bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Conectar Discord para Votar
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN ESPECIAL: TOP 5 RECONOCIMIENTO DE RACHAS */}
      {/* ========================================================= */}
      {showRachasSec ? (
        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4">
            <Crown className="w-4 h-4 text-amber-300" /> SALÓN DE RECONOCIMIENTO TWITCH
          </div>

          <h2
            className="text-3xl sm:text-5xl font-black uppercase tracking-widest mb-3"
            style={{
              background: 'linear-gradient(135deg, #FFF0F5, #FDE68A, #FF85A1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🔥 Top 5 Leyendas de Racha
          </h2>
          <p className="text-pink-200/80 text-xs sm:text-sm font-semibold max-w-md mx-auto mb-10">
            Un tributo especial a los espectadores más fieles que mantienen encendida la llama de la comunidad VTT.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {topRachas.map((user) => {
              const isTop1 = user.posicion === 1;
              const isTop2 = user.posicion === 2;
              const isTop3 = user.posicion === 3;

              return (
                <div
                  key={user.posicion}
                  className={`relative rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 ${
                    isTop1
                      ? 'bg-gradient-to-b from-amber-400/25 via-[#350f22] to-[#16050e] border-2 border-amber-300 shadow-[0_0_30px_rgba(253,230,138,0.3)] md:-translate-y-4'
                      : isTop2
                      ? 'bg-gradient-to-b from-pink-300/15 via-[#350f22] to-[#16050e] border border-pink-300/60 md:-translate-y-2'
                      : isTop3
                      ? 'bg-gradient-to-b from-amber-600/15 via-[#350f22] to-[#16050e] border border-amber-500/50'
                      : 'bg-[#210917] border border-pink-500/20'
                  }`}
                >
                  <CornerBrackets color={isTop1 ? 'border-amber-300' : 'border-pink-500/30'} />

                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-3 shadow-md ${
                      isTop1
                        ? 'bg-amber-300 text-black'
                        : isTop2
                        ? 'bg-slate-200 text-black'
                        : isTop3
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/10 text-pink-300'
                    }`}
                  >
                    #{user.posicion}
                  </div>

                  {/* Avatar */}
                  <img
                    src={user.avatar}
                    alt={user.nombre}
                    className="w-16 h-16 rounded-full border-2 border-amber-300/50 mb-3 object-cover shadow-lg"
                  />

                  {/* Name & Range */}
                  <h3 className="font-black text-base text-white truncate w-full mb-0.5">{user.nombre}</h3>
                  <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase mb-2">
                    {user.rango}
                  </span>

                  {/* Days */}
                  <div className="px-3 py-1 rounded-full bg-black/60 border border-amber-300/30 text-xs font-black text-white flex items-center gap-1 mb-3">
                    <Flame className="w-3.5 h-3.5 text-amber-300" /> {user.dias} Días
                  </div>

                  <p className="text-[11px] text-pink-200/70 font-semibold italic leading-tight">
                    "{user.frase}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* ── HEADER PRINCIPAL DE LA GALA ── */}
          <div className="relative z-20 text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 via-pink-500/15 to-amber-400/15 border border-amber-300/40 text-amber-300 text-[11px] sm:text-xs font-black tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(253,230,138,0.2)]">
              <Trophy className="w-3.5 h-3.5 text-amber-300" /> GALA DE LA COMUNIDAD VTT
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-7xl font-black tracking-widest uppercase mb-2 drop-shadow-[0_4px_30px_rgba(255,133,161,0.5)]"
              style={{
                background: 'linear-gradient(135deg, #FFF0F5 0%, #FFB3C6 35%, #FDE68A 70%, #FF85A1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SALÓN DE LA FAMA
            </h1>

            <p className="text-pink-200/90 font-extrabold text-xs sm:text-sm tracking-wider max-w-xs sm:max-w-md mx-auto">
              Recorre la alfombra roja y vota hasta 3 veces por tus favoritos en cada categoría 🏆
            </p>
          </div>

          {/* ── PASEO DE LA ALFOMBRA ROJA ── */}
          <div className="relative max-w-5xl mx-auto z-10">

            {/* ── ALFOMBRA ROJA PERSPECTIVA ── */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-16 sm:w-28 md:w-44 pointer-events-none z-0 overflow-hidden flex flex-col items-center">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="w-full h-full origin-top relative shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                style={{
                  background: 'linear-gradient(90deg, #991b1b 0%, #dc2626 30%, #ef4444 50%, #dc2626 70%, #991b1b 100%)',
                  borderLeft: '3px solid #fde047',
                  borderRight: '3px solid #fde047',
                }}
              >
                <div className="absolute inset-0 opacity-25" style={{
                  backgroundImage: 'radial-gradient(circle, #fde047 1px, transparent 1px)',
                  backgroundSize: '20px 40px',
                }} />
              </motion.div>
            </div>

            {/* ── TARJETAS ZIG-ZAG ── */}
            <div className="relative z-10 space-y-12 sm:space-y-16 py-6">
              {categorias.map((cat) => {
                const esIzquierda = cat.lado === 'left';
                const votosCat = misVotos[cat.id] || [];
                const tieneVotos = votosCat.length > 0;

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: esIzquierda ? -50 : 50, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                    className={`flex w-full ${esIzquierda ? 'justify-start md:justify-start' : 'justify-end md:justify-end'}`}
                  >
                    <div className="w-[88%] sm:w-[80%] md:w-[45%] mx-auto md:mx-0 relative group">

                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-300 to-pink-400 opacity-60 z-0 ${
                          esIzquierda ? '-right-16 w-16' : '-left-16 w-16'
                        }`}
                      />

                      {/* Tarjeta Flotante */}
                      <div
                        className="relative rounded-3xl p-5 sm:p-7 overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl"
                        style={{
                          background: 'linear-gradient(145deg, rgba(65,18,40,0.92) 0%, rgba(28,8,18,0.96) 100%)',
                          border: '2px solid rgba(253,230,138,0.35)',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(255,133,161,0.15)',
                        }}
                      >
                        <CornerBrackets color="border-amber-300/70" />

                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-500/25 to-amber-400/25 border border-amber-300/40 flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                            {cat.emoji}
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase border truncate ${
                            tieneVotos
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                              : 'bg-amber-400/15 text-amber-300 border-amber-300/40'
                          }`}>
                            {votosCat.length > 0 ? `✓ Votos: ${votosCat.length}/3` : '✨ 3 Votos'}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-0.5 tracking-wide group-hover:text-amber-300 transition-colors">
                          {cat.titulo}
                        </h3>
                        <p className="text-[11px] sm:text-xs font-bold text-amber-300/80 mb-2 uppercase tracking-wider">
                          {cat.subtitulo}
                        </p>
                        <p className="text-xs text-pink-200/70 mb-5 font-semibold leading-relaxed">
                          {cat.descripcion}
                        </p>

                        <button
                          onClick={() => setModalCat(cat)}
                          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-xs tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-amber-300 via-pink-400 to-amber-400 text-black shadow-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(253,230,138,0.6)]"
                        >
                          <Sparkles className="w-4 h-4" />
                          {tieneVotos ? `Votar / Modificar (${votosCat.length}/3)` : 'Votar / Ver Nominados'}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Puertas del Salón al final */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative mt-20 pt-10 text-center"
            >
              <div className="relative max-w-md mx-auto rounded-3xl p-8 bg-gradient-to-b from-[#3a1024] to-[#16050e] border-2 border-amber-300/60 shadow-[0_0_60px_rgba(253,230,138,0.25)] overflow-hidden">
                <div className="relative w-48 h-56 mx-auto mb-6 flex rounded-2xl overflow-hidden border-2 border-amber-300/50 shadow-2xl bg-[#0f0409]">
                  <div className="w-1/2 h-full bg-gradient-to-r from-[#4a152e] to-[#2b0c1b] border-r border-amber-300/60 flex flex-col justify-center items-end pr-2">
                    <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
                  </div>
                  <div className="w-1/2 h-full bg-gradient-to-l from-[#4a152e] to-[#2b0c1b] border-l border-amber-300/60 flex flex-col justify-center items-start pl-2">
                    <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-amber-300 tracking-wider uppercase mb-2">
                  Puertas del Salón de la Fama
                </h3>
                <p className="text-xs font-semibold text-pink-200/80 mb-4">
                  Las puertas se abrirán oficialmente al terminar las votaciones.
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-xs font-black tracking-widest uppercase">
                  ✨ Próxima Gran Gala: {diasRestantes} Días
                </div>
              </div>
            </motion.div>

          </div>
        </>
      )}

      {/* ── MODAL INTERACTIVO DE VOTACIÓN CON 3 VOTOS & REPRODUCTOR DE CLIPS ── */}
      <AnimatePresence>
        {modalCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalCat(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10"
              style={{
                background: 'linear-gradient(160deg, #3d1226 0%, #1a0611 100%)',
                border: '2px solid rgba(253,230,138,0.5)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(255,133,161,0.25)',
              }}
            >
              <button
                onClick={() => setModalCat(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-amber-300" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{modalCat.emoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{modalCat.titulo}</h3>
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{modalCat.subtitulo}</p>
                </div>
              </div>

              {/* Indicador de votos 3/3 */}
              <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-xs font-bold text-pink-200">
                  Puedes seleccionar hasta <strong className="text-amber-300">3 candidatos</strong>:
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-xs font-black text-amber-300">
                  Votos: {(misVotos[modalCat.id] || []).length} / 3
                </span>
              </div>

              {/* Lista de Nominados */}
              <div className="space-y-4 mb-6">
                {modalCat.nominados.map((nom) => {
                  const misVotosCat = misVotos[modalCat.id] || [];
                  const selec = misVotosCat.includes(nom.id);
                  const clipSlug = getTwitchClipSlug(nom.clipUrl);

                  return (
                    <div
                      key={nom.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        selec
                          ? 'bg-gradient-to-r from-amber-400/25 to-pink-500/25 border-amber-300 shadow-[0_0_20px_rgba(253,230,138,0.3)]'
                          : 'bg-white/5 border-pink-500/20 hover:border-amber-300/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-black text-base text-white flex items-center gap-2">
                            {nom.nombre}
                            {selec && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                          </div>
                          {nom.creador && (
                            <span className="text-xs font-extrabold text-amber-300 block">
                              Creador: {nom.creador}
                            </span>
                          )}
                          <div className="text-xs text-pink-200/70 font-semibold mt-0.5">{nom.detalle}</div>
                        </div>

                        <button
                          onClick={() => toggleVoto(modalCat.id, nom.id)}
                          className={`px-4 py-2 rounded-xl font-black text-xs tracking-wider uppercase transition-all ${
                            selec
                              ? 'bg-emerald-500 text-white shadow-md'
                              : misVotosCat.length >= 3
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-300 to-pink-400 text-black hover:scale-105'
                          }`}
                        >
                          {selec ? '✓ Votado' : 'Votar'}
                        </button>
                      </div>

                      {/* Vista Previa de Clip de Twitch Embed si existe clipUrl */}
                      {nom.clipUrl && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                              <Play className="w-3 h-3" /> Vista previa del Clip:
                            </span>
                            <a
                              href={nom.clipUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-pink-300 hover:underline flex items-center gap-1"
                            >
                              Abrir en Twitch <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {clipSlug ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-300/30 bg-black">
                              <iframe
                                src={`https://clips.twitch.tv/embed?clip=${clipSlug}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=false`}
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                                title={`Twitch Clip ${nom.nombre}`}
                              />
                            </div>
                          ) : (
                            <a
                              href={nom.clipUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 underline"
                            >
                              ▶️ Ver Clip en Twitch
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setModalCat(null)}
                className="w-full py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase bg-gradient-to-r from-amber-300 to-pink-400 text-black shadow-lg hover:scale-105 transition-all"
              >
                Guardar Votos & Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
