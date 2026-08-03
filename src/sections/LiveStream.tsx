import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LiveStream() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);

  const isLive = true;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      // Player entrance
      gsap.fromTo(wrapperRef.current,
        { scale: 0.9, opacity: 0, y: 40 },
        {
          scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Badge pop
      gsap.fromTo(badgeRef.current,
        { scale: 0, rotation: -20 },
        {
          scale: 1, rotation: 0, duration: 0.5, delay: 0.6, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Floating hearts / sparkles
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const emojis = ['💖', '💕', '✨', '🌸', '💗'];
    const interval = setInterval(() => {
      const heart = document.createElement('div');
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.cssText = `
        position:absolute; right:12px; top:${15 + Math.random() * 65}%;
        font-size:${1 + Math.random() * 0.6}rem;
        pointer-events:none; z-index:30; opacity:0.9;
        filter: drop-shadow(0 2px 4px rgba(255,133,161,0.5));
      `;
      el.appendChild(heart);
      gsap.to(heart, {
        x: -35 - Math.random() * 40,
        y: -70 - Math.random() * 50,
        opacity: 0, scale: 0.4, duration: 2.8, ease: 'power1.out',
        onComplete: () => heart.remove(),
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Build parent string dynamically so it works on localhost AND production
  const twitchParent = typeof window !== 'undefined' ? window.location.hostname : 'www.valentinavtt.com';
  const twitchSrc = `https://player.twitch.tv/?channel=valentinavtt&parent=${twitchParent}&autoplay=false`;

  return (
    <section ref={sectionRef} className="relative py-20 px-4">
      {/* Section header */}
      <div ref={titleRef} className="text-center mb-10">
        <h2 className="section-title">
          <span className="text-gradient">En Vivo</span> / Último Directo 🎮
        </h2>
        <a
          href="https://www.twitch.tv/valentinavtt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold transition-all duration-300 hover:scale-105"
          style={{ color: '#A78BFA' }}
        >
          Ir al canal <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Player wrapper */}
      <div
        ref={wrapperRef}
        className="relative max-w-5xl mx-auto"
      >
        {/* Glow background */}
        <div
          className="absolute -inset-3 rounded-[2rem] opacity-40 blur-xl"
          style={{ background: 'linear-gradient(135deg, #FF85A1, #A78BFA, #7DD3FC)' }}
        />

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-white/50 shadow-2xl">
          {/* LIVE badge */}
          <div
            ref={badgeRef}
            className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full font-extrabold text-white text-sm flex items-center gap-2 shadow-lg ${
              isLive ? 'bg-red-500' : 'bg-gray-500'
            }`}
          >
            <span className="relative flex h-3 w-3 flex-shrink-0">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
              )}
              <Radio className="relative inline-flex w-4 h-4" />
            </span>
            {isLive ? '🔴 EN VIVO' : '⚫ OFFLINE'}
          </div>

          {/* Iframe — parent is set to current hostname so it works on localhost & production */}
          <div className="relative aspect-video bg-gray-900">
            <iframe
              src={twitchSrc}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title="ValentinaVTT Twitch Stream"
            />
          </div>

          {/* Bottom info bar */}
          <div
            className="px-5 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(255,133,161,0.1), rgba(167,139,250,0.1))' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
              background: isLive ? '#22c55e' : '#6b7280',
              boxShadow: isLive ? '0 0 8px #22c55e' : 'none',
            }} />
            <p className="text-sm font-semibold" style={{ color: '#7B5064' }}>
              {isLive
                ? '¡Estoy en directo ahora! Únete al chat 💬'
                : 'ValentinaVTT está offline. ¡Vuelve pronto! 🌸'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
