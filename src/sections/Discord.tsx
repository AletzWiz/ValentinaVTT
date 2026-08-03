import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Discord() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(cardRef.current,
        { y: 80, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );

      // Logo wiggle
      gsap.fromTo(logoRef.current,
        { rotation: -15, scale: 0.7 },
        {
          rotation: 0, scale: 1, duration: 0.7, delay: 0.3, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4">
      <div
        ref={cardRef}
        className="max-w-2xl mx-auto relative rounded-3xl overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #5865F2 0%, #4752C4 50%, #7289DA 100%)',
          boxShadow: '0 25px 70px rgba(88,101,242,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }} />

        {/* Background emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span className="absolute top-8 right-12 text-7xl opacity-[0.08] text-white">💬</span>
          <span className="absolute bottom-8 left-12 text-6xl opacity-[0.08] text-white">🎮</span>
          <span className="absolute top-1/2 right-4 text-5xl opacity-[0.06] text-white">🌸</span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 py-12 sm:px-14">
          {/* Discord Logo */}
          <div
            ref={logoRef}
            className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-xl"
          >
            <svg className="w-12 h-12 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black mb-1">SotanoVTT</h2>
          <p className="text-white/80 text-lg font-semibold mb-6">¡Únete a mi comunidad! 💬</p>

          <p className="text-white/90 text-base mb-1">
            Chatea conmigo, encuentra amigos y sé parte de algo especial.
          </p>
          <p className="text-white font-bold text-lg mb-8">
            ¡Te esperamos en el server! 🌸
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-10">
            {[
              { icon: Users, label: '+1000 miembros' },
              { icon: MessageCircle, label: 'Chat activo' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            className="btn-kawaii font-extrabold text-[#5865F2] text-base px-10 py-6 hover:scale-105"
            style={{
              background: 'white',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
            onClick={() => window.open('https://discord.gg/TvbUCvdsaN', '_blank')}
          >
            🎮 Entrar al Discord
          </Button>
        </div>
      </div>
    </section>
  );
}
