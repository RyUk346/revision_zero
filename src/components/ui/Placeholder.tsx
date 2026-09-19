import { gradientPair } from "@/lib/utils";

type PlaceholderProps = {
  /** Hex seed colour for the gradient. */
  color?: string;
  /** Optional label drawn over the gradient. */
  label?: string;
  /** Small caption under the label. */
  caption?: string;
  className?: string;
  /** Aspect ratio utility class, e.g. "aspect-[4/3]". */
  ratio?: string;
  rounded?: string;
};

/**
 * Lightweight placeholder "image". Renders a deterministic gradient with an
 * optional label so the build needs no external/binary image assets.
 */
export default function Placeholder({
  color = "#34465e",
  label,
  caption,
  className = "",
  ratio = "aspect-[4/3]",
  rounded = "rounded-lg",
}: PlaceholderProps) {
  const [from, to] = gradientPair(color);
  return (
    <div
      className={`relative ${ratio} ${rounded} overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
      role="img"
      aria-label={label || "Placeholder image"}
    >
      {/* subtle grid / blueprint texture */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {(label || caption) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          {label && (
            <span className="text-lg font-semibold text-white drop-shadow-sm">
              {label}
            </span>
          )}
          {caption && (
            <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/80">
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
