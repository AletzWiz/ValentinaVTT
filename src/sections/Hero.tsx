import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Twitch, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const avatarRef    = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const buttonsRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(avatarRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.55)' }
      )
      .fromTo(titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)' }, '-=0.5'
      )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }, '-=0.3'
      )
      .fromTo(descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }, '-=0.3'
      )
      .fromTo(buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3'
      );

      // Continuous float
      gsap.to(avatarRef.current, {
        y: -14, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt on mouse move
  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const onMove = (e: MouseEvent) => {
      const rect = avatar.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(avatar, {
        rotateX: Math.max(-12, Math.min(12, (e.clientY - cy) / 18)),
        rotateY: Math.max(-12, Math.min(12, (cx - e.clientX) / 18)),
        duration: 0.4, ease: 'power2.out',
      });
    };
    const onLeave = () => {
      gsap.to(avatar, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMove);
    avatar.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      avatar.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Soft ambient background (no busy image) ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #FFF0F7 0%, #F5EEFF 40%, #EAF4FF 75%, #FFF0F7 100%)',
      }} />

      {/* Subtle animated blobs — dreamy & understated */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 — top left, pink */}
        <div className="absolute" style={{
          width: '55vw', height: '55vw', maxWidth: 700, maxHeight: 700,
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(255,182,193,0.35) 0%, transparent 70%)',
          animation: 'float-slow 10s ease-in-out infinite',
          animationDelay: '0s',
        }} />
        {/* Blob 2 — top right, lavender */}
        <div className="absolute" style={{
          width: '45vw', height: '45vw', maxWidth: 580, maxHeight: 580,
          top: '-10%', right: '-12%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.22) 0%, transparent 70%)',
          animation: 'float-slow 12s ease-in-out infinite',
          animationDelay: '-4s',
        }} />
        {/* Blob 3 — bottom center, sky */}
        <div className="absolute" style={{
          width: '50vw', height: '40vw', maxWidth: 640, maxHeight: 500,
          bottom: '-15%', left: '25%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.18) 0%, transparent 70%)',
          animation: 'float-slow 14s ease-in-out infinite',
          animationDelay: '-7s',
        }} />
        {/* Blob 4 — bottom left, peach */}
        <div className="absolute" style={{
          width: '35vw', height: '35vw', maxWidth: 450, maxHeight: 450,
          bottom: '5%', left: '-10%',
          background: 'radial-gradient(circle, rgba(253,186,116,0.15) 0%, transparent 70%)',
          animation: 'float-slow 9s ease-in-out infinite',
          animationDelay: '-2s',
        }} />

        {/* Subtle dot grid overlay — elegant texture */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,133,161,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 py-24 w-full max-w-3xl mx-auto">

        {/* Avatar */}
        <div
          ref={avatarRef}
          className="relative mx-auto mb-8 w-fit"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute -inset-6 rounded-full opacity-50"
            style={{
              background: 'conic-gradient(from 0deg, #FF85A1, #C084FC, #7DD3FC, #86EFAC, #FDE68A, #FF85A1)',
              filter: 'blur(14px)',
              animation: 'spin 8s linear infinite',
            }}
          />
          {/* Dashed spin ring */}
          <div
            className="absolute -inset-4 border-2 border-dashed border-pink-300/50 rounded-full pointer-events-none"
            style={{ animation: 'spin 22s linear infinite' }}
          />

          {/* Avatar frame */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-pulse-glow bg-white flex items-center justify-center">
            <img
              src="/avatar.png"
              alt="ValentinaVTT avatar"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Badge */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-extrabold shadow-lg whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #FF85A1, #A78BFA)' }}
          >
            🌸 Streamer VTT
          </div>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 leading-none tracking-tight"
        >
          ValentinaVTT
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl font-bold mb-3"
          style={{ color: '#A78BFA' }}
        >
          Streamer ✦ Comunidad VTT 💖
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="text-base sm:text-lg max-w-md mx-auto mb-10 font-semibold"
          style={{ color: '#7B5064' }}
        >
          Directos semanales, clips diarios y contenido súper divertido. ¡Te espero! 🎀
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-4">
          <Button
            className="btn-kawaii text-white font-extrabold text-base px-8 py-6 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #9146FF, #6B21D6)' }}
            onClick={() => window.open('https://www.twitch.tv/valentinavtt', '_blank')}
          >
            <Twitch className="w-5 h-5" />
            Ver en Twitch
          </Button>
          <Button
            className="btn-kawaii text-white font-extrabold text-base px-8 py-6 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #FF5C8A, #FF0000)' }}
            onClick={() => window.open('https://www.youtube.com/@valentinavtt', '_blank')}
          >
            <Youtube className="w-5 h-5" />
            Últimos videos
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#7B5064' }}>scroll</span>
          <div className="w-5 h-8 border-2 border-pink-300 rounded-full flex items-start justify-center p-1">
            <div
              className="w-1.5 h-2 bg-pink-400 rounded-full"
              style={{ animation: 'float 1.5s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
