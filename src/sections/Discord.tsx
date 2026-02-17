import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Discord() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section slide up
      gsap.fromTo(
        sectionRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Logo wiggle
      gsap.fromTo(
        logoRef.current,
        { rotation: -10 },
        {
          rotation: 10,
          duration: 0.5,
          repeat: 3,
          yoyo: true,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div
        ref={contentRef}
        className="max-w-2xl mx-auto relative bg-[#5865F2] rounded-3xl p-8 sm:p-12 text-white overflow-hidden"
        style={{
          boxShadow: '0 20px 60px rgba(88, 101, 242, 0.4)',
        }}
      >
        {/* Chat bubble tail */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: '20px solid #5865F2',
          }}
        />

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl">💬</div>
          <div className="absolute bottom-10 left-10 text-8xl">🎮</div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Discord Logo */}
          <div
            ref={logoRef}
            className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-[#5865F2]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">SotanoVTT</h2>
          <h3 className="text-xl font-semibold mb-4 opacity-90">
            ¿Te unes a mi Discord?
          </h3>

          {/* Description */}
          <p className="text-lg mb-2 opacity-90">
            ¿Quieres ser parte de mi comunidad y poder hablar conmigo?
          </p>
          <p className="text-lg mb-8 font-semibold">
            ¡Únete a mi Discord!
          </p>
          <p className="text-base mb-8 opacity-80">
            ¡Te esperamos en el server! 💬
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">+1000 miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Chat activo</span>
            </div>
          </div>

          {/* Button */}
          <Button
            className="btn-kawaii bg-white text-[#5865F2] hover:bg-gray-100 font-bold px-8 py-6 text-lg group"
            onClick={() => window.open('https://discord.gg/kynsvrTV', '_blank')}
          >
            <span className="group-hover:animate-wiggle inline-block">
              Entrar al Discord
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
