'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Twitch,
  Youtube,
  Instagram,
  Twitter,
  PlayCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
} from 'lucide-react';

/* =========================================================
   Partículas kawaii rositas cayendo
========================================================= */
function SparkleParticles({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: rand(0.8, 1.8),
      s: rand(0.1, 0.3),
      a: rand(0.2, 0.5),
      hue: [330, 315, 300, 340][(Math.random() * 4) | 0],
    }));

    let raf = 0;
    function draw() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y += p.s;
        if (p.y - p.r > height) {
          p.y = -p.r;
          p.x = Math.random() * width;
        }
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        const color = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
        grad.addColorStop(0, color);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        p.a += (Math.random() - 0.5) * 0.015;
        p.a = Math.min(0.6, Math.max(0.18, p.a));
      }
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-screen w-screen z-10"
    />
  );
}

/* =========================================================
   Showcase lateral: slideshow + banner “Código de Creador”
========================================================= */
function SideShowcase() {
  const images = [
    '/valentina-feliz.png',
    '/valentina-corazones.png',
    '/valentina-guiño.png',
    '/valentina-rosa.png',
    '/valentina-nekomimi.png',
  ];
  const creatorSrc = '/creator-code.png';

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3800);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 right-0 hidden lg:block z-[8]">
      <div className="relative h-full w-full overflow-hidden">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            className={`absolute inset-0 mx-auto h-full w-full object-contain transition-opacity duration-[1200ms] ${
              i === idx ? 'opacity-25' : 'opacity-0'
            }`}
            style={{ filter: 'saturate(1.05) hue-rotate(10deg)' }}
          />
        ))}

        {/* Banner en esquina inferior derecha */}
        <img
          src={creatorSrc}
          alt="Código de Creador"
          loading="lazy"
          className="absolute bottom-8 right-6 w-[260px] -rotate-2 drop-shadow-2xl opacity-95"
          style={{ filter: 'saturate(1.1) hue-rotate(12deg)' }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Card sponsor bloqueado (estilo videojuego)
========================================================= */
function LockedSponsorCard({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-[520px] h-[220px]' : 'w-[420px] h-[180px]';
  return (
    <div
      className={`relative ${dims} overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,.5)]`}
    >
      <div className="absolute inset-0 bg-black" />
      <div className="absolute -left-10 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-0 -bottom-8 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
            <Lock className="h-6 w-6 text-white/90" />
          </div>
          <p className="mt-3 font-semibold tracking-wide text-white/90">
            Próximamente
          </p>
          <p className="text-xs text-white/60">Aún no hay sponsors</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
    </div>
  );
}

/* =========================================================
   Estilo de botón reactivo (degradado suave)
========================================================= */
const reactiveBtn =
  'inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg ' +
  'bg-[linear-gradient(90deg,#ec4899,#d946ef,#ec4899)] bg-[length:200%_100%] ' +
  'transition-[background-position,transform,box-shadow] duration-300 ' +
  'hover:bg-[position:100%_0] hover:scale-[1.03] active:scale-[0.98] ' +
  'shadow-pink-400/40';

/* =========================================================
   Panel reutilizable (Discord/Wishlist)
========================================================= */
function Panel({
  bandText,
  bandColor,
  icon,
  title,
  children,
  ctaHref,
  ctaText,
}: {
  bandText: string;
  bandColor: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  ctaHref: string;
  ctaText: string;
}) {
  return (
    <div className="relative min-h-[240px] sm:min-h-[260px] overflow-hidden rounded-3xl border border-pink-200/40 bg-white/70 p-0 backdrop-blur">
      {/* Banda vertical */}
      <div
        className={`absolute left-0 top-0 flex h-full w-12 sm:w-16 items-center justify-center ${bandColor} text-white [writing-mode:vertical-rl] rotate-180 text-base sm:text-lg font-extrabold tracking-widest shadow-inner`}
      >
        {bandText}
      </div>
      {/* Contenido */}
      <div className="p-5 sm:p-6 pl-16 sm:pl-20">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-pink-800">{title}</h3>
        </div>
        <div className="mt-2 text-sm text-purple-700/80">{children}</div>
        <a href={ctaHref} className={`${reactiveBtn} mt-4`} aria-label={ctaText}>
          {ctaText}
        </a>
      </div>
    </div>
  );
}

/* =========================================================
   Página principal
========================================================= */
export default function ValentinaVTTPage() {
  // animación de entrada
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    return () => clearTimeout(t);
  }, []);

  // menos partículas en móviles
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Mis redes
  const links = [
    {
      title: 'Twitch',
      href: 'https://www.twitch.tv/valentinavtt',
      subtitle: 'En vivo y VODs',
      icon: <Twitch className="h-6 w-6 text-pink-500 transition group-hover:text-pink-600" />,
    },
    {
      title: 'YouTube',
      href: 'https://www.youtube.com/@valentinavtt',
      subtitle: 'Clips y highlights',
      icon: <Youtube className="h-6 w-6 text-pink-500 transition group-hover:text-pink-600" />,
    },
    {
      title: 'TikTok',
      href: 'https://www.tiktok.com/@valentinavtt',
      subtitle: 'Shorts diarios',
      icon: <PlayCircle className="h-6 w-6 text-pink-500 transition group-hover:text-pink-600" />,
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com/valentinavtt/',
      subtitle: 'Fotos y stories',
      icon: <Instagram className="h-6 w-6 text-pink-500 transition group-hover:text-pink-600" />,
    },
    {
      title: 'X (Twitter)',
      href: 'https://x.com/valentina_vtt',
      subtitle: 'Tweets y anuncios',
      icon: <Twitter className="h-6 w-6 text-pink-500 transition group-hover:text-pink-600" />,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-200 via-pink-100 to-purple-200 text-purple-900 font-['Comic Neue',cursive]">
      {/* Blobs de fondo */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50" aria-hidden>
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-400/40 blur-3xl" />
        <div className="absolute right-16 top-1/3 h-72 w-72 rounded-full bg-purple-300/40 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-fuchsia-400/40 blur-3xl" />
      </div>

      {/* Fondo decorativo + partículas */}
      <SideShowcase />
      <SparkleParticles count={isSmall ? 22 : 50} />

      {/* Contenido */}
      <div
        className={`relative z-20 mx-auto max-w-5xl px-3 sm:px-4 pb-20 sm:pb-24 pt-10 sm:pt-16 transform transition-all duration-700 ${
          ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* Header */}
        <header className="flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="Avatar de ValentinaVTT"
            loading="lazy"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-4 ring-pink-300 shadow-xl"
          />
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-pink-700 drop-shadow">
            ValentinaVTT
          </h1>
          <p className="mt-2 max-w-xl text-[15px] sm:text-base text-purple-700/80">
            Streamer • Directos semanales, clips diarios y contenido divertido.
          </p>

          {/* Botones principales */}
          <div className="mt-6 flex w-full max-w-lg flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <a href="https://www.twitch.tv/valentinavtt" className={`${reactiveBtn} w-full sm:w-auto min-h-[44px]`} aria-label="Ver en Twitch">
              <Twitch className="h-5 w-5 text-white" /> Ver en Twitch
            </a>
            <a
              href="https://www.youtube.com/@valentinavtt"
              className={`${reactiveBtn.replace('shadow-lg', 'shadow-md')} w-full sm:w-auto min-h-[44px]`}
              aria-label="Últimos videos en YouTube"
            >
              <Youtube className="h-5 w-5 text-white" /> Últimos videos
            </a>
          </div>
        </header>

        {/* Embed de Twitch */}
        <section className="mt-6 sm:mt-10">
          <div className="rounded-2xl sm:rounded-3xl border border-pink-300/30 bg-white/50 p-2 shadow-xl backdrop-blur">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black">
              <iframe
                title="Twitch Player"
                src={
                  'https://player.twitch.tv/?channel=ValentinaVTT' +
                  '&parent=localhost' +
                  '&parent=valentina-vtt.vercel.app'
                }
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between px-4 py-3 text-xs text-purple-700/70">
              <span>En vivo / Último directo</span>
              <a
                href="https://www.twitch.tv/valentinavtt"
                className="underline decoration-pink-400/40 underline-offset-4 hover:text-pink-600"
              >
                Ir al canal →
              </a>
            </div>
          </div>
        </section>

        {/* Mis redes */}
        <section className="mt-10">
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-pink-700">Mis redes</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <a
                key={l.title}
                href={l.href}
                className="group rounded-3xl border border-pink-300/30 bg-white/70 p-3 sm:p-4 backdrop-blur transition hover:scale-[1.02] hover:bg-pink-100 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-2xl bg-pink-200">
                    {l.icon}
                  </div>
                  <div>
                    <div className="text-[15px] sm:text-base font-bold text-pink-800">{l.title}</div>
                    <div className="text-xs sm:text-sm text-purple-700/70">{l.subtitle}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Discord + Wishlist */}
        <section className="mt-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel
              bandText="SotanoVTT"
              bandColor="bg-[linear-gradient(180deg,#ec4899,#d946ef)]"
              icon={<MessageCircle className="h-6 w-6 text-pink-600" />}
              title="¿Te unes a mi Discord?"
              ctaHref="https://discord.gg/kynsvrTV"
              ctaText="Entrar al Discord"
            >
              ¿Quieres ser parte de mi comunidad y poder hablar conmigo?{' '}
              <span className="font-semibold text-pink-700">¡Únete a mi Discord!</span>
              <p className="mt-1 text-[11px] text-pink-600/80">¡Te esperamos en el server! 💬</p>
            </Panel>

            <Panel
              bandText="Wishlist"
              bandColor="bg-[linear-gradient(180deg,#ec4899,#d946ef)]"
              icon={<Heart className="h-6 w-6 text-pink-600" />}
              title="Wishlist"
              ctaHref="https://throne.com/valentinavtt"
              ctaText="Abrir mi Wishlist"
            >
              Si me quieres regalar algo, puedes ver mi{' '}
              <span className="font-semibold text-pink-700">Wishlist</span> aquí, bb 💝
              <p className="mt-1 text-[11px] text-pink-600/80">¡Gracias por tu apoyo! ✨</p>
            </Panel>
          </div>
        </section>

        {/* Sponsors bloqueados */}
<section className="mt-12">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-pink-700">Sponsors</h2>
    <div className="flex items-center gap-2">
      <button
        disabled
        title="Próximamente"
        className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full bg-white/70 text-pink-700 ring-1 ring-pink-200/60 shadow-sm opacity-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        disabled
        title="Próximamente"
        className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full bg-white/70 text-pink-700 ring-1 ring-pink-200/60 shadow-sm opacity-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>

  {/* Alto adaptable y sin ocultar laterales en móvil */}
  <div className="relative h-56 sm:h-56 lg:h-64">
    {/* Lateral IZQ: visible también en móvil, más pequeña */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 -rotate-6 scale-[.78] sm:scale-90 opacity-60">
      <LockedSponsorCard />
    </div>

    {/* Lateral DER */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rotate-6 scale-[.78] sm:scale-90 opacity-60">
      <LockedSponsorCard />
    </div>

    {/* Central (un poco de padding en móvil para que no pegue a los bordes) */}
    <div className="absolute left-1/2 top-1/2 w-[92%] sm:w-auto max-w-[520px] -translate-x-1/2 -translate-y-1/2 px-2 sm:px-0">
      <LockedSponsorCard size="lg" />
    </div>
  </div>
</section> 

        {/* Contacto */}
        <section id="contacto" className="mt-10 sm:mt-12">
          <div className="rounded-3xl border border-pink-200/40 bg-white/70 p-5 sm:p-6 text-center backdrop-blur">
            <h2 className="text-lg sm:text-xl font-semibold text-pink-700">Contacto</h2>
            <p className="mt-2 text-[13px] sm:text-sm text-purple-700/80">
              Contáctame para colaborar:{' '}
              <a
                href="mailto:valentinavtt7@gmail.com"
                className="underline decoration-pink-300/40 underline-offset-4 hover:text-pink-600"
              >
                valentinavtt7@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 sm:mt-12 flex flex-col items-center gap-2 text-center text-[11px] sm:text-xs text-purple-700/70">
          <p>© {new Date().getFullYear()} ValentinaVTT. Todos los derechos reservados.</p>
          <p>
            Hecho con <span aria-hidden>💖</span> para la comunidad | Creado por{' '}
            <span className="font-bold">Aletzwiz</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
