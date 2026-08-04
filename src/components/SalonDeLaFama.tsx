import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Check, Sparkles, X, Play, LogIn, LogOut, Lock, AlertTriangle, ExternalLink, Settings } from 'lucide-react';

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
  const [categorias, setCategorias]       = useState<CategoriaGala[]>([]);
  const [temporada, setTemporada]         = useState(1);
  const [diasRestantes, setDias]         = useState(30);
  const [votacionesAbiertas, setAbiertas] = useState(false);
  const [discordClientId, setClientId]    = useState('');
  const [loading, setLoading]             = useState(true);

  const [misVotos, setMisVotos]           = useState<Record<string, string[]>>({});
  const [votosServer, setVotosServer]     = useState<Record<string, number>>({});
  const [modalCat, setModalCat]           = useState<CategoriaGala | null>(null);
  const [discordUser, setDiscordUser]     = useState<DiscordUser | null>(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [showSetupModal, setShowSetupModal]   = useState(false);
  const [errorMsg, setErrorMsg]           = useState<string | null>(null);

  // 1. Manejar OAuth2 Redirect Hash Oficial de Discord (#access_token=...)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      if (token) {
        fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.id && data.username) {
              const avatarUrl = data.avatar
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator || '0') % 5}.png`;

              const userObj: DiscordUser = {
                id: `discord_real_${data.id}`,
                username: `@${data.global_name || data.username}`,
                avatar: avatarUrl
              };
              setDiscordUser(userObj);
              localStorage.setItem('vtt_discord_user', JSON.stringify(userObj));
              window.history.replaceState(null, '', window.location.pathname);
            }
          })
          .catch(err => console.error("Error OAuth Discord:", err));
      }
    }
  }, []);

  // 2. Cargar configuración editable y votos del servidor
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);

        const resGala = await fetch('/gala_config.json?v=' + Date.now());
        if (resGala.ok) {
          const dataGala = await resGala.json();
          setCategorias(dataGala.categorias || []);
          setTemporada(dataGala.temporada || 1);
          setDias(dataGala.diasRestantesGala || 30);
          setAbiertas(dataGala.votacionesAbiertas ?? false);
          setClientId(dataGala.discordClientId || '');
        }

        try {
          const resVotes = await fetch('/api/votes?v=' + Date.now());
          if (resVotes.ok) {
            const dataVotes = await resVotes.json();
            if (dataVotes.votosGlobales) setVotosServer(dataVotes.votosGlobales);
          }
        } catch {}

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

  // Iniciar flujo de autorización de Discord usando la URL exacta del navegador
  const conectarDiscord = () => {
    const cid = discordClientId ? discordClientId.trim() : '';

    if (cid && cid !== "") {
      const currentUri = window.location.origin + window.location.pathname;
      const redirectUri = encodeURIComponent(currentUri.replace(/\/$/, ''));
      const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${cid}&redirect_uri=${redirectUri}&response_type=token&scope=identify`;
      window.location.href = oauthUrl;
    } else {
      setShowSetupModal(true);
    }
  };

  const desconectarDiscord = () => {
    setDiscordUser(null);
    localStorage.removeItem('vtt_discord_user');
  };

  const abrirModalVotacion = (cat: CategoriaGala) => {
    if (!discordUser) {
      setShowAuthWarning(true);
      return;
    }
    setModalCat(cat);
  };

  const toggleVoto = async (catId: string, nomId: string) => {
    if (!discordUser) {
      setShowAuthWarning(true);
      return;
    }

    setErrorMsg(null);
    const votosCat = misVotos[catId] || [];
    const estaVotado = votosCat.includes(nomId);
    const action = estaVotado ? 'remove' : 'add';

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discordUserId: discordUser.id,
          categoryId: catId,
          nomineeId: nomId,
          action
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "No se pudo registrar el voto en el servidor.");
        return;
      }

      if (data.votosGlobales) setVotosServer(data.votosGlobales);

      let nuevosVotosCat: string[];
      if (estaVotado) {
        nuevosVotosCat = votosCat.filter(id => id !== nomId);
      } else {
        nuevosVotosCat = [...votosCat, nomId];
      }

      const nuevoMapa = { ...misVotos, [catId]: nuevosVotosCat };
      setMisVotos(nuevoMapa);
      localStorage.setItem('vtt_votos_multi', JSON.stringify(nuevoMapa));

    } catch (err) {
      let nuevosVotosCat: string[];
      if (estaVotado) {
        nuevosVotosCat = votosCat.filter(id => id !== nomId);
      } else {
        if (votosCat.length >= 3) return;
        nuevosVotosCat = [...votosCat, nomId];
      }

      const nuevoMapa = { ...misVotos, [catId]: nuevosVotosCat };
      setMisVotos(nuevoMapa);
      localStorage.setItem('vtt_votos_multi', JSON.stringify(nuevoMapa));
    }
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

      {/* ── BARRA SUPERIOR DE DISCORD ── */}
      <div className="relative z-30 max-w-5xl mx-auto flex items-center justify-between gap-4 mb-10 pb-4 border-b border-pink-500/20">
        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-pink-400 text-black text-xs font-black tracking-widest uppercase shadow-lg">
            🏆 Gala & Nominaciones
          </span>
        </div>

        {/* Discord Auth Box */}
        <div className="flex items-center gap-3">
          {discordUser ? (
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 shadow-md">
              <img src={discordUser.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-extrabold text-emerald-300">
                {discordUser.username}
              </span>
              <button
                onClick={desconectarDiscord}
                title="Desconectar cuenta"
                className="text-pink-300 hover:text-red-400 ml-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={conectarDiscord}
              className="btn-kawaii bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-2 shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              Conectar Discord para Votar
            </button>
          )}
        </div>
      </div>

      {/* ── HEADER PRINCIPAL DE LA GALA ── */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 via-pink-500/15 to-amber-400/15 border border-amber-300/40 text-amber-300 text-[11px] sm:text-xs font-black tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(253,230,138,0.2)]">
          <Trophy className="w-3.5 h-3.5 text-amber-300" /> GALA VTT (TEMPORADA {temporada})
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

      {/* ========================================================= */}
      {/* CARTELÓN DE CONSTRUCCIÓN AMARILLO CON NEGRO (VOTACIONES CERRADAS) */}
      {/* ========================================================= */}
      {!votacionesAbiertas && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-30 max-w-2xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(250,204,21,0.3)] border-4 border-yellow-400 bg-black text-yellow-300"
        >
          <div
            className="h-10 w-full"
            style={{
              background: 'repeating-linear-gradient(-45deg, #facc15, #facc15 20px, #000 20px, #000 40px)',
            }}
          />

          <div className="p-6 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shadow-lg animate-bounce">
              <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="inline-block px-4 py-1 rounded-full bg-yellow-400 text-black font-black text-xs tracking-widest uppercase mb-3">
              🚧 ZONA DE VOTACIÓN EN CONSTRUCCIÓN 🚧
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 tracking-wide">
              Aún no se puede votar, espera a que se abran las votaciones oficialmente
            </h2>

            <p className="text-xs sm:text-sm text-yellow-200/80 font-bold max-w-md mx-auto leading-relaxed">
              Las votaciones abrirán en el momento oficial fijado por ValentinaVTT. Prepara tus favoritos para la gran gala 🌸
            </p>
          </div>

          <div
            className="h-10 w-full"
            style={{
              background: 'repeating-linear-gradient(-45deg, #facc15, #facc15 20px, #000 20px, #000 40px)',
            }}
          />
        </motion.div>
      )}

      {/* ── PASEO DE LA ALFOMBRA ROJA ── */}
      <div className="relative max-w-5xl mx-auto z-10">

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

                  <div
                    className="relative rounded-3xl p-5 sm:p-7 overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl"
                    style={{
                      background: 'linear-gradient(145deg, rgba(65,18,40,0.92) 0%, rgba(28,8,18,0.96) 100%)',
                      border: '2px solid rgba(253,230,138,0.35)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(255,133,161,0.15)',
                    }}
                  >
                    <CornerBrackets color="border-amber-300/70" />

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-500/25 to-amber-400/25 border border-amber-300/40 flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                        {cat.emoji}
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase border truncate ${
                        tieneVotos
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-amber-400/15 text-amber-300 border-amber-300/40'
                      }`}>
                        {!votacionesAbiertas
                          ? '🔒 VOTACIONES CERRADAS'
                          : votosCat.length > 0
                          ? `✓ Votos: ${votosCat.length}/3`
                          : '✨ 3 Votos'}
                      </span>
                    </div>

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
                      onClick={() => {
                        if (!votacionesAbiertas) return;
                        abrirModalVotacion(cat);
                      }}
                      disabled={!votacionesAbiertas}
                      className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-xs tracking-widest uppercase transition-all duration-300 ${
                        !votacionesAbiertas
                          ? 'bg-gray-700/60 text-gray-400 border border-gray-600/40 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-300 via-pink-400 to-amber-400 text-black shadow-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(253,230,138,0.6)]'
                      }`}
                    >
                      {!votacionesAbiertas ? (
                        <>
                          <Lock className="w-4 h-4" /> Votaciones Cerradas
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          {tieneVotos ? `Votar / Modificar (${votosCat.length}/3)` : 'Votar / Ver Nominados'}
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

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

      {/* ── MODAL DE CONFIGURACIÓN / INSTRUCCIONES DISCORD CLIENT ID ── */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSetupModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative max-w-lg w-full rounded-3xl p-6 sm:p-8 text-center bg-[#2b0a19] border-2 border-amber-300 text-white z-10 shadow-2xl"
            >
              <button
                onClick={() => setShowSetupModal(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-amber-300" />
              </button>

              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-black text-amber-300 mb-2">Configurar tu Aplicación de Discord</h3>
              <p className="text-xs text-pink-200/90 font-semibold mb-4 leading-relaxed">
                Para autorizar la aplicación en Discord sin el mensaje de "redirect_uri no válido", debes agregar la URL exacta en tu panel de Discord:
              </p>

              <ol className="text-left text-xs space-y-2 mb-6 p-4 rounded-2xl bg-black/50 border border-amber-300/30 text-amber-100 font-semibold">
                <li>1. Entra a <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-pink-300 underline font-bold">discord.com/developers/applications</a></li>
                <li>2. Selecciona tu aplicación <strong>ValentinaVTT</strong> y entra a <strong>OAuth2 -&gt; Redirects</strong>.</li>
                <li>3. Haz clic en <strong>"Add Redirect"</strong> y agrega exactamente estas URLs: <br />
                  <code className="text-pink-300 bg-white/10 px-1.5 py-0.5 rounded block mt-1">https://www.valentinavtt.com/salon-de-la-fama</code>
                  <code className="text-pink-300 bg-white/10 px-1.5 py-0.5 rounded block mt-1">https://valentina-vtt.vercel.app/salon-de-la-fama</code>
                </li>
                <li>4. Guarda los cambios presionando el botón azul <strong>"Save Changes"</strong> abajo.</li>
              </ol>

              <button
                onClick={() => setShowSetupModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-400 text-black font-black text-xs uppercase tracking-widest shadow-lg"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL AVISO AUTENTICACIÓN DISCORD OBLIGATORIA ── */}
      <AnimatePresence>
        {showAuthWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthWarning(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative max-w-md w-full rounded-3xl p-6 text-center bg-[#2b0a19] border-2 border-amber-300 text-white z-10 shadow-2xl"
            >
              <button
                onClick={() => setShowAuthWarning(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-amber-300" />
              </button>

              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-black text-amber-300 mb-2">Conexión Oficial con Discord Obligatoria</h3>
              <p className="text-xs text-pink-200/80 font-bold mb-6 leading-relaxed">
                Para garantizar votaciones limpias y únicas, es obligatorio conectar tu cuenta oficial de Discord antes de abrir las nominaciones y votar.
              </p>

              <button
                onClick={conectarDiscord}
                className="w-full py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] font-black text-xs tracking-widest uppercase text-white shadow-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Conectar con Discord Oficial
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL INTERACTIVO DE VOTACIÓN ── */}
      <AnimatePresence>
        {modalCat && votacionesAbiertas && (
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

              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-xs font-bold text-pink-200">
                  Puedes seleccionar hasta <strong className="text-amber-300">3 candidatos</strong>:
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-xs font-black text-amber-300">
                  Votos: {(misVotos[modalCat.id] || []).length} / 3
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {modalCat.nominados.map((nom) => {
                  const misVotosCat = misVotos[modalCat.id] || [];
                  const selec = misVotosCat.includes(nom.id);
                  const clipSlug = getTwitchClipSlug(nom.clipUrl);
                  const totalVotosGlobales = (nom.votos || 0) + (votosServer[nom.id] || 0);

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
                          <span className="text-[10px] font-black text-amber-300/90 mt-1 block">
                            📊 Total Votos: {totalVotosGlobales}
                          </span>
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
