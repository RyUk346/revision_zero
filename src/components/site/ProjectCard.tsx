import Link from "next/link";
import { ZoomIn, Play } from "lucide-react";
import { gradientPair } from "@/lib/utils";

export type CardProject = {
  title: string;
  slug: string;
  image: string | null;
  videoUrl?: string | null;
  imageColor: string;
  categorySlug: string;
  categoryName: string;
};

/**
 * Presentational project card used on the projects explorer and category pages.
 * No client hooks, so it works in both server and client components.
 * Clicking opens the individual project detail page.
 */
export default function ProjectCard({ project }: { project: CardProject }) {
  const [from, to] = gradientPair(project.imageColor);
  const href = `/projects/${project.categorySlug}/${project.slug}`;

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-steel-100 shadow-sm"
    >
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        />
      )}

      {/* scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/45" />

      {/* video badge */}
      {project.videoUrl && (
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent-700 shadow">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}

      {/* centered caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-lg font-bold leading-snug text-white drop-shadow-sm">
          {project.title}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
          {project.categoryName}
        </p>
        <span className="mt-3 flex h-10 w-10 translate-y-1 items-center justify-center rounded bg-accent-600 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ZoomIn className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
