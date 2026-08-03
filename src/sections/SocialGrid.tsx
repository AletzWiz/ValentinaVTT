import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitch, Youtube, Instagram, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SocialItem {
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  emoji: string;
  url: string;
}

// TikTok SVG icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialItems: SocialItem[] = [
  {
    name: 'Twitch',
    description: 'En vivo y VODs',
    icon: Twitch,
    gradient: 'linear-gradient(135deg, #9146FF, #6B21D6)',
    glow: 'rgba(145,70,255,0.5)',
    emoji: '🎮',
    url: 'https://www.twitch.tv/valentinavtt',
  },
  {
    name: 'YouTube',
    description: 'Clips & highlights',
    icon: Youtube,
    gradient: 'linear-gradient(135deg, #FF5C5C, #CC0000)',
    glow: 'rgba(255,0,0,0.4)',
    emoji: '🎬',
    url: 'https://www.youtube.com/@valentinavtt',
  },
  {
    name: 'TikTok',
    description: 'Shorts diarios',
    icon: TikTokIcon,
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    glow: 'rgba(0,0,0,0.4)',
    emoji: '🎵',
    url: 'https://www.tiktok.com/@valentinavtt',
  },
  {
    name: 'Instagram',
    description: 'Fotos & stories',
    icon: Instagram,
    gradient: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
    glow: 'rgba(253,29,29,0.4)',
    emoji: '📸',
    url: 'https://www.instagram.com/valentinavtt/',
  },
  {
    name: 'Twitter / X',
    description: 'Tweets & anuncios',
    icon: Twitter,
    gradient: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
    glow: 'rgba(29,161,242,0.4)',
    emoji: '🐦',
    url: 'https://x.com/valentina_vtt',
  },
];

export default function SocialGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLAnchorElement | null)[]>([]);
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { scale: 0, opacity: 0, rotation: -8 + i * 3 },
          {
            scale: 1, opacity: 1, rotation: 0, duration: 0.55,
            delay: i * 0.1,
            ease: 'back.out(2.5)',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4">
      {/* Header */}
      <div ref={titleRef} className="text-center mb-12">
        <h2 className="section-title">
          Mis <span className="text-gradient">Redes Sociales</span> 🌸
        </h2>
        <p className="section-subtitle">Sígueme en todas mis plataformas</p>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {socialItems.map((item, index) => (
          <a
            key={item.name}
            ref={el => { cardsRef.current[index] = el; }}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center p-5 rounded-3xl text-white transition-all duration-300 overflow-hidden cursor-pointer"
            style={{
              background: item.gradient,
              boxShadow: `0 8px 30px ${item.glow}`,
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { y: -10, scale: 1.06, duration: 0.3, ease: 'back.out(2)' });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
            }}
          >
            {/* Shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 1.5s ease infinite',
              }}
            />

            {/* Emoji */}
            <span className="text-2xl mb-3 group-hover:animate-sparkle inline-block">{item.emoji}</span>

            {/* Icon */}
            <div className="mb-2 opacity-90">
              <item.icon className="w-8 h-8" />
            </div>

            {/* Labels */}
            <h3 className="font-extrabold text-sm text-center leading-tight">{item.name}</h3>
            <p className="text-xs opacity-75 text-center mt-0.5">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
