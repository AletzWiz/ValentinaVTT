import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Twitch, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Avatar spiral entrance
      gsap.fromTo(
        avatarRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
      );

      // Title character reveal
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' }
      );

      // Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: 'power2.out' }
      );

      // Description
      gsap.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.7, ease: 'power2.out' }
      );

      // Buttons elastic drop
      gsap.fromTo(
        buttonsRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'bounce.out' }
      );

      // Floating animation for avatar
      gsap.to(avatarRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt effect on mouse move
  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = avatar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (e.clientY - centerY) / 20;
      const rotateY = (centerX - e.clientX) / 20;

      gsap.to(avatar, {
        rotateX: Math.max(-15, Math.min(15, rotateX)),
        rotateY: Math.max(-15, Math.min(15, rotateY)),
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(avatar, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    avatar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      avatar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-hero.jpg)' }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-100/30 via-transparent to-pink-50/50" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-300/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20">
        {/* Avatar */}
        <div
          ref={avatarRef}
          className="relative mx-auto mb-8 flex items-center justify-center"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-pulse-glow bg-white flex items-center justify-center">
            <img
              src="/avatar.png"
              alt="ValentinaVTT"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Decorative ring */}
          <div className="absolute -inset-3 border-2 border-dashed border-pink-300 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '20s' }} />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 text-gradient"
        >
          ValentinaVTT
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl font-bold text-pink-600 mb-2"
        >
          Streamer • Comunidad VTT 💖
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="text-base sm:text-lg text-gray-600 max-w-md mx-auto mb-8"
        >
          Directos semanales, clips diarios y contenido divertido.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-4">
          <Button
            className="btn-kawaii bg-[#9146FF] hover:bg-[#7B3FD1] text-white flex items-center gap-2"
            onClick={() => window.open('https://www.twitch.tv/valentinavtt', '_blank')}
          >
            <Twitch className="w-5 h-5" />
            Ver en Twitch
          </Button>
          <Button
            className="btn-kawaii bg-[#FF0000] hover:bg-[#CC0000] text-white flex items-center gap-2"
            onClick={() => window.open('https://www.youtube.com/@valentinavtt', '_blank')}
          >
            <Youtube className="w-5 h-5" />
            Últimos videos
          </Button>
        </div>
      </div>
    </section>
  );
}
