"use client";

import { useState } from "react";
import ProjectCard, { type CardProject } from "@/components/site/ProjectCard";

export type ExplorerProject = CardProject & { id: string };

export type ExplorerCategory = { id: string; name: string; slug: string };

export default function ProjectsExplorer({
  categories,
  projects,
}: {
  categories: ExplorerCategory[];
  projects: ExplorerProject[];
}) {
  const [active, setActive] = useState<string>("all");

  const tabs = [{ name: "All", slug: "all" }, ...categories];
  const visible =
    active === "all" ? projects : projects.filter((p) => p.categorySlug === active);

  return (
    <div>
      {/* Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const isActive = active === t.slug;
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActive(t.slug)}
              aria-pressed={isActive}
              className={`rounded border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? "border-steel-900 bg-steel-900 text-white"
                  : "border-steel-200 bg-white text-steel-700 hover:border-steel-400 hover:text-steel-900"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-center text-steel-500">No projects in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
