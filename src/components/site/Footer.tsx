import Link from "next/link";
import { Facebook, Linkedin, Phone, Mail, MapPin } from "lucide-react";

type FooterProps = {
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string | null;
  linkedin?: string | null;
  footerNote?: string;
  logo?: string | null;
  accreditations?: { name: string; logo: string | null }[];
};

export default function Footer({
  companyName = "Revision Zero",
  email = "info@revisionzero.local",
  phone = "+63 (2) 8650-3478",
  address = "Manila, Philippines",
  facebook,
  linkedin,
  footerNote = "It's in the detail.",
  logo,
  accreditations = [],
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-steel-950 text-steel-300">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              On time and on budget, no matter the project.
            </h2>
            <p className="mt-2 text-steel-400">
              Bridges to bus stations, hospitals to high rises. Let {companyName}{" "}
              handle the details.
            </p>
          </div>
          <Link href="/schedule-a-call" className="btn-primary shrink-0">
            Schedule A Call
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={companyName} className="h-12 w-auto" />
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded bg-white font-display text-lg font-extrabold text-steel-900">
                  R0
                </span>
                <span className="font-display text-lg font-extrabold text-white">
                  {companyName}
                </span>
              </>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-steel-400">
            {footerNote}
          </p>
          <div className="mt-5 flex gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent-500"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent-500"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/who-we-are" className="hover:text-accent-400">Who We Are</Link></li>
            <li><Link href="/projects" className="hover:text-accent-400">Projects</Link></li>
            <li><Link href="/services" className="hover:text-accent-400">Services</Link></li>
            <li><Link href="/news" className="hover:text-accent-400">News</Link></li>
            <li><Link href="/careers" className="hover:text-accent-400">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Legal
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-accent-400">Contact</Link></li>
            <li><Link href="/terms-of-use" className="hover:text-accent-400">Terms of Use</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-accent-400">Privacy Policy</Link></li>
            <li><Link href="/sitemap" className="hover:text-accent-400">Sitemap</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent-400" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent-400">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent-400" />
              <a href={`mailto:${email}`} className="hover:text-accent-400">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {accreditations.length > 0 && (
        <div className="border-t border-white/10">
          <div className="container-page flex flex-wrap items-center justify-center gap-8 py-8">
            {accreditations.map((a) =>
              a.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={a.name}
                  src={a.logo}
                  alt={a.name}
                  className="h-14 w-auto opacity-90"
                />
              ) : null
            )}
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-steel-500 md:flex-row">
          <p>© {year} {companyName}. All rights reserved.</p>
          <p>
            Demo clone built with Next.js, Tailwind CSS, Prisma & NextAuth.
          </p>
        </div>
      </div>
    </footer>
  );
}
