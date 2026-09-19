"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed background slideshow for the hero. Each slide crossfades in and
 * slowly zooms (Ken Burns). Auto-advances; clickable dots let you jump.
 * Renders behind the hero text (which lives in the page) — purely decorative.
 */
export default function HeroSlider({
  images,
  interval = 6000,
}: {
  images: string[];
  interval?: number;
}) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = images.filter(Boolean);

  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length, interval]);

  const go = (i: number) => {
    setActive(i);
    if (timer.current) {
      clearInterval(timer.current);
      if (slides.length > 1) {
        timer.current = setInterval(
          () => setActive((p) => (p + 1) % slides.length),
          interval
        );
      }
    }
  };

  if (slides.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {slides.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover ${
              i === active ? "animate-kenburns" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? "w-7 bg-accent-400" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
