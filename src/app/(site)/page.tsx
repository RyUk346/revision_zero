import Link from "next/link";
import { ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import RemoteImage from "@/components/ui/RemoteImage";
import HeroSlider from "@/components/site/HeroSlider";
import Icon from "@/components/ui/Icon";

export default async function HomePage() {
  const [settings, categories, featured, services, partners] = await Promise.all([
    getSettings(),
    prisma.projectCategory.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { projects: true } } },
    }),
    prisma.project.findMany({
      where: { featured: true, published: true },
      orderBy: { order: "asc" },
      take: 3,
      include: { category: true },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.partner.findMany({
      where: { published: true, category: "Software" },
      orderBy: { order: "asc" },
    }),
  ]);

  const heroImages = (settings.heroImages ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (heroImages.length === 0 && settings.heroImage) heroImages.push(settings.heroImage);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-steel-950 text-white">
        <HeroSlider images={heroImages} />
        {/* Lighter overlay so the hero image shows through, with a touch more
            shade on the left to keep the headline readable. */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-steel-950/65 via-steel-950/35 to-steel-900/10" />
        {/* Subtle top scrim purely for transparent-navbar legibility. */}
        <div className="absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="container-page relative z-10 pb-28 pt-32 md:pb-40 md:pt-48">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow !text-accent-400">{settings.tagline}</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] md:text-6xl">
              {settings.heroHeadline}
            </h1>
            <p className="mt-5 max-w-md text-xl text-steel-200">{settings.heroSubtext}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                View Our Projects <ArrowRight className="h-4 w-4" />
              </Link>
              {settings.brochureUrl ? (
                <a href={settings.brochureUrl} target="_blank" rel="noopener noreferrer" className="btn-light">
                  <Download className="h-4 w-4" /> Download Our E-Brochure
                </a>
              ) : (
                <Link href="/contact" className="btn-light">
                  <Download className="h-4 w-4" /> Request Our E-Brochure
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Welcome / About */}
      <section className="section">
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">About Us</p>
            <h2 className="text-3xl font-bold md:text-4xl">{settings.aboutTitle}</h2>
            <div className="prose-page mt-5">
              {settings.aboutText
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <Link href="/who-we-are" className="btn-dark mt-6">
              Meet The Team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <RemoteImage
            src={settings.aboutImage}
            alt="Revision Zero brochure"
            color="#34465e"
            label="Construction Modelling"
            ratio="aspect-[4/3]"
            rounded="rounded-2xl"
            imgClassName="object-contain p-6 bg-steel-50"
          />
        </div>
      </section>

      {/* Project categories */}
      <section className="section bg-steel-50">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">What We Do</p>
            <h2 className="text-3xl font-bold md:text-4xl">Sectors we detail</h2>
            <p className="mt-3 text-steel-600">
              From animation and visualisation to heavy industrial structures, explore the
              sectors we work across.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/projects/${c.slug}`}
                className="group relative block aspect-[16/11] overflow-hidden rounded-xl bg-steel-200 shadow-sm"
              >
                <RemoteImage
                  src={c.image}
                  alt={c.name}
                  color="#34465e"
                  label={c.name}
                  ratio="aspect-[16/11]"
                  rounded="rounded-none"
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <p className="text-sm text-steel-200">
                      {c._count.projects} project{c._count.projects === 1 ? "" : "s"}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Our Services</p>
            <h2 className="text-3xl font-bold md:text-4xl">More than detailing</h2>
            <p className="mt-3 text-steel-600">
              A complete offering from 3D construction modelling through to estimating,
              resource leasing and back-office support.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-steel-600">{s.summary}</p>
                <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="section bg-steel-50">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="eyebrow">Selected Work</p>
                <h2 className="text-3xl font-bold md:text-4xl">Featured projects</h2>
              </div>
              <Link href="/projects" className="btn-outline">
                All projects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((p) => (
                <Link key={p.id} href={`/projects/${p.category.slug}/${p.slug}`} className="card group overflow-hidden hover:shadow-md">
                  <RemoteImage
                    src={p.image}
                    alt={p.title}
                    color={p.imageColor}
                    label={p.category.name}
                    ratio="aspect-[16/10]"
                    rounded="rounded-none"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">{p.category.name}</p>
                    <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-steel-600">{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Software suppliers */}
      {partners.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="mb-8 text-center">
              <p className="eyebrow">Our Toolkit</p>
              <h2 className="text-2xl font-bold md:text-3xl">Software &amp; technology partners</h2>
            </div>
            <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
              {partners.map((p) =>
                p.logo ? (
                  <div key={p.id} className="flex h-20 items-center justify-center rounded-lg border border-steel-100 bg-white p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ) : (
                  <span key={p.id} className="flex h-20 items-center justify-center rounded-lg border border-steel-100 bg-white px-3 text-center text-sm font-semibold text-steel-600">
                    {p.name}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* It's in the detail */}
      <section className="relative overflow-hidden bg-steel-950 py-20 text-white">
        <div className="container-page relative text-center">
          <p className="eyebrow !text-accent-400">It&apos;s in the detail</p>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold md:text-4xl">
            Bridges to bus stations, hospitals to high rises, mines to materials handling.
          </h2>
          <p className="mt-4 text-lg text-steel-300">
            Or anything in between — let {settings.companyName} handle the details.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {["On time", "On budget", "Fully connected models"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 text-steel-200">
                <CheckCircle2 className="h-5 w-5 text-accent-400" /> {t}
              </span>
            ))}
          </div>
          <Link href="/schedule-a-call" className="btn-primary mt-8">
            Schedule A Call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
