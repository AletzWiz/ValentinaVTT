import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Wishlist() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const giftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card unfold animation
      gsap.fromTo(
        cardRef.current,
        { rotateX: 90, opacity: 0, transformOrigin: 'top center' },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Gift bounce on hover setup
      const gift = giftRef.current;
      if (gift) {
        gift.addEventListener('mouseenter', () => {
          gsap.to(gift, {
            y: -10,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div
        ref={cardRef}
        className="max-w-xl mx-auto relative"
        style={{ perspective: '1000px' }}
      >
        {/* Gift Card */}
        <div
          className="relative bg-white rounded-3xl p-8 sm:p-12 text-center overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(255, 183, 197, 0.4)',
            borderTop: '8px solid #FFB7C5',
          }}
        >
          {/* Ribbon decoration - más sutiles y solo en las esquinas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-24 bg-gradient-to-b from-pink-200 to-transparent opacity-20 rounded-b-full" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-24 h-3 bg-gradient-to-r from-pink-200 to-transparent opacity-20 rounded-r-full" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-24 h-3 bg-gradient-to-l from-pink-200 to-transparent opacity-20 rounded-l-full" />

          {/* Sparkles */}
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Gift Icon */}
          <div
            ref={giftRef}
            className="relative z-10 w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-pink-300/50"
          >
            <Gift className="w-12 h-12 text-white" />
            <Heart className="absolute -top-2 -right-2 w-6 h-6 text-red-400 fill-red-400 animate-bounce" />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
            Wishlist
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-2">
            Si me quieres regalar algo, puedes ver mi
          </p>
          <p className="text-xl font-bold text-pink-500 mb-2">
            Wishlist
          </p>
          <p className="text-lg text-gray-600 mb-6">
            aquí, bb <span className="inline-block animate-pulse">💝</span>
          </p>

          <p className="text-base text-gray-500 mb-8">
            ¡Gracias por tu apoyo! ✨
          </p>

          {/* Button */}
          <Button
            className="btn-kawaii bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-8 py-6 text-lg"
            onClick={() => window.open('https://throne.com/valentinavtt', '_blank')}
          >
            <Gift className="w-5 h-5 mr-2" />
            Abrir mi Wishlist
          </Button>
        </div>

        {/* Floating hearts around card */}
        <div className="absolute -top-4 -right-4 text-2xl animate-float" style={{ animationDelay: '0.3s' }}>
          💕
        </div>
        <div className="absolute -bottom-4 -left-4 text-2xl animate-float" style={{ animationDelay: '0.6s' }}>
          💖
        </div>
        <div className="absolute top-1/2 -right-8 text-xl animate-float" style={{ animationDelay: '0.9s' }}>
          💗
        </div>
      </div>
    </section>
  );
}
