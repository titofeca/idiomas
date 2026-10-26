import React from 'react';

interface MangaAvatarProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MangaAvatar: React.FC<MangaAvatarProps> = ({ id, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (id === 'kenji') {
    // ⚡ Kenji: Shonen Anime Gamer Hero with Headset & Spiky Hair
    return (
      <div className={`${currentSize} relative rounded-2xl overflow-hidden shrink-0 shadow-md ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="kenjiBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="kenjiHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <rect width="100" height="100" fill="url(#kenjiBg)" />
          {/* Lightning backdrop bolts */}
          <path d="M75 10 L65 30 L80 30 L60 60 L70 38 L55 38 Z" fill="#ffffff" opacity="0.3" />
          
          {/* Gamer Headphones headband */}
          <path d="M 22 45 A 28 28 0 0 1 78 45" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* Headphone earcups */}
          <rect x="18" y="42" width="10" height="20" rx="5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
          <rect x="72" y="42" width="10" height="20" rx="5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />

          {/* Neck & Hoodie */}
          <path d="M 40 75 L 60 75 L 65 100 L 35 100 Z" fill="#fed7aa" />
          <path d="M 25 82 Q 50 72 75 82 L 85 100 L 15 100 Z" fill="#0f172a" />
          <path d="M 40 82 L 50 96 L 60 82 Z" fill="#f97316" />

          {/* Face */}
          <path d="M 30 45 Q 50 82 70 45 Z" fill="#ffedd5" />
          <ellipse cx="50" cy="52" rx="19" ry="18" fill="#ffedd5" />

          {/* Spiky Anime Hair */}
          <path d="M 24 45 L 18 32 L 28 35 L 30 18 L 42 28 L 50 14 L 62 26 L 70 16 L 72 32 L 82 30 L 76 46 Q 50 24 24 45 Z" fill="url(#kenjiHair)" />
          {/* Forehead fringe */}
          <path d="M 32 40 L 40 48 L 46 38 L 54 48 L 62 38 L 68 45 Q 50 32 32 40 Z" fill="#d97706" />

          {/* Anime Eyes */}
          {/* Left Eye */}
          <ellipse cx="42" cy="52" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="43" cy="50.5" r="1.8" fill="#ffffff" />
          <path d="M 36 46 Q 42 43 47 46" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

          {/* Right Eye */}
          <ellipse cx="58" cy="52" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="59" cy="50.5" r="1.8" fill="#ffffff" />
          <path d="M 53 46 Q 58 43 64 46" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

          {/* Cheerful anime mouth grin */}
          <path d="M 44 62 Q 50 67 56 62" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          {/* Cheek blush */}
          <ellipse cx="36" cy="58" rx="3" ry="1.5" fill="#f87171" opacity="0.6" />
          <ellipse cx="64" cy="58" rx="3" ry="1.5" fill="#f87171" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (id === 'ren') {
    // 🦊 Ren: Kitsune Anime Sensei with Fox Ears & Sacred Markings
    return (
      <div className={`${currentSize} relative rounded-2xl overflow-hidden shrink-0 shadow-md ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="renBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="renHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#renBg)" />
          {/* Magical sparkle stars */}
          <polygon points="80,15 82,22 89,22 83,26 85,33 80,28 75,33 77,26 71,22 78,22" fill="#facc15" opacity="0.6" />
          <polygon points="20,20 21,25 26,25 22,28 23,33 20,30 17,33 18,28 14,25 19,25" fill="#facc15" opacity="0.4" />

          {/* Fox Ears */}
          {/* Left ear */}
          <polygon points="20,40 32,10 44,35" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
          <polygon points="24,36 32,18 40,32" fill="#f43f5e" />
          {/* Right ear */}
          <polygon points="80,40 68,10 56,35" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
          <polygon points="76,36 68,18 60,32" fill="#f43f5e" />

          {/* Kimono Robe */}
          <path d="M 20 85 L 50 78 L 80 85 L 88 100 L 12 100 Z" fill="#ffffff" />
          <path d="M 42 78 L 50 100 L 58 78 Z" fill="#e11d48" />

          {/* Face */}
          <ellipse cx="50" cy="54" rx="19" ry="18" fill="#fff1f2" />

          {/* Soft Hair */}
          <path d="M 28 44 Q 50 26 72 44 Q 50 36 28 44 Z" fill="url(#renHair)" />
          <path d="M 32 42 L 36 56 L 42 45 L 50 54 L 58 45 L 64 56 L 68 42 Z" fill="#e0e7ff" />

          {/* Kitsune Red Eye Markings */}
          <path d="M 34 50 Q 38 46 45 49" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 66 50 Q 62 46 55 49" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyes (Smiling closed curved anime eyes) */}
          <path d="M 37 54 Q 42 58 47 54" fill="none" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 53 54 Q 58 58 63 54" fill="none" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cute mouth */}
          <path d="M 47 64 Q 50 67 53 64" fill="none" stroke="#be123c" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (id === 'long') {
    // 🐉 Maestro Long: Wise Chinese Dragon Master
    return (
      <div className={`${currentSize} relative rounded-2xl overflow-hidden shrink-0 shadow-md ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="longBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="dragonHorns" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#longBg)" />

          {/* Dragon Antlers / Horns */}
          <path d="M 32 30 Q 24 18 16 16 Q 22 24 28 34" fill="url(#dragonHorns)" stroke="#78350f" strokeWidth="1" />
          <path d="M 68 30 Q 76 18 84 16 Q 78 24 72 34" fill="url(#dragonHorns)" stroke="#78350f" strokeWidth="1" />

          {/* Traditional Hanfu Robe */}
          <path d="M 22 84 L 50 76 L 78 84 L 88 100 L 12 100 Z" fill="#991b1b" />
          <path d="M 38 78 L 50 100 L 62 78 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />

          {/* Face */}
          <ellipse cx="50" cy="54" rx="19" ry="18" fill="#fef3c7" />

          {/* Topknot with Jade Hairpin */}
          <circle cx="50" cy="22" r="8" fill="#1c1917" />
          <line x1="38" y1="20" x2="62" y2="24" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {/* Hair & Beard */}
          <path d="M 30 42 Q 50 32 70 42 L 72 50 L 68 46 L 64 52 Q 50 44 36 52 L 32 46 Z" fill="#1c1917" />
          {/* Whiskers */}
          <path d="M 36 60 Q 20 62 14 74" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d="M 64 60 Q 80 62 86 74" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Goatee */}
          <path d="M 47 67 Q 50 82 53 67 Z" fill="#ffffff" />

          {/* Eyes (Wise martial artist gaze) */}
          <ellipse cx="41" cy="52" rx="4" ry="4" fill="#1c1917" />
          <circle cx="42" cy="50.5" r="1.5" fill="#ffffff" />
          <path d="M 35 46 L 47 48" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

          <ellipse cx="59" cy="52" rx="4" ry="4" fill="#1c1917" />
          <circle cx="60" cy="50.5" r="1.5" fill="#ffffff" />
          <path d="M 53 48 L 65 46" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (id === 'arthur') {
    // 🎩 Sir Arthur: London Gentleman with Top Hat & Monocle
    return (
      <div className={`${currentSize} relative rounded-2xl overflow-hidden shrink-0 shadow-md ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="arthurBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#arthurBg)" />

          {/* Suit and Tie */}
          <path d="M 22 84 L 50 78 L 78 84 L 88 100 L 12 100 Z" fill="#0f172a" />
          <path d="M 44 80 L 50 100 L 56 80 Z" fill="#ffffff" />
          <polygon points="46,84 54,84 50,90" fill="#dc2626" />

          {/* Face */}
          <ellipse cx="50" cy="56" rx="19" ry="18" fill="#fef2f2" />

          {/* Top Hat */}
          <ellipse cx="50" cy="38" rx="28" ry="6" fill="#1e293b" />
          <path d="M 30 38 L 33 12 L 67 12 L 70 38 Z" fill="#0f172a" />
          <rect x="31" y="32" width="38" height="5" fill="#dc2626" />

          {/* Hair sides */}
          <path d="M 28 50 Q 30 62 34 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 72 50 Q 70 62 66 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Eyes & Monocle */}
          {/* Left Eye */}
          <circle cx="41" cy="54" r="3.5" fill="#0f172a" />
          <path d="M 36 49 Q 41 46 46 49" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Right Eye with Monocle */}
          <circle cx="59" cy="54" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="59" cy="54" r="3.5" fill="#0f172a" />
          <path d="M 67 54 Q 74 62 76 74" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

          {/* British Moustache */}
          <path d="M 50 63 Q 42 59 36 63 Q 44 67 50 64 Q 56 67 64 63 Q 58 59 50 63 Z" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // 🌸 Mei: Cheerful Anime Girl with Pink Ribbons
  return (
    <div className={`${currentSize} relative rounded-2xl overflow-hidden shrink-0 shadow-md ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="meiBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <linearGradient id="meiHair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#meiBg)" />

        {/* Hair Ribbons */}
        <circle cx="24" cy="32" r="7" fill="#fbbf24" />
        <circle cx="76" cy="32" r="7" fill="#fbbf24" />

        {/* Sailor Uniform */}
        <path d="M 25 82 Q 50 72 75 82 L 85 100 L 15 100 Z" fill="#1e3a8a" />
        <polygon points="44,80 56,80 50,92" fill="#ef4444" />

        {/* Face */}
        <ellipse cx="50" cy="52" rx="19" ry="18" fill="#fff1f2" />

        {/* Anime Hair Twin Bangs */}
        <path d="M 26 44 L 20 64 L 32 50 L 38 60 L 44 42 L 50 56 L 56 42 L 62 60 L 68 50 L 80 64 L 74 44 Q 50 24 26 44 Z" fill="url(#meiHair)" />

        {/* Sparkling Big Anime Eyes */}
        <ellipse cx="41" cy="52" rx="5" ry="6.5" fill="#881337" />
        <ellipse cx="41" cy="53" rx="4" ry="5.5" fill="#e11d48" />
        <circle cx="40" cy="50" r="2" fill="#ffffff" />
        <circle cx="43" cy="54" r="1" fill="#ffffff" />

        <ellipse cx="59" cy="52" rx="5" ry="6.5" fill="#881337" />
        <ellipse cx="59" cy="53" rx="4" ry="5.5" fill="#e11d48" />
        <circle cx="58" cy="50" r="2" fill="#ffffff" />
        <circle cx="61" cy="54" r="1" fill="#ffffff" />

        {/* Cheerful Smile */}
        <path d="M 46 64 Q 50 68 54 64" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />

        {/* Rosy Blushes */}
        <ellipse cx="34" cy="58" rx="3.5" ry="2" fill="#fb7185" opacity="0.7" />
        <ellipse cx="66" cy="58" rx="3.5" ry="2" fill="#fb7185" opacity="0.7" />
      </svg>
    </div>
  );
};
