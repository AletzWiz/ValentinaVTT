import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Radio, Sparkles, ExternalLink, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface DiaHorario {
  id: string;
  diaNombre: string;
  fecha: string;
  estado: 'offline' | 'en_vivo' | 'stream_hoy';
  horaMexico: string;
  tituloStream: string;
}

interface ConfigHorario {
  tituloSemana: string;
  subtituloSemana: string;
  dias: DiaHorario[];
}

// Convertir hora de México (CDMX UTC-6) a la zona horaria local del espectador
function obtenerHoraLocal(horaMexicoStr: string): string {
  try {
    if (!horaMexicoStr || horaMexicoStr.toLowerCase() === 'offline') return '';
    const parts = horaMexicoStr.split(':');
    const hh = parseInt(parts[0] || '20', 10);
    const mm = parseInt(parts[1] || '00', 10);

    const now = new Date();
    // CDMX es UTC-6 (o UTC-5 en verano si aplica)
    const fechaCDMX = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hh + 6, mm));

    const formateador = new Intl.DateTimeFormat([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return formateador.format(fechaCDMX);
  } catch {
    return `${horaMexicoStr} CDMX`;
  }
}

export const KawaiiScheduleRuler = () => {
  const [config, setConfig] = useState<ConfigHorario | null>(null);
  const [openRuler, setOpenRuler] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userTz, setUserTz] = useState('');

  useEffect(() => {
    // Detectar pantalla pequeña y zona horaria
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTz(tzName.replace('_', ' '));
    } catch {}

    // Cargar horario_semanal.json
    fetch('/horario_semanal.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Error al cargar horario_semanal.json:", err));

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!config) return null;

  return (
    <>
      {/* ── BOTÓN FLOTANTE LATERAL PARA PANTALLAS O CUANDO ESTÁ PLEGADO ── */}
      {!openRuler && (
        <motion.button
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setOpenRuler(true)}
          className="fixed left-0 top-1/3 z-40 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 text-white font-black text-xs px-3.5 py-3 rounded-r-2xl shadow-[0_4px_25px_rgba(255,133,161,0.5)] flex items-center gap-2 border-y-2 border-r-2 border-white/60 hover:scale-105 transition-all group"
        >
          <Calendar className="w-4 h-4 animate-bounce" />
          <span className="writing-vertical hidden sm:inline tracking-wider uppercase text-[10px]">
            📏 Horario VTT
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}

      {/* ── REGLA DE 60CM KAWAII FLOTANTE IZQUIERDA ── */}
      <AnimatePresence>
        {openRuler && (
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed left-2 top-20 z-40 ${
              isMobile ? 'w-[92vw] max-w-sm left-1/2 -translate-x-1/2 top-16' : 'w-80'
            }`}
          >
            <div
              className="relative rounded-3xl p-5 shadow-[0_15px_40px_rgba(255,133,161,0.35)] border-4 border-white/80 overflow-hidden backdrop-blur-xl"
              style={{
                background: 'linear-gradient(165deg, rgba(255,240,245,0.96) 0%, rgba(245,238,255,0.96) 50%, rgba(234,244,255,0.96) 100%)',
              }}
            >
              {/* Botón Plegar / Cerrar */}
              <button
                onClick={() => setOpenRuler(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 flex items-center justify-center font-bold transition-colors z-20"
                title="Cerrar regla"
              >
                {isMobile ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Marca de Regla Kawaii 60 CM Superior */}
              <div className="flex items-center justify-between border-b-2 border-pink-300/40 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📏</span>
                  <div>
                    <h3 className="font-black text-sm text-pink-600 tracking-wide leading-none">
                      {config.tituloSemana}
                    </h3>
                    <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-widest">
                      {config.subtituloSemana}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-black text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  60 CM
                </span>
              </div>

              {/* Marcas de Regla de Centímetros (Líneas Kawaii) */}
              <div className="flex justify-between items-end h-3 px-1 mb-3 opacity-60">
                {[0, 10, 20, 30, 40, 50, 60].map((cm) => (
                  <div key={cm} className="flex flex-col items-center">
                    <div className="w-0.5 h-2 bg-pink-400" />
                    <span className="text-[8px] font-bold text-pink-400 leading-none">{cm}</span>
                  </div>
                ))}
              </div>

              {/* Nota de Zona Horaria Autodetectada */}
              {userTz && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-700 text-[10px] font-extrabold mb-3">
                  <Clock className="w-3 h-3 text-purple-500 shrink-0" />
                  <span className="truncate">Horarios adaptados a tu hora local ({userTz})</span>
                </div>
              )}

              {/* LISTA DE 7 DÍAS DE LA SEMANA */}
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {config.dias.map((d) => {
                  const isEnVivo = d.estado === 'en_vivo';
                  const isStreamHoy = d.estado === 'stream_hoy';
                  const isOffline = d.estado === 'offline';
                  const horaLocal = obtenerHoraLocal(d.horaMexico);

                  return (
                    <div
                      key={d.id}
                      className={`relative p-3 rounded-2xl border transition-all duration-300 ${
                        isEnVivo
                          ? 'bg-gradient-to-r from-red-500/15 via-pink-400/20 to-amber-300/20 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                          : isStreamHoy
                          ? 'bg-white/80 border-purple-300/60 shadow-sm hover:border-pink-400'
                          : 'bg-gray-100/60 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-gray-800 uppercase tracking-wider">
                            {d.diaNombre}
                          </span>
                          <span className="text-[10px] font-extrabold text-pink-500 bg-pink-100 px-2 py-0.5 rounded-full">
                            {d.fecha}
                          </span>
                        </div>

                        {/* BADGES SEGÚN ESTADO */}
                        {isEnVivo ? (
                          <a
                            href="https://www.twitch.tv/valentinavtt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-md hover:scale-105 transition-all animate-bounce"
                          >
                            <Radio className="w-3 h-3 text-white" /> EN VIVO AHORA
                          </a>
                        ) : isStreamHoy ? (
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> STREAM HOY
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-300 text-gray-600 font-bold text-[9px] uppercase tracking-wider">
                            OFFLINE
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-gray-700 truncate">
                        {d.tituloStream}
                      </div>

                      {!isOffline && (
                        <div className="mt-1 text-[10px] font-black text-purple-600 flex items-center justify-between border-t border-pink-200/50 pt-1">
                          <span>🇲🇽 MX: {d.horaMexico} HRS</span>
                          <span className="text-pink-600">📍 Tu hora: {horaLocal}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón ver directo completo */}
              <a
                href="https://www.twitch.tv/valentinavtt"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
              >
                Ir a Twitch.tv/ValentinaVTT <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
