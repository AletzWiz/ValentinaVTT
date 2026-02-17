import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LiveStream() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  // CAMBIO 1: Cambia esto a 'true' cuando estés en directo
  const isLive = true; 

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(100% at 50% 50%)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        badgeRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          delay: 0.8,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      
      const heart = document.createElement('div');
      heart.innerHTML = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
      heart.className = 'absolute text-xl pointer-events-none z-10';
      heart.style.right = '10px';
      heart.style.top = `${20 + Math.random() * 60}%`;
      heart.style.opacity = '0.8';
      containerRef.current.appendChild(heart);

      gsap.to(heart, {
        x: -30 - Math.random() * 50,
        y: -80 - Math.random() * 50,
        opacity: 0,
        scale: 0.5,
        duration: 2.5,
        ease: 'power1.out',
        onComplete: () => heart.remove(),
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
          En vivo / Último directo
        </h2>
        <a
          href="https://www.twitch.tv/valentinavtt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-semibold transition-colors"
        >
          Ir al canal <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div
        ref={containerRef}
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 20px 60px rgba(255, 183, 197, 0.4)' }}
      >
        <div
          ref={badgeRef}
          className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full font-bold text-white flex items-center gap-2 ${
            isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
          }`}
        >
          <span className="relative flex h-3 w-3">
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
            <Radio className="relative inline-flex w-4 h-4" />
          </span>
          {isLive ? 'EN VIVO' : 'OFFLINE'}
        </div>

        <div className="relative aspect-video bg-gray-900">
          <iframe
            // CAMBIO 2: Aquí agregué tus dominios reales en el parámetro parent
            src="https://player.twitch.tv/?channel=valentinavtt&parent=valentina-vtt.vercel.app&parent=www.valentinavtt.com&autoplay=false"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title="ValentinaVTT Twitch Stream"
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-card p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/20">
          <p className="text-sm text-gray-600">
            {isLive
              ? '¡Estoy en directo ahora! Únete al chat 💬'
              : 'ValentinaVTT está offline. Revisa el último directo.'}
          </p>
        </div>
      </div>
    </section>
  );
}
