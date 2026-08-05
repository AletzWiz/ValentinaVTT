import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Radio, Sparkles, ExternalLink, ChevronLeft, ChevronRight, X, Play, Clock, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface DiaHorarioConfig {
  id: string;
  diaIndex: number;
  diaNombre: string;
  horaMexico: string;
  tituloStream: string;
  vodUrl?: string;
  vodThumbnail?: string;
}

interface DiaCalculado extends DiaHorarioConfig {
  fechaTexto: string;
  esHoy: boolean;
  esPasado: boolean;
  esFuturo: boolean;
  tieneStream: boolean;
}

function formatearHoraUnicaLocal(horaMexicoStr: string): string {
  try {
    if (!horaMexicoStr || horaMexicoStr.trim() === '') return '';
    const parts = horaMexicoStr.split(':');
    const hh = parseInt(parts[0] || '20', 10);
    const mm = parseInt(parts[1] || '00', 10);

    const now = new Date();
    const fechaCDMX = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hh + 6, mm));

    return new Intl.DateTimeFormat([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(fechaCDMX);
  } catch {
    return horaMexicoStr;
  }
}

function obtenerDiasSemanaActual(diasConfig: DiaHorarioConfig[]): { dias: DiaCalculado[]; rangoSemana: string } {
  const ahora = new Date();
  const diaSemanaActual = ahora.getDay();
  const indexLunesActual = (diaSemanaActual === 0 ? 6 : diaSemanaActual - 1);

  const fechaLunes = new Date(ahora);
  fechaLunes.setDate(ahora.getDate() - indexLunesActual);
  fechaLunes.setHours(0, 0, 0, 0);

  const hoyCeroHoras = new Date(ahora);
  hoyCeroHoras.setHours(0, 0, 0, 0);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const diasResultado: DiaCalculado[] = (diasConfig || []).map((configDia) => {
    const fechaDia = new Date(fechaLunes);
    fechaDia.setDate(fechaLunes.getDate() + configDia.diaIndex);
    fechaDia.setHours(0, 0, 0, 0);

    const diaNum = String(fechaDia.getDate()).padStart(2, '0');
    const mesNom = meses[fechaDia.getMonth()];
    const fechaTexto = `${diaNum} ${mesNom}`;

    const esHoy = fechaDia.getTime() === hoyCeroHoras.getTime();
    const esPasado = fechaDia.getTime() < hoyCeroHoras.getTime();
    const esFuturo = fechaDia.getTime() > hoyCeroHoras.getTime();

    const tieneHora = Boolean(configDia.horaMexico && configDia.horaMexico.trim() !== '');
    const esDescanso = configDia.tituloStream.toLowerCase().includes('descanso');
    const tieneStream = tieneHora && !esDescanso;

    return {
      ...configDia,
      fechaTexto,
      esHoy,
      esPasado,
      esFuturo,
      tieneStream,
    };
  });

  const fechaDomingo = new Date(fechaLunes);
  fechaDomingo.setDate(fechaLunes.getDate() + 6);

  const rangoSemana = `${fechaLunes.getDate()} ${meses[fechaLunes.getMonth()]} - ${fechaDomingo.getDate()} ${meses[fechaDomingo.getMonth()]}`;

  return { dias: diasResultado, rangoSemana };
}

// 🔐 Contraseña secreta de admin: escribe "valentina" en cualquier parte de la web para activar modo admin
const ADMIN_SECRET = 'valentina';

