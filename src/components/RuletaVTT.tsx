import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Wheel } from "react-custom-roulette";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dices,
  Plus,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const SEGMENT_COLORS = [
  { bg: "#5b21b6", text: "#ffffff" },
  { bg: "#7c3aed", text: "#ffffff" },
  { bg: "#a855f7", text: "#ffffff" },
  { bg: "#c026d3", text: "#ffffff" },
  { bg: "#6d28d9", text: "#ffffff" },
  { bg: "#8b5cf6", text: "#ffffff" },
  { bg: "#4c1d95", text: "#ffffff" },
  { bg: "#9333ea", text: "#ffffff" },
];

const getColor = (index: number) => SEGMENT_COLORS[index % SEGMENT_COLORS.length];

/** Muestreo criptográfico por rechazo para evitar el sesgo de usar módulo directo. */
function secureRandomIndex(length: number): number {
  if (!Number.isInteger(length) || length < 1) return 0;

  const range = 0x1_0000_0000;
  const limit = range - (range % length);
  const randomValue = new Uint32Array(1);

  do {
    crypto.getRandomValues(randomValue);
  } while (randomValue[0] >= limit);

  return randomValue[0] % length;
}

interface Participante {
  option: string;
  style: { backgroundColor: string; textColor: string };
}

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const buildParticipants = (names: string[]): Participante[] =>
  names.map((option, index) => ({
    option,
    style: {
      backgroundColor: getColor(index).bg,
      textColor: getColor(index).text,
    },
  }));

