import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Clock3,
  ExternalLink,
  Instagram,
  Mail,
  MessageCircle,
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
    href: "https://www.twitch.tv/valentinavtt",
    icon: Twitch,
  },
  {
    name: "TikTok",
    detail: "Clips y momentos",
    href: "https://www.tiktok.com/@valentinavtt",
    icon: Play,
  },
  {
    name: "YouTube",
    detail: "Videos y highlights",
    href: "https://www.youtube.com/@valentinavtt",
    icon: Youtube,
  },
  {
    name: "Instagram",
    detail: "Novedades y stories",
    href: "https://www.instagram.com/valentinavtt/",
    icon: Instagram,
  },
  {
    name: "X",
    detail: "Anuncios y conversación",
    href: "https://x.com/valentina_vtt",
    icon: Twitter,
  },
];
const campaigns = [
  [
    "Streams patrocinados",
    "Integración natural de marca durante un directo con espacio para interacción real.",
  ],
  [
    "Integraciones de producto",
    "Demostraciones, menciones y formatos adaptados al producto y a la audiencia.",
  ],
  [
    "Contenido vertical",
    "TikTok, Shorts y Reels diseñados para alcance, retención y conversación.",
  ],
  [
    "Lanzamientos gaming",
    "Primeras impresiones, gameplay y activaciones para videojuegos y plataformas.",
  ],
  [
    "Activaciones de comunidad",
    "Dinámicas, retos, giveaways y experiencias participativas en vivo.",
  ],
  [
    "Campañas sociales",
    "Contenido multiplataforma con una voz consistente y cercana.",
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
      <div className="minimal-hero-glow" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center px-5 pb-0 pt-14 lg:min-h-[780px] lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pt-20">
        <Reveal className="relative z-20 pb-10 text-center lg:pb-20 lg:text-left">
          <h1 className="font-display text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.86] tracking-[-0.075em] text-white">
            VALENTINA<span className="purple-text">VTT</span>
          </h1>

          <div
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

          <a href="#contacto" className="primary-cta mt-8 px-8">
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
          ["Formato", "Directo + vertical"],
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
          body="Campañas pensadas para integrarse al contenido sin perder la voz de la creadora ni la confianza de su comunidad."
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
function Content() {
  return (
    <section id="contenido" className="section-shell pt-4">
      <Reveal>
        <Title
          eyebrow="Showreel"
          title="Contenido destacado"
          body="Una selección breve para conocer su personalidad, ritmo y relación con la comunidad."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            "Personalidad en directo",
            "Gaming y entretenimiento",
            "Momentos con la comunidad",
          ].map((title, i) => (
            <article
              key={title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b12]"
            >
              <div className="digital-grid relative aspect-video bg-gradient-to-br from-violet-950 to-[#08070b]">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition group-hover:scale-105 group-hover:bg-violet-500">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-white/65">
                  Video por añadir
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-violet-300">
                  0{i + 1} / DESTACADO
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  Espacio preparado para el enlace y miniatura final.
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
function Metrics() {
  return (
    <section className="section-shell pt-4">
      <Reveal>
        <Title
          eyebrow="Media kit"
          title="Valentina en números"
          body="La estructura está lista para mostrar datos verificables. Ninguna cifra se publicará hasta ser confirmada."
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            "Comunidad total",
            "Visualizaciones mensuales",
            "Average viewers",
            "Engagement",
          ].map((label) => (
            <div key={label} className="metric-card">
              <BarChart3 size={20} className="text-violet-400" />
              <p className="mt-8 text-xl font-black text-white/35 sm:text-2xl">
                Dato pendiente
              </p>
              <p className="mt-2 text-sm font-semibold text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
function SocialHub() {
  return (
    <section id="redes" className="section-shell pt-4">
      <Reveal>
        <Title
          eyebrow="Hub oficial"
          title="Encuentra a Valentina"
          body="Directos, videos, clips y actualizaciones desde un solo lugar."
        />
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.025]">
          {socials.map(({ name, detail, href, icon: Icon }, i) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`group flex items-center gap-4 p-5 transition hover:bg-violet-500/10 sm:p-6 ${i ? "border-t border-white/10" : ""}`}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-violet-300">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-white">{name}</h3>
                <p className="text-sm text-white/45">{detail}</p>
              </div>
              <ExternalLink
                size={17}
                className="text-white/25 transition group-hover:text-violet-300"
              />
            </a>
          ))}
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
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-violet-300" />
                <h3 className="text-lg font-extrabold">Horario semanal</h3>
              </div>
              <div className="mt-5 space-y-3">
                {days.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-0"
                  >
                    <div>
                      <p className="font-bold text-white">{d.diaNombre}</p>
                      <p className="text-white/40">
                        {d.tituloStream.replace(/🎉|🎮|✨/gu, "").trim()}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-bold text-violet-300">
                      <Clock3 size={14} />
                      {d.horaMexico} MX
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <a
              href="https://discord.gg/TvbUCvdsaN"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#5865F2]/35 bg-[#5865F2]/10 p-6 transition hover:bg-[#5865F2]/20"
            >
              <MessageCircle className="text-[#8991ff]" />
              <h3 className="mt-5 text-xl font-extrabold">SotanoVTT</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Conversación, novedades y comunidad en Discord.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#aab0ff]">
                Entrar al servidor <ArrowRight size={15} />
              </span>
            </a>
          </div>
        </div>
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
      <Collaborations />
      <Content />
      <Metrics />
      <SocialHub />
      <StreamCommunity {...stream} />
      <Contact />
      <Footer />
    </main>
  );
}
