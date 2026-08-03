import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const floatingDecos = [
  { emoji: '💝', top: '-16px', right: '-16px', delay: '0s',   size: '2rem' },
  { emoji: '🎀', top: '20%',   left: '-20px',  delay: '0.5s', size: '1.8rem' },
  { emoji: '✨', bottom: '-12px', left: '20%', delay: '0.9s', size: '1.6rem' },
  { emoji: '💖', top: '60%',   right: '-18px',  delay: '1.2s', size: '1.7rem' },
  { emoji: '🌸', bottom: '-14px', right: '15%', delay: '0.3s', size: '1.5rem' },
];

export default function Wishlist() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const giftRef    = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(cardRef.current,
        { rotateY: -25, opacity: 0, scale: 0.9 },
        {
          rotateY: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Gift icon pulse on scroll enter
      gsap.fromTo(giftRef.current,
        { scale: 0, rotation: -20 },
        {
          scale: 1, rotation: 0, duration: 0.6, delay: 0.4, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Gift hover
      const gift = giftRef.current;
      if (gift) {
        gift.addEventListener('mouseenter', () => {
          gsap.to(gift, { y: -12, rotation: 10, duration: 0.3, ease: 'power2.out' });
        });
        gift.addEventListener('mouseleave', () => {
          gsap.to(gift, { y: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4">
      {/* Header */}
      <div ref={titleRef} className="text-center mb-12">
        <h2 className="section-title">
          Mi <span className="text-gradient">Wishlist</span> 🎀
        </h2>
        <p className="section-subtitle">¿Quieres regalarme algo? ¡Aquí está mi lista! 💝</p>
      </div>

      <div className="max-w-md mx-auto relative" style={{ perspective: '1200px' }}>
        {/* Floating decorations */}
        {floatingDecos.map((d, i) => (
          <span
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              top: d.top,
              right: (d as Record<string, string>).right,
              left: (d as Record<string, string>).left,
              bottom: (d as Record<string, string>).bottom,
              fontSize: d.size,
              animationDelay: d.delay,
              animation: `float 3.5s ease-in-out ${d.delay} infinite`,
              filter: 'drop-shadow(0 2px 6px rgba(255,133,161,0.4))',
              zIndex: 20,
            }}
          >
            {d.emoji}
          </span>
        ))}

        {/* Main card */}
        <div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #fff 0%, #FFF0F5 60%, #F3E8FF 100%)',
            boxShadow: '0 25px 70px rgba(255,133,161,0.3), inset 0 1px 0 rgba(255,255,255,0.9)',
            border: '2px solid rgba(255,133,161,0.2)',
          }}
        >
          {/* Top ribbon */}
          <div
            className="h-2 w-full"
            style={{ background: 'linear-gradient(90deg, #FF85A1, #C084FC, #7DD3FC, #FF85A1)', backgroundSize: '200% 100%', animation: 'gradient-shift 3s linear infinite' }}
          />

          <div className="px-8 py-10 text-center">
            {/* Gift icon */}
            <div
              ref={giftRef}
              className="relative w-24 h-24 mx-auto mb-7 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF85A1, #C084FC)',
                boxShadow: '0 10px 30px rgba(255,133,161,0.5)',
              }}
            >
              <Gift className="w-12 h-12 text-white" />
              <div
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shadow"
                style={{ background: 'linear-gradient(135deg, #FF5C8A, #FF85A1)', animation: 'heart-beat 1.5s ease-in-out infinite' }}
              >
                💖
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: '#3D1A2B' }}>
              ¡Hazme feliz! 🥺
            </h3>

            <p className="text-base mb-1" style={{ color: '#7B5064' }}>
              Si me quieres regalar algo, puedes ver mi
            </p>
            <p className="text-2xl font-black mb-1" style={{
              background: 'linear-gradient(135deg, #FF85A1, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Wishlist
            </p>
            <p className="text-base mb-6" style={{ color: '#7B5064' }}>
              aquí, bb 💝
            </p>

            <p className="text-sm mb-8 font-semibold" style={{ color: '#A78BFA' }}>
              ¡Gracias por tu apoyo! ✨ Todo lo agradezco muchísimo
            </p>

            <Button
              className="btn-kawaii text-white font-extrabold text-base px-10 py-6 w-full"
              style={{ background: 'linear-gradient(135deg, #FF85A1, #C084FC)' }}
              onClick={() => window.open('https://throne.com/valentinavtt', '_blank')}
            >
              <Gift className="w-5 h-5 mr-2" />
              Abrir mi Wishlist 🎀
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