export const RuletaVTT = () => {
  const reduceMotion = useReducedMotion();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [ganador, setGanador] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>(
    buildParticipants(["Saludito", "VIP", "Zing"]),
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const spinSoundRef = useRef<number | null>(null);
  const celebrationRef = useRef<number | null>(null);
  const spinningRef = useRef(false);

  const playTone = useCallback(
    (frequency: number, duration: number, volume = 0.035, delay = 0) => {
      if (!soundEnabled || typeof window === "undefined") return;

      const AudioContextClass =
        window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!AudioContextClass) return;

      let context = audioContextRef.current;
      if (!context) {
        context = new AudioContextClass();
        audioContextRef.current = context;
      }

      if (context.state === "suspended") void context.resume();

      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    },
    [soundEnabled],
  );

  const stopSpinSound = useCallback(() => {
    if (spinSoundRef.current !== null) {
      window.clearInterval(spinSoundRef.current);
      spinSoundRef.current = null;
    }
  }, []);

  const startSpinSound = useCallback(() => {
    stopSpinSound();
    let step = 0;
    playTone(190, 0.07, 0.025);
    spinSoundRef.current = window.setInterval(() => {
      const frequency = 185 + Math.min(step, 18) * 8;
      playTone(frequency, 0.055, 0.022);
      step += 1;
    }, 145);
  }, [playTone, stopSpinSound]);

  useEffect(() => {
    if (!soundEnabled) stopSpinSound();
  }, [soundEnabled, stopSpinSound]);

  useEffect(
    () => () => {
      stopSpinSound();
      if (celebrationRef.current !== null) window.clearTimeout(celebrationRef.current);
      if (audioContextRef.current) void audioContextRef.current.close();
    },
    [stopSpinSound],
  );

  const agregarNombre = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mustSpin) return;

    const nombre = nuevoNombre.trim();
    if (!nombre) return;

    setParticipantes((current) =>
      buildParticipants([...current.map(({ option }) => option), nombre]),
    );
    setNuevoNombre("");
    setGanador(null);
  };

  const eliminarNombre = (index: number) => {
    if (mustSpin) return;
    setParticipantes((current) =>
      buildParticipants(current.filter((_, itemIndex) => itemIndex !== index).map(({ option }) => option)),
    );
    setPrizeNumber(0);
    setGanador(null);
  };

  const limpiarRuleta = () => {
    if (mustSpin) return;
    setParticipantes([]);
    setPrizeNumber(0);
    setGanador(null);
  };

  const girarRuleta = () => {
    if (mustSpin || spinningRef.current || participantes.length < 2) return;

    spinningRef.current = true;
    setGanador(null);
    setCelebrating(false);
    setPrizeNumber(secureRandomIndex(participantes.length));
    startSpinSound();
    setMustSpin(true);
  };

  const onStopSpinning = () => {
    stopSpinSound();
    spinningRef.current = false;
    setMustSpin(false);
    setGanador(participantes[prizeNumber]?.option ?? null);
    setCelebrating(true);
    playTone(440, 0.16, 0.045);
    playTone(554, 0.18, 0.04, 0.12);
    playTone(659, 0.3, 0.04, 0.25);

    if (celebrationRef.current !== null) window.clearTimeout(celebrationRef.current);
    celebrationRef.current = window.setTimeout(() => {
      setCelebrating(false);
      celebrationRef.current = null;
    }, 2600);
  };

  const reveal = reduceMotion ? undefined : { opacity: 0, y: 24 };

  return (
    <main className="roulette-page">
      <motion.div
        className="roulette-shell"
        initial={reveal}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="roulette-heading">
          <div>
            <p className="section-kicker">Herramienta de stream</p>
            <h1>Ruleta<span>VTT</span></h1>
            <p>Agrega las opciones y deja que la ruleta elija.</p>
          </div>

          <div className="roulette-toolbar" aria-label="Estado de la ruleta">
            <div className="roulette-status-pill">
              <Users aria-hidden="true" />
              <span>Opciones</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.strong
                  key={participantes.length}
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                >
                  {participantes.length}
                </motion.strong>
              </AnimatePresence>
            </div>
            <div className="roulette-status-pill roulette-status-pill--secure">
              <ShieldCheck aria-hidden="true" />
              <span>Aleatoriedad segura</span>
            </div>
            <button
              type="button"
              className="roulette-sound-button"
              onClick={() => setSoundEnabled((enabled) => !enabled)}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
              title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
            >
              {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
            </button>
          </div>
        </header>

        <div className="roulette-layout">
          <motion.section
            className="roulette-panel roulette-options-panel"
            initial={reveal}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08 }}
            aria-labelledby="roulette-options-title"
          >
            <div className="roulette-panel-title">
              <div>
                <span>Configura el sorteo</span>
                <h2 id="roulette-options-title">Opciones</h2>
              </div>
              <Dices aria-hidden="true" />
            </div>

            <form className="roulette-form" onSubmit={agregarNombre}>
              <label className="sr-only" htmlFor="roulette-option">
                Nueva opción
              </label>
              <input
                id="roulette-option"
                className="roulette-input"
                value={nuevoNombre}
                onChange={(event) => setNuevoNombre(event.target.value)}
                placeholder="Escribe un nombre u opción"
                maxLength={30}
                disabled={mustSpin}
              />
              <button
                className="roulette-add-button"
                type="submit"
                disabled={mustSpin || !nuevoNombre.trim()}
                aria-label="Agregar opción"
              >
                <Plus aria-hidden="true" />
              </button>
            </form>

            <div className="roulette-list-heading">
              <span>{participantes.length === 1 ? "1 opción" : `${participantes.length} opciones`}</span>
              {participantes.length > 0 && (
                <button type="button" onClick={limpiarRuleta} disabled={mustSpin}>
                  <Trash2 aria-hidden="true" /> Vaciar
                </button>
              )}
            </div>

            <div className="roulette-list">
              <AnimatePresence mode="popLayout">
                {participantes.length === 0 ? (
                  <motion.div
                    className="roulette-empty-list"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Añade al menos dos opciones para comenzar.
                  </motion.div>
                ) : (
                  participantes.map((participante, index) => (
                    <motion.div
                      className="roulette-entry"
                      key={`${participante.option}-${index}`}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                      transition={{ duration: reduceMotion ? 0 : 0.22 }}
                    >
                      <i style={{ backgroundColor: participante.style.backgroundColor }} aria-hidden="true" />
                      <span>{participante.option}</span>
                      <button
                        type="button"
                        onClick={() => eliminarNombre(index)}
                        disabled={mustSpin}
                        aria-label={`Eliminar ${participante.option}`}
                      >
                        <X aria-hidden="true" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <p className="roulette-security-note">
              <ShieldCheck aria-hidden="true" />
              El ganador se elige con aleatoriedad criptográfica y sin sesgo entre opciones.
            </p>
          </motion.section>

          <motion.section
            className="roulette-panel roulette-wheel-panel"
            initial={reveal}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.16 }}
            aria-label="Ruleta"
          >
            <div className="roulette-wheel-glow" aria-hidden="true" />
            <div className="roulette-wheel-viewport">
              {participantes.length >= 2 ? (
                <div className="roulette-wheel-scale">
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={participantes}
                    outerBorderColor="#a78bfa"
                    outerBorderWidth={7}
                    innerRadius={20}
                    innerBorderColor="#0b0811"
                    innerBorderWidth={7}
                    radiusLineColor="rgba(255,255,255,0.18)"
                    radiusLineWidth={1}
                    fontFamily="Manrope, sans-serif"
                    fontSize={15}
                    fontWeight={800}
                    perpendicularText
                    textDistance={62}
                    spinDuration={0.8}
                    pointerProps={{
                      style: {
                        filter:
                          "hue-rotate(250deg) saturate(1.25) brightness(1.15) drop-shadow(0 6px 12px rgba(124,58,237,.45))",
                      },
                    }}
                    onStopSpinning={onStopSpinning}
                  />
                </div>
              ) : (
                <div className="roulette-placeholder">
                  <Dices aria-hidden="true" />
                  <strong>La ruleta está lista</strong>
                  <span>
                    {participantes.length === 0
                      ? "Agrega dos opciones para activarla."
                      : "Falta una opción para poder girar."}
                  </span>
                </div>
              )}
            </div>

            <motion.button
              type="button"
              className="roulette-spin-button"
              onClick={girarRuleta}
              disabled={mustSpin || participantes.length < 2}
              whileHover={reduceMotion || mustSpin ? undefined : { y: -2, scale: 1.015 }}
              whileTap={reduceMotion || mustSpin ? undefined : { scale: 0.98 }}
            >
              <Dices aria-hidden="true" />
              {mustSpin ? "Girando..." : "Girar ruleta"}
            </motion.button>

            <div className="roulette-result-slot" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                {ganador ? (
                  <motion.div
                    className="roulette-result"
                    key={ganador}
                    initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Trophy aria-hidden="true" />
                    <div>
                      <span>Resultado</span>
                      <strong>{ganador}</strong>
                    </div>
                    {celebrating && !reduceMotion && (
                      <div className="roulette-particles" aria-hidden="true">
                        {Array.from({ length: 12 }, (_, index) => (
                          <motion.i
                            key={index}
                            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                            animate={{
                              opacity: 0,
                              x: Math.cos((index / 12) * Math.PI * 2) * (58 + (index % 3) * 14),
                              y: Math.sin((index / 12) * Math.PI * 2) * (42 + (index % 4) * 10),
                              rotate: index * 45,
                              scale: [0, 1, 0.45],
                            }}
                            transition={{ duration: 1.35, delay: index * 0.035, ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <p className="roulette-waiting" key="waiting">
                    El resultado aparecerá aquí.
                  </p>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
};
