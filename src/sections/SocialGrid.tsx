import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitch, Youtube, Instagram, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SocialItem {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  hoverColor: string;
  url: string;
}

const socialItems: SocialItem[] = [
  {
    name: 'Twitch',
    description: 'En vivo y VODs',
    icon: Twitch,
    color: 'bg-[#9146FF]',
    hoverColor: 'hover:bg-[#7B3FD1]',
    url: 'https://www.twitch.tv/valentinavtt',
  },
  {
    name: 'YouTube',
    description: 'Clips y highlights',
    icon: Youtube,
    color: 'bg-[#FF0000]',
    hoverColor: 'hover:bg-[#CC0000]',
    url: 'https://www.youtube.com/@valentinavtt',
  },
  {
    name: 'TikTok',
    description: 'Shorts diarios',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
    url: 'https://www.tiktok.com/@valentinavtt',
  },
  {
    name: 'Instagram',
    description: 'Fotos y stories',
    icon: Instagram,
    color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
    hoverColor: 'hover:opacity-90',
    url: 'https://www.instagram.com/valentinavtt/',
  },
  {
    name: 'X (Twitter)',
    description: 'Tweets y anuncios',
    icon: Twitter,
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
    url: 'https://x.com/valentina_vtt',
  },
];

export default function SocialGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'back.out(2)',
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
          Mis redes
        </h2>
        <p className="text-gray-500">Sígueme en todas mis plataformas</p>
      </div>

      {/* Social Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {socialItems.map((item, index) => (
          <a
            key={item.name}
            ref={(el) => { cardsRef.current[index] = el; }}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-6 rounded-2xl ${item.color} ${item.hoverColor} text-white transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden`}
          >
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-3 transform group-hover:rotate-[360deg] transition-transform duration-500">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-sm mb-1">{item.name}</h3>
              <p className="text-xs opacity-80">{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
