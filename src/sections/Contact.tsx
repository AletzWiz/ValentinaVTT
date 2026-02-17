import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div
        ref={contentRef}
        className="max-w-xl mx-auto text-center"
      >
        {/* Envelope Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center animate-float">
          <Mail className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
          Contacto
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6">
          Contáctame para colaborar:
        </p>

        {/* Email Link */}
        <a
          ref={emailRef}
          href="mailto:valentinavtt7@gmail.com"
          className="group inline-flex items-center gap-3 text-xl sm:text-2xl font-bold text-pink-500 hover:text-pink-600 transition-colors relative"
        >
          <span className="relative">
            valentinavtt7@gmail.com
            {/* Wavy underline */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 opacity-0 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0 6 Q 12.5 0, 25 6 T 50 6 T 75 6 T 100 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-pulse"
              />
            </svg>
          </span>
          <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>

        {/* Additional info */}
        <p className="mt-8 text-sm text-gray-400">
          Respondo lo más pronto posible 💌
        </p>
      </div>
    </section>
  );
}
