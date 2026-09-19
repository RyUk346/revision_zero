import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { gradientPair } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  color = "#1b2533",
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  color?: string;
  crumbs?: Crumb[];
}) {
  const [from, to] = gradientPair(color);
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: `linear-gradient(120deg, ${from}, ${to})` }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="container-page relative py-16 md:py-24">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-400">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-steel-200">{subtitle}</p>
        )}
        {crumbs.length > 0 && (
          <nav className="mt-6 flex flex-wrap items-center gap-1 text-sm text-steel-300">
            <Link href="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">{c.label}</Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
