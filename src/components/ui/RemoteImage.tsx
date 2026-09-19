import { gradientPair } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  /** Fallback gradient seed colour when no src. */
  color?: string;
  /** Fallback label drawn over the gradient. */
  label?: string;
  ratio?: string;
  rounded?: string;
  className?: string;
  imgClassName?: string;
  /** Dark overlay (e.g. "bg-black/30") for text legibility. */
  overlay?: string;
};

/**
 * Renders a real image (plain <img>, works with any external host) inside an
 * aspect-ratio box. Falls back to a deterministic gradient when no src is set,
 * so the site still looks complete before images are added.
 */
export default function RemoteImage({
  src,
  alt,
  color = "#34465e",
  label,
  ratio = "aspect-[4/3]",
  rounded = "rounded-lg",
  className = "",
  imgClassName = "object-cover",
  overlay,
}: Props) {
  if (!src) {
    const [from, to] = gradientPair(color);
    return (
      <div
        className={`relative ${ratio} ${rounded} overflow-hidden ${className}`}
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        role="img"
        aria-label={label || alt}
      >
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {label && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <span className="text-lg font-semibold text-white drop-shadow-sm">{label}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${ratio} ${rounded} overflow-hidden bg-steel-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full ${imgClassName}`}
      />
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
    </div>
  );
}
