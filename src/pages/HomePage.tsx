import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Instagram,
  Mail,
  Play,
  Radio,
  Send,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTwitchStatus } from "../hooks/useTwitchStatus";

const socials = [
  {
    name: "Twitch",
    detail: "Directos y VODs",
    stat: "7.459",
    href: "https://www.twitch.tv/valentinavtt",
    icon: Twitch,
  },
  {
    name: "TikTok",
    detail: "Clips y momentos",
    stat: "9.866",
    href: "https://www.tiktok.com/@valentinavtt",
    icon: Play,
  },
  {
    name: "YouTube",
    detail: "Videos y highlights",
    stat: "1.700",
    href: "https://www.youtube.com/@valentinavtt",
    icon: Youtube,
  },
  {
    name: "Instagram",
    detail: "Novedades y stories",
    stat: "11.500",
    href: "https://www.instagram.com/valentinavtt/",
    icon: Instagram,
  },
  {
    name: "X",
    detail: "Anuncios y conversación",
    stat: "259",
    href: "https://x.com/valentina_vtt",
    icon: Twitter,
  },
];
const campaigns = [
  [
    "Directos patrocinados",
    "Un stream de gaming con presencia de marca integrada de forma clara y natural.",
  ],
  [
    "Videojuegos y lanzamientos",
    "Gameplay, primeras impresiones o una sesión dedicada a conocer un videojuego.",
  ],
  [
    "Integraciones en stream",
    "Menciones o presentación de productos relacionados con gaming durante el directo.",
  ],
];
interface ScheduleDay {
  id: string;
  diaNombre: string;
  horaMexico: string;
  tituloStream: string;
}
type StreamState = { status: "loading" | "live" | "offline"; isLive: boolean };

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
function Title({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base leading-7 text-white/55 sm:text-lg">
          {body}
        </p>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section
      id="inicio"
      className="digital-grid minimal-hero relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter
          id="remove-green-artifacts"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  3 -3 0 1 0"
          />
        </filter>
      </svg>
      <div className="minimal-hero-glow" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center px-5 pb-0 pt-14 lg:min-h-[780px] lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pt-20">
        <Reveal className="relative z-20 pb-10 text-center lg:pb-20 lg:text-left">
          <h1 className="font-display text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.86] tracking-[-0.075em] text-white">
            VALENTINA<span className="purple-text">VTT</span>
          </h1>

          <div
            id="redes"
            className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start"
            aria-label="Redes sociales"
          >
            {socials.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={name}
                className="hero-social"
              >
                <Icon size={18} />
                <span>{name}</span>
              </a>
            ))}
          </div>

          <a href="/colaboraciones" className="primary-cta mt-8 px-8">
            Colabora conmigo <ArrowRight size={18} />
          </a>
        </Reveal>

        <Reveal className="relative z-10 flex min-h-[420px] items-end justify-center self-end sm:min-h-[540px] lg:min-h-[700px] lg:justify-end">
          <div className="hero-character-glow" aria-hidden="true" />
          <img
            src="/valentina-hero.png"
            alt="ValentinaVTT sonriendo con su atuendo rojo y negro"
            className="hero-character"
            width="1050"
            height="814"
            fetchPriority="high"
          />
        </Reveal>
      </div>
      <div className="minimal-hero-fade" aria-hidden="true" />
    </section>
  );
}
function Presence() {
  return (
    <section className="border-y border-white/10 bg-white/[.025]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-7 sm:grid-cols-4 lg:px-8">
        {[
          ["Contenido", "Gaming + variedad"],
          ["Formato", "Directos"],
          ["Idioma", "Español"],
          ["Enfoque", "Comunidad real"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="border-white/10 px-3 py-3 sm:border-r last:border-0"
          >
            <p className="text-xs font-bold uppercase tracking-[.16em] text-white/35">
              {k}
            </p>
            <p className="mt-2 font-extrabold text-white">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function Collaborations() {
  return (
    <section id="colaboraciones" className="section-shell">
      <Reveal>
        <Title
          eyebrow="Para marcas y agencias"
          title="Colabora con Valentina"
          body="Opciones sencillas para integrar una marca o videojuego en sus directos de gaming."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(([title, body], i) => (
            <article key={title} className="premium-card group">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-black text-violet-300">
                  0{i + 1}
                </span>
                <ChevronRight
                  className="text-white/20 transition group-hover:translate-x-1 group-hover:text-violet-300"
                  size={19}
                />
              </div>
              <h3 className="text-xl font-extrabold text-white">{title}</h3>
              <p className="mt-3 leading-6 text-white/50">{body}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
function MediaKit() {
  return (
    <section id="media-kit" className="section-shell pb-8 pt-12 sm:pb-12">
      <Reveal>
        <div className="social-presence-panel">
          <div className="social-presence-art" aria-hidden="true">
            <div className="social-presence-glow" />
            <img
              src="/valentina-community.png"
              alt=""
              className="social-presence-character"
              width="1008"
              height="876"
              loading="lazy"
            />
          </div>

          <div className="social-presence-content">
            <p className="eyebrow">Media kit</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
              Audiencia de Valentina
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-white/55">
              Una comunidad de gaming presente en Twitch y en sus principales
              redes sociales.
            </p>

            <div className="social-network-grid mt-8">
              {socials.map(({ name, detail, stat, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-network-card group"
                >
                  <div className="social-network-icon">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-white">{name}</h3>
                    <p className="truncate text-xs text-white/40">{detail}</p>
                  </div>
                  <strong className="social-network-stat">
                    <span>{stat}</span>
                    <small>seguidores</small>
                  </strong>
                </a>
              ))}

              <a
                href="https://discord.gg/TvbUCvdsaN"
                target="_blank"
                rel="noreferrer"
                className="social-network-card social-network-discord group"
              >
                <div className="social-network-icon social-network-icon-discord">
                  <img src="/discord-logo.webp" alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-white">Discord</h3>
                  <p className="truncate text-xs text-white/40">
                    SótanoVTT
                  </p>
                </div>
                <strong className="social-network-stat">
                  <span>+400</span>
                  <small>miembros</small>
                </strong>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
function StreamCommunity({ status, isLive }: StreamState) {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  useEffect(() => {
    fetch("/horario_semanal.json")
      .then((r) => r.json())
      .then((data) =>
        setDays(data.dias.filter((d: ScheduleDay) => d.horaMexico)),
      )
      .catch(() => setDays([]));
  }, []);
  const parent =
    typeof window === "undefined"
      ? "valentinavtt.com"
      : window.location.hostname;
  return (
    <section id="comunidad" className="section-shell pt-4">
      <Reveal>
        <Title
          eyebrow="Directo y comunidad"
          title="El punto de encuentro"
          body="Sigue el stream, consulta el horario semanal o entra al Discord."
        />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b12]">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${isLive ? "bg-red-500 text-white" : "bg-white/5 text-white/55"}`}
              >
                <Radio size={13} />
                {status === "loading"
                  ? "COMPROBANDO"
                  : isLive
                    ? "EN VIVO"
                    : "OFFLINE"}
              </span>
              <a
                href="https://www.twitch.tv/valentinavtt"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-violet-300"
              >
                Abrir Twitch
              </a>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                title="Directo de ValentinaVTT en Twitch"
                src={`https://player.twitch.tv/?channel=valentinavtt&parent=${parent}&autoplay=false`}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
          <div className="h-full">
            <div className="schedule-card flex h-full flex-col rounded-3xl border border-white/10 bg-white/[.025] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold">
                      Horario de streams
                    </h3>
                    <p className="text-xs font-semibold text-white/35">
                      Hora de México
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid flex-1 grid-rows-3 gap-2">
                {days.map((d) => (
                  <div key={d.id} className="schedule-row">
                    <div>
                      <p className="schedule-day">{d.diaNombre}</p>
                      <p className="schedule-title">
                        {d.tituloStream.replace(/🎉|🎮|✨/gu, "").trim()}
                      </p>
                    </div>
                    <time className="schedule-time" dateTime={d.horaMexico}>
                      <Clock3 size={14} />
                      {d.horaMexico}
                    </time>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <a
          href="https://discord.gg/TvbUCvdsaN"
          target="_blank"
          rel="noreferrer"
          className="discord-banner group mt-5"
        >
          <div className="discord-icon" aria-hidden="true">
            <img src="/discord-logo.webp" alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#aeb3ff]">
              Discord oficial
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
              Únete al SótanoVTT
            </h3>
            <p className="mt-1 text-sm leading-6 text-white/50">
              Conversa, recibe novedades y comparte con la comunidad.
            </p>
          </div>
          <span className="discord-cta">
            Entrar al Discord <ArrowRight size={17} />
          </span>
        </a>
      </Reveal>
    </section>
  );
}

function Contact() {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `Propuesta comercial — ${d.get("empresa") || d.get("nombre")}`,
    );
    const body = encodeURIComponent(
      `Nombre: ${d.get("nombre")}\nEmpresa: ${d.get("empresa")}\nEmail: ${d.get("email")}\nCampaña: ${d.get("campana")}\nPlataformas: ${d.get("plataformas")}\nPresupuesto: ${d.get("presupuesto")}\nFechas: ${d.get("fechas")}\n\nBrief:\n${d.get("mensaje")}`,
    );
    window.location.href = `mailto:valentinavtt7@gmail.com?subject=${subject}&body=${body}`;
  };
  return (
    <section id="contacto" className="section-shell pb-24">
      <Reveal>
        <div className="contact-panel digital-grid overflow-hidden rounded-[2rem] border border-violet-300/20 p-6 sm:p-10 lg:p-14">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="eyebrow">Contacto comercial</p>
              <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                Trabajemos juntos
              </h2>
              <p className="mt-5 leading-7 text-white/55">
                Cuéntanos qué quieres lanzar, a quién quieres llegar y qué
                experiencia imaginas.
              </p>
              <a
                href="mailto:valentinavtt7@gmail.com"
                className="mt-8 inline-flex items-center gap-3 font-extrabold text-violet-200"
              >
                <Mail size={19} />
                valentinavtt7@gmail.com
              </a>
              <p className="mt-4 text-xs leading-5 text-white/35">
                El formulario abre tu aplicación de correo con el brief
                preparado. No almacena datos en servidores externos.
              </p>
            </div>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <label>
                Nombre
                <input required name="nombre" autoComplete="name" />
              </label>
              <label>
                Empresa
                <input name="empresa" autoComplete="organization" />
              </label>
              <label>
                Email corporativo
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                />
              </label>
              <label>
                Tipo de campaña
                <select required name="campana" defaultValue="">
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {campaigns.map(([x]) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Plataformas de interés
                <input
                  name="plataformas"
                  placeholder="Twitch, TikTok, YouTube…"
                />
              </label>
              <label>
                Presupuesto aproximado
                <input name="presupuesto" placeholder="Rango y moneda" />
              </label>
              <label className="sm:col-span-2">
                Fechas
                <input
                  name="fechas"
                  placeholder="Ventana estimada de campaña"
                />
              </label>
              <label className="sm:col-span-2">
                Mensaje / brief
                <textarea
                  required
                  name="mensaje"
                  rows={5}
                  placeholder="Objetivo, entregables y detalles importantes"
                />
              </label>
              <button
                className="primary-cta justify-center sm:col-span-2"
                type="submit"
              >
                Preparar correo <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display font-black tracking-[.08em]">
            VALENTINA<span className="text-violet-400">VTT</span>
          </p>
          <p className="mt-1 text-xs text-white/35">
            VTuber · Streamer · Creadora de contenido
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold text-white/45">
          <a href="/ruleta" className="hover:text-white">
            Ruleta
          </a>
          <a
            href="https://throne.com/valentinavtt"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            Wishlist
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
export default function HomePage() {
  const stream = useTwitchStatus();

  return (
    <main>
      <Hero />
      <Presence />
      <StreamCommunity {...stream} />
      <Footer />
    </main>
  );
}

export function CommercialPage() {
  return (
    <main className="digital-grid relative overflow-hidden pt-20">
      <div className="commercial-intro relative z-10 mx-auto max-w-7xl px-5 pb-2 pt-20 lg:px-8">
        <p className="eyebrow">ValentinaVTT para marcas</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-tight text-white sm:text-6xl">
          Gaming en directo con ValentinaVTT.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
          Valentina es streamer de gaming. Comparte sus partidas en Twitch y
          mantiene a su comunidad conectada a través de sus redes sociales.
        </p>
      </div>
      <MediaKit />
      <Collaborations />
      <Contact />
      <Footer />
    </main>
  );
}
