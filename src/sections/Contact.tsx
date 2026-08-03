import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const iconRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 83%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(iconRef.current,
        { scale: 0, rotation: -30 },
        {
          scale: 1, rotation: 0, duration: 0.7, delay: 0.2, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 83%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div
        ref={contentRef}
        className="max-w-xl mx-auto rounded-3xl text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fff 0%, #FFF0F5 60%, #F3E8FF 100%)',
          boxShadow: '0 20px 60px rgba(255,133,161,0.2)',
          border: '2px solid rgba(255,133,161,0.15)',
        }}
      >
        {/* Rainbow top bar */}
        <div className="h-2" style={{
          background: 'linear-gradient(90deg, #FF85A1, #C084FC, #7DD3FC, #86EFAC, #FDE68A)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 3s linear infinite',
        }} />

        <div className="px-8 py-10 sm:px-12">
          {/* Icon */}
          <div
            ref={iconRef}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg animate-float"
            style={{
              background: 'linear-gradient(135deg, #FF85A1, #C084FC)',
              boxShadow: '0 10px 30px rgba(255,133,161,0.5)',
            }}
          >
            <Mail className="w-10 h-10 text-white" />
          </div>

          <h2 className="section-title mb-3">
            <span className="text-gradient">Contacto</span> 💌
          </h2>

          <p className="text-base mb-8 font-semibold" style={{ color: '#7B5064' }}>
            Para colaboraciones, sponsors o lo que necesites:
          </p>

          {/* Email */}
          <a
            href="mailto:valentinavtt7@gmail.com"
            className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,133,161,0.12), rgba(192,132,252,0.12))',
              border: '2px solid rgba(255,133,161,0.3)',
              color: '#FF85A1',
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' });
            }}
          >
            <Mail className="w-5 h-5 flex-shrink-0" />
            <span className="break-all">valentinavtt7@gmail.com</span>
            <Send className="w-4 h-4 flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

          <p className="mt-8 text-sm font-semibold" style={{ color: '#A78BFA' }}>
            Respondo lo más pronto posible 🌸
          </p>
        </div>
      </div>
    </section>
  );
}
