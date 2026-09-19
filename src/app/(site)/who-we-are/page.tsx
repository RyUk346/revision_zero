import type { Metadata } from "next";
import { Linkedin, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import PageHeader from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Meet the team behind our steel detailing and construction modelling work — a blend of seasoned professionals and bright young talent.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function WhoWeArePage() {
  const [team, settings] = await Promise.all([
    prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title="The team behind the detail"
        subtitle="A diverse team blending fabrication, detailing, engineering and project management experience."
        crumbs={[{ label: "Who We Are" }]}
      />

      {/* Intro */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">The Team</p>
          <h2 className="text-3xl font-bold">Experience meets fresh thinking</h2>
          <div className="prose-page mt-4">
            <p>
              {settings.companyName} began with a small, highly experienced team and has grown
              steadily ever since — at times to well over one hundred dedicated professionals. We
              keep our clients&apos; loyalty through a steadfast commitment to excellent service and
              high-quality products.
            </p>
            <p>
              We blend the expertise of expatriate and local team members, creating a dynamic mix of
              seasoned professionals and bright young talent. That fusion of age and youth keeps us
              agile, innovative and well-equipped to meet our clients&apos; evolving needs.
            </p>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="section bg-steel-50 pt-0 md:pt-0">
        <div className="container-page">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <article key={m.id} className="card overflow-hidden">
                {m.image ? (
                  <div className="aspect-[4/3] overflow-hidden bg-steel-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div
                    className="flex aspect-[4/3] items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${m.imageColor}, ${m.imageColor}cc)`,
                    }}
                  >
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-3xl font-bold text-white ring-2 ring-white/30">
                      {initials(m.name)}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold">{m.name}</h3>
                  <p className="text-sm font-semibold text-accent-600">{m.role}</p>
                  {m.bio && <p className="mt-3 text-sm leading-relaxed text-steel-600">{m.bio}</p>}
                  <div className="mt-4 flex gap-3">
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-steel-100 text-steel-700 hover:bg-accent-500 hover:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        aria-label={`Email ${m.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-steel-100 text-steel-700 hover:bg-accent-500 hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {team.length === 0 && (
            <p className="text-center text-steel-500">Team members will appear here soon.</p>
          )}
        </div>
      </section>

      {/* Location note */}
      <section className="section">
        <div className="container-page max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Global delivery, local talent</h2>
          <p className="prose-page mt-4">
            We operate our production office in {settings.address}, leveraging an abundant local
            talent pool of detailers complemented by an expatriate senior executive team. This
            structure lets us provide cost-effective solutions without compromising quality,
            security or technical expertise — with seamless project management and complete
            transparency throughout.
          </p>
        </div>
      </section>
    </>
  );
}
