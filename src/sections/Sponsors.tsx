import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
          Sponsors
        </h2>
        <p className="text-gray-500">Apoyan mi contenido</p>
      </div>

      {/* Sponsors Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="relative group"
          >
            <div
              className="relative h-48 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
                border: '2px dashed #FFB7C5',
              }}
            >
              {/* Holographic shimmer effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Star className="w-12 h-12 text-pink-300 mb-3 animate-pulse" />
                <h3 className="text-xl font-bold text-gray-400 mb-1">
                  Próximamente
                </h3>
                <p className="text-sm text-gray-400">
                  Aún no hay sponsors
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA for potential sponsors */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          ¿Interesado en patrocinar?{' '}
          <a
            href="mailto:valentinavtt7@gmail.com"
            className="text-pink-500 hover:text-pink-600 font-semibold underline"
          >
            Contáctame
          </a>
        </p>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
