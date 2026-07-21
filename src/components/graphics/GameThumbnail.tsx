import { cn } from "@/lib/cn";
import { getGameArt } from "@/lib/content/game-art";

type GameThumbnailProps = {
  slug: string;
  className?: string;
  size?: number;
};

/** Mini comic icon per game — unique shape per lesson topic. */
export function GameThumbnail({ slug, className, size = 48 }: GameThumbnailProps) {
  const art = getGameArt(slug);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="2" y="2" width="44" height="44" rx="6" fill={art.bg} stroke="#1a1a1a" strokeWidth="2.5" />
      <GameIcon slug={slug} accent={art.accent} />
    </svg>
  );
}

function GameIcon({ slug, accent }: { slug: string; accent: string }) {
  switch (slug) {
    case "what-is-a-neuron":
      return (
        <>
          <circle cx="24" cy="24" r="12" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          {[0, 72, 144, 216, 288].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={24 + Math.cos(r) * 12}
                y1={24 + Math.sin(r) * 12}
                x2={24 + Math.cos(r) * 18}
                y2={24 + Math.sin(r) * 18}
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </>
      );
    case "why-many-neurons":
      return (
        <>
          {[14, 24, 34].map((x, i) => (
            <circle key={i} cx={x} cy={24} r="8" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          ))}
          <line x1="6" y1="24" x2="10" y2="24" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="38" y1="24" x2="42" y2="24" stroke="#1a1a1a" strokeWidth="2" />
        </>
      );
    case "how-does-ai-guess":
      return (
        <>
          <rect x="10" y="14" width="28" height="20" rx="3" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
          <text x="24" y="28" textAnchor="middle" fill={accent} fontSize="12" fontWeight="800">?</text>
        </>
      );
    case "how-ai-learns":
      return (
        <>
          <path d="M12 32 L24 14 L36 32 Z" fill={accent} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
          <line x1="24" y1="20" x2="24" y2="26" stroke="#1a1a1a" strokeWidth="2" />
        </>
      );
    case "teach-with-examples":
      return (
        <>
          <rect x="10" y="12" width="14" height="14" rx="2" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          <rect x="24" y="12" width="14" height="14" rx="2" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
          <rect x="10" y="26" width="14" height="14" rx="2" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
          <rect x="24" y="26" width="14" height="14" rx="2" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
        </>
      );
    case "recognize-a-cat":
      return (
        <>
          <ellipse cx="24" cy="28" rx="14" ry="10" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          <polygon points="14,20 18,10 22,18" fill={accent} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="34,20 30,10 26,18" fill={accent} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="19" cy="26" r="2" fill="#1a1a1a" />
          <circle cx="29" cy="26" r="2" fill="#1a1a1a" />
        </>
      );
    case "when-ai-is-wrong":
      return (
        <>
          <circle cx="24" cy="24" r="14" fill="#ffd6d6" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="17" y1="17" x2="31" y2="31" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <line x1="31" y1="17" x2="17" y2="31" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "how-ai-reads-words":
      return (
        <>
          <text x="24" y="22" textAnchor="middle" fill={accent} fontSize="11" fontWeight="800">ABC</text>
          <line x1="12" y1="30" x2="36" y2="30" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="14" y1="34" x2="30" y2="34" stroke="#1a1a1a" strokeWidth="2" />
        </>
      );
    case "how-ai-pays-attention":
      return (
        <>
          <circle cx="24" cy="24" r="6" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={24 + Math.cos(r) * 10}
                y1={24 + Math.sin(r) * 10}
                x2={24 + Math.cos(r) * 16}
                y2={24 + Math.sin(r) * 16}
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </>
      );
    case "how-chatbots-work":
      return (
        <>
          <rect x="8" y="14" width="22" height="16" rx="4" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
          <polygon points="14,30 18,36 22,30" fill={accent} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="16" cy="22" r="2" fill="#fff" />
          <circle cx="22" cy="22" r="2" fill="#fff" />
        </>
      );
    default:
      return (
        <text x="24" y="28" textAnchor="middle" fill={accent} fontSize="14" fontWeight="800">
          ?
        </text>
      );
  }
}
