import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardGradients = [
    'linear-gradient(135deg, #FFD6E0, #F3E8FF)',
    'linear-gradient(135deg, #E0F2FE, #F3E8FF)',
    'linear-gradient(135deg, #DCFCE7, #FFF0F5)',
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4">
      {/* Header */}
      <div ref={titleRef} className="text-center mb-12">
        <h2 className="section-title">
          <span className="text-gradient">Sponsors</span> ✨
        </h2>
        <p className="section-subtitle">Personas que apoyan mi contenido 💖</p>
      </div>

      {/* Sponsors Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[0, 1, 2].map(index => (
          <div
            key={index}
            ref={el => { cardsRef.current[index] = el; }}
            className="group relative rounded-3xl overflow-hidden cursor-pointer"
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { y: -8, scale: 1.03, duration: 0.3, ease: 'back.out(2)' });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
            }}
            style={{
              background: cardGradients[index],
              boxShadow: '0 10px 40px rgba(255,133,161,0.2)',
              border: '2px dashed rgba(199,130,255,0.35)',
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                  animation: 'shimmer 1.8s ease infinite',
                }}
              />
            </div>

            <div className="relative h-48 flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
                style={{ background: 'rgba(255,133,161,0.15)' }}
              >
                <Sparkles className="w-7 h-7" style={{ color: '#C084FC' }} />
              </div>
              <h3 className="text-lg font-extrabold mb-1" style={{ color: '#3D1A2B' }}>
                Próximamente
              </h3>
              <p className="text-sm font-semibold" style={{ color: '#7B5064' }}>
                Aún no hay sponsors
              </p>
              <p className="text-xs mt-2" style={{ color: '#A78BFA' }}>
                ¿Quieres ser el primero? 🌸
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <p className="text-sm font-semibold" style={{ color: '#7B5064' }}>
          ¿Interesado en patrocinar?{' '}
          <a
            href="mailto:valentinavtt7@gmail.com"
            className="font-extrabold underline decoration-dotted hover:no-underline transition-all"
            style={{ color: '#FF85A1' }}
          >
            Contáctame aquí ✉️
          </a>
        </p>
      </div>
    </section>
  );
}
