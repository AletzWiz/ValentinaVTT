import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LiveStream() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const isLive = false;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container mask reveal
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

      // Badge pop in
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

  // Floating hearts animation - desde el lateral derecho del contenedor
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
      {/* Section Title */}
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

      {/* Stream Container */}
      <div
        ref={containerRef}
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 20px 60px rgba(255, 183, 197, 0.4)' }}
      >
        {/* Live Badge */}
        <div
          ref={badgeRef}
          className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full font-bold text-white flex items-center gap-2 ${
            isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
          }`}
        >
          <Radio className="w-4 h-4" />
          {isLive ? 'EN VIVO' : 'OFFLINE'}
        </div>

        {/* Twitch Embed */}
        <div className="relative aspect-video bg-gray-900">
          <iframe
            src="https://player.twitch.tv/?channel=valentinavtt&parent=localhost&autoplay=false"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title="ValentinaVTT Twitch Stream"
          />
        </div>

        {/* Status Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-card p-4">
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