export const KawaiiScheduleRuler = () => {
  const [diasCalculados, setDiasCalculados] = useState<DiaCalculado[]>([]);
  const [rangoSemana, setRangoSemana]       = useState('');
  const [openRuler, setOpenRuler]           = useState(true);
  const [isMobile, setIsMobile]             = useState(false);
  const [isRealTimeLive, setIsRealTimeLive] = useState(false);
  const [generatingImg, setGeneratingImg]   = useState(false);
  const [isAdmin, setIsAdmin]               = useState(false);

  const exportCanvasRef = useRef<HTMLDivElement>(null);
  const typedKeysRef = useRef('');

  useEffect(() => {
    // 🔐 Detección secreta de admin: teclear "valentina" en cualquier momento
    const handleKeyPress = (e: KeyboardEvent) => {
      typedKeysRef.current += e.key.toLowerCase();
      // Mantener solo los últimos 15 caracteres
      if (typedKeysRef.current.length > 15) {
        typedKeysRef.current = typedKeysRef.current.slice(-15);
      }
      if (typedKeysRef.current.includes(ADMIN_SECRET)) {
        setIsAdmin(true);
        typedKeysRef.current = '';
      }
    };

    // También permitir ?admin=valentina en la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'valentina') {
      setIsAdmin(true);
    }

    window.addEventListener('keydown', handleKeyPress);

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setOpenRuler(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    fetch('/horario_semanal.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => {
        const { dias, rangoSemana } = obtenerDiasSemanaActual(data.dias || []);
        setDiasCalculados(dias);
        setRangoSemana(rangoSemana);
      })
      .catch(err => console.error("Error al cargar horario_semanal.json:", err));

    const comprobarDirectoEnVivo = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/valentinavtt');
        if (res.ok) {
          const text = await res.text();
          if (text && !text.toLowerCase().includes('offline')) {
            setIsRealTimeLive(true);
          } else {
            setIsRealTimeLive(false);
          }
        }
      } catch {}
    };

    comprobarDirectoEnVivo();
    const intervalLive = setInterval(comprobarDirectoEnVivo, 60000);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', checkMobile);
      clearInterval(intervalLive);
    };
  }, []);

  // 📸 Función para generar la imagen HD lista para publicar en redes
  const descargarImagenRedes = async () => {
    if (!exportCanvasRef.current) return;
    try {
      setGeneratingImg(true);

      const canvas = await html2canvas(exportCanvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Horario_ValentinaVTT_${rangoSemana.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error("Error al generar la imagen:", err);
    } finally {
      setGeneratingImg(false);
    }
  };

  // Helper para obtener el badge de estado en la imagen exportada
  const getBadgeExport = (d: DiaCalculado) => {
    const realmenteEnVivo = isRealTimeLive && d.esHoy;
    if (realmenteEnVivo) return { text: '🔴 EN VIVO', color: '#DC2626', textColor: '#FFFFFF' };
    if (d.esHoy && d.tieneStream) return { text: '✨ STREAM HOY', color: '#EC4899', textColor: '#FFFFFF' };
    if (d.esFuturo && d.tieneStream) return { text: '📅 PROGRAMADO', color: '#F3E8FF', textColor: '#7C3AED' };
    return { text: 'OFFLINE', color: '#E5E7EB', textColor: '#6B7280' };
  };

  return (
    <>
      {/* ── BOTÓN FLOTANTE EN TELÉFONO ── */}
      {isMobile && !openRuler && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setOpenRuler(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-black text-xs px-5 py-3.5 rounded-full shadow-[0_8px_30px_rgba(255,133,161,0.6)] flex items-center gap-2 border-2 border-white text-center hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>📅 ¿Quieres ver mi horario? ¡Pica aquí! 🌸</span>
        </motion.button>
      )}

      {/* ── PESTAÑA LATERAL DE APERTURA EN PC ── */}
      {!isMobile && !openRuler && (
        <motion.button
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setOpenRuler(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 text-white font-black text-xs px-3 py-4 rounded-r-2xl shadow-xl flex flex-col items-center gap-2 border-y-2 border-r-2 border-white hover:scale-105 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* ── REGLA COMPLETA VERTICAL LATERAL ── */}
      <AnimatePresence>
        {openRuler && (
          <motion.aside
            initial={{ x: -380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={`fixed top-0 bottom-0 left-0 h-screen z-50 flex ${
              isMobile ? 'w-full max-w-xs' : 'w-80'
            }`}
          >
            <div
              className="relative w-full h-full flex flex-col shadow-[10px_0_30px_rgba(255,133,161,0.25)] border-r-4 border-pink-300/60 overflow-hidden backdrop-blur-xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,240,247,0.98) 0%, rgba(245,238,255,0.98) 50%, rgba(234,244,255,0.98) 100%)',
              }}
            >
              {/* Palitos de regla vertical */}
              <div className="absolute top-0 bottom-0 left-0 w-3 flex flex-col justify-between pointer-events-none opacity-40 z-10 py-2">
                {Array.from({ length: 45 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-pink-500 rounded-r-full ${i % 5 === 0 ? 'w-3 h-0.5 opacity-90' : 'w-1.5 h-0.5 opacity-50'}`}
                  />
                ))}
              </div>

              {/* HEADER */}
              <div className="p-4 pt-6 border-b-2 border-pink-300/40 relative z-20 flex items-center justify-between pl-6">
                <div>
                  <h3 className="font-black text-base text-pink-600 tracking-wider uppercase leading-none">
                    Horario Semanal
                  </h3>
                  <p className="text-[11px] font-extrabold text-purple-600 uppercase tracking-widest mt-1">
                    {rangoSemana || 'Esta Semana'}
                  </p>
                </div>
                <button
                  onClick={() => setOpenRuler(false)}
                  className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 flex items-center justify-center font-bold transition-colors"
                  title="Cerrar horario"
                >
                  {isMobile ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* LISTA DE DÍAS */}
              <div className="flex-1 overflow-y-auto p-4 pl-6 space-y-3 relative z-20">
                {diasCalculados.map((d) => {
                  const realmenteEnVivo = isRealTimeLive && d.esHoy;
                  const horaLocal = formatearHoraUnicaLocal(d.horaMexico);

                  return (
                    <div
                      key={d.id}
                      className={`relative p-3.5 rounded-2xl border transition-all duration-300 ${
                        realmenteEnVivo
                          ? 'bg-gradient-to-r from-red-500/20 via-pink-400/25 to-amber-300/25 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                          : d.esHoy && d.tieneStream
                          ? 'bg-white border-pink-500 shadow-md ring-2 ring-pink-300/60'
                          : d.esFuturo && d.tieneStream
                          ? 'bg-gradient-to-r from-purple-50/90 to-pink-50/90 border-purple-300 shadow-sm hover:border-pink-400'
                          : d.esPasado && d.vodUrl
                          ? 'bg-white/90 border-pink-300 shadow-sm'
                          : 'bg-gray-100/60 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-gray-800 uppercase tracking-wider">
                            {d.diaNombre}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            d.esHoy ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-100 text-pink-600'
                          }`}>
                            {d.fechaTexto}
                          </span>
                        </div>

                        {realmenteEnVivo ? (
                          <a href="https://www.twitch.tv/valentinavtt" target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-md hover:scale-105 transition-all">
                            <Radio className="w-3 h-3 text-white animate-spin" /> EN VIVO AHORA
                          </a>
                        ) : d.esHoy && d.tieneStream ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> STREAM HOY
                          </span>
                        ) : d.esFuturo && d.tieneStream ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-700 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 text-purple-500" /> PROGRAMADO
                          </span>
                        ) : d.esPasado && d.vodUrl ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-300 text-pink-700 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 text-pink-500" /> VOD DISPONIBLE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-300 text-gray-600 font-extrabold text-[9px] uppercase tracking-wider">
                            OFFLINE
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-gray-800 truncate mb-1">{d.tituloStream}</div>

                      {d.tieneStream && horaLocal && (
                        <div className="text-[10px] font-black text-purple-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-pink-500" />
                          <span>Horario: {horaLocal}</span>
                        </div>
                      )}

                      {d.vodUrl && (
                        <div className="mt-2.5 pt-2 border-t border-pink-200/60">
                          <a href={d.vodUrl} target="_blank" rel="noreferrer"
                            className="group block relative rounded-xl overflow-hidden border border-purple-300 shadow-sm">
                            {d.vodThumbnail ? (
                              <img src={d.vodThumbnail} alt={`VOD ${d.diaNombre}`}
                                className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-16 bg-purple-900/80 flex items-center justify-center text-pink-200 text-xs font-bold">
                                ▶ Ver Resumen / VOD
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                              <span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </span>
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t-2 border-pink-300/40 relative z-20 pl-6 bg-white/40 space-y-2">
                {/* 🔐 BOTÓN DE DESCARGA: Solo visible cuando el admin activa el modo secreto */}
                {isAdmin && (
                  <motion.button
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    onClick={descargarImagenRedes}
                    disabled={generatingImg}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 border-2 border-white/40"
                  >
                    <Download className={`w-4 h-4 ${generatingImg ? 'animate-spin' : ''}`} />
                    {generatingImg ? 'Generando...' : '📸 Descargar para Redes (Admin)'}
                  </motion.button>
                )}

                <a
                  href="https://www.twitch.tv/valentinavtt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
                >
                  Ir a Twitch.tv/ValentinaVTT <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 📸 CANVAS OCULTO HD (1080x1920) PARA EXPORTAR IMAGEN PARA REDES           */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', top: '-99999px', left: '-99999px', pointerEvents: 'none', opacity: 0, overflow: 'hidden' }}>
        <div
          ref={exportCanvasRef}
          style={{
            width: '1080px',
            height: '1920px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          {/* FONDO COMPLETO CON GRADIENTE BONITO */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(170deg, #FFF0F7 0%, #F8E8FF 25%, #EDE9FE 45%, #DBEAFE 65%, #FDE8F0 85%, #FFF5F7 100%)',
          }} />

          {/* Decoraciones sutiles de fondo */}
          <div style={{
            position: 'absolute', top: '60px', right: '60px',
            width: '120px', height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '120px', left: '50px',
            width: '160px', height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '400px', right: '40px',
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%)',
          }} />

          {/* Barra lateral de regla decorativa */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: '28px',
            background: 'linear-gradient(180deg, #F9A8D4 0%, #C084FC 50%, #93C5FD 100%)',
            opacity: 0.35,
          }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: `${(i / 35) * 100}%`,
                left: 0,
                width: i % 5 === 0 ? '28px' : '14px',
                height: i % 5 === 0 ? '3px' : '2px',
                background: '#EC4899',
                opacity: i % 5 === 0 ? 0.6 : 0.3,
                borderRadius: '0 4px 4px 0',
              }} />
            ))}
          </div>

          {/* ─── CONTENIDO PRINCIPAL ─── */}
          <div style={{
            position: 'relative', zIndex: 10,
            padding: '60px 50px 50px 70px',
            display: 'flex', flexDirection: 'column',
            height: '100%',
          }}>

            {/* 1. HEADER: Redes Sociales */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '24px',
              marginBottom: '28px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.75)',
                padding: '12px 28px', borderRadius: '50px',
                border: '2px solid #F9A8D4',
                fontSize: '22px', fontWeight: 800, color: '#DB2777',
                boxShadow: '0 2px 10px rgba(236,72,153,0.15)',
              }}>
                <span style={{ fontSize: '24px' }}>📷</span> @ValentinaVTT
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.75)',
                padding: '12px 28px', borderRadius: '50px',
                border: '2px solid #C4B5FD',
                fontSize: '22px', fontWeight: 800, color: '#7C3AED',
                boxShadow: '0 2px 10px rgba(139,92,246,0.15)',
              }}>
                <span style={{ fontSize: '24px' }}>📺</span> @ValentinaVTT
              </div>
            </div>

            {/* 2. TÍTULO */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '64px', fontWeight: 900, color: '#DB2777',
                letterSpacing: '6px', textTransform: 'uppercase',
                margin: '0 0 12px 0', lineHeight: 1.1,
                textShadow: '0 2px 8px rgba(219,39,119,0.15)',
              }}>
                HORARIO SEMANAL
              </h1>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                color: '#FFFFFF',
                padding: '10px 40px', borderRadius: '50px',
                fontSize: '26px', fontWeight: 900, letterSpacing: '4px',
                boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
              }}>
                {rangoSemana}
              </div>
            </div>

            {/* 3. TARJETAS DIARIAS - Perfectamente distribuidas */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              gap: '14px', justifyContent: 'center',
            }}>
              {diasCalculados.map((d) => {
                const badge = getBadgeExport(d);
                const horaLocal = formatearHoraUnicaLocal(d.horaMexico);
                const isActive = d.tieneStream || (isRealTimeLive && d.esHoy);

                return (
                  <div key={d.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
                    borderRadius: '24px',
                    padding: '22px 28px',
                    border: `2.5px solid ${
                      (isRealTimeLive && d.esHoy) ? '#EF4444'
                      : (d.esHoy && d.tieneStream) ? '#EC4899'
                      : (d.tieneStream) ? '#C4B5FD'
                      : '#F3E8FF'
                    }`,
                    boxShadow: isActive
                      ? '0 4px 20px rgba(236,72,153,0.12)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    opacity: isActive ? 1 : 0.72,
                  }}>
                    {/* Info lado izquierdo */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '26px', fontWeight: 900, color: '#1F2937',
                          textTransform: 'uppercase', letterSpacing: '2px',
                        }}>
                          {d.diaNombre}
                        </span>
                        <span style={{
                          fontSize: '16px', fontWeight: 800,
                          background: d.esHoy ? '#EC4899' : '#FCE7F3',
                          color: d.esHoy ? '#FFFFFF' : '#DB2777',
                          padding: '4px 16px', borderRadius: '50px',
                        }}>
                          {d.fechaTexto}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '20px', fontWeight: 700, color: '#374151',
                        marginBottom: d.tieneStream && horaLocal ? '4px' : '0',
                      }}>
                        {d.tituloStream}
                      </div>
                      {d.tieneStream && horaLocal && (
                        <div style={{
                          fontSize: '16px', fontWeight: 800, color: '#7C3AED',
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          🕐 {horaLocal}
                        </div>
                      )}
                    </div>

                    {/* Badge de estado */}
                    <div style={{
                      padding: '10px 24px', borderRadius: '50px',
                      background: badge.color, color: badge.textColor,
                      fontSize: '15px', fontWeight: 900,
                      textTransform: 'uppercase', letterSpacing: '1.5px',
                      whiteSpace: 'nowrap',
                      border: badge.color === '#E5E7EB' ? 'none' : `2px solid ${badge.color === '#F3E8FF' ? '#C4B5FD' : 'transparent'}`,
                      boxShadow: badge.color === '#EC4899' || badge.color === '#DC2626'
                        ? '0 3px 12px rgba(236,72,153,0.3)' : 'none',
                    }}>
                      {badge.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. FOOTER */}
            <div style={{
              textAlign: 'center', marginTop: '28px',
              paddingTop: '20px',
              borderTop: '2px solid rgba(236,72,153,0.2)',
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)',
                color: '#FFFFFF',
                padding: '16px 50px', borderRadius: '50px',
                fontSize: '26px', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '3px',
                boxShadow: '0 6px 25px rgba(139,92,246,0.3)',
              }}>
                ✨ twitch.tv/valentinavtt ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
