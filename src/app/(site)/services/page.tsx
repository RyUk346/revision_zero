import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Steel detailing, 3D construction modelling, model estimating, resource leasing, construction animation and document control.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="What We Offer"
        title="Services"
        subtitle="A complete construction modelling and steel detailing offering, plus the back-office support to keep projects moving."
        crumbs={[{ label: "Services" }]}
      />

      <section className="section">
        <div className="container-page space-y-12">
          {services.map((s, i) => (
            <article
              key={s.id}
              id={s.slug}
              className="grid scroll-mt-28 items-center gap-8 md:grid-cols-12"
            >
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div
                  className="flex aspect-[4/3] items-center justify-center rounded-2xl"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${s.imageColor}, ${s.imageColor}bb)`,
                  }}
                >
                  <Icon name={s.icon} className="h-20 w-20 text-white/90" />
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">{s.title}</h2>
                {s.summary && <p className="mt-2 text-lg text-steel-500">{s.summary}</p>}
                {s.description && <p className="prose-page mt-4">{s.description}</p>}
              </div>
            </article>
          ))}

          {services.length === 0 && (
            <p className="text-center text-steel-500">Services will be listed here soon.</p>
          )}
        </div>
      </section>

      <section className="border-t border-steel-100 bg-steel-50 py-14">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Not sure what you need?</h2>
          <p className="mt-2 text-steel-600">
            Tell us about your project and we&apos;ll recommend the right approach.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Contact us <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/schedule-a-call" className="btn-outline">Schedule a call</Link>
          </div>
        </div>
      </section>
    </>
  );
}
