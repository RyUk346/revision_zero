import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [s, accreditations] = await Promise.all([
    getSettings(),
    prisma.partner.findMany({
      where: { published: true, category: "Accreditation" },
      orderBy: { order: "asc" },
      select: { name: true, logo: true },
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        companyName={s.companyName}
        tagline={s.tagline}
        logo={s.logoDark}
        logoLight={s.logoLight}
      />
      <main className="flex-1">{children}</main>
      <Footer
        companyName={s.companyName}
        email={s.email}
        phone={s.phone}
        address={s.address}
        facebook={s.facebook}
        linkedin={s.linkedin}
        footerNote={s.footerNote}
        logo={s.logoLight}
        accreditations={accreditations}
      />
    </div>
  );
}
