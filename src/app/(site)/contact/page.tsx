import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/lib/settings";
import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our steel detailing team. We'd love to hear about your project.",
};

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact us"
        subtitle="Tell us about your project — we'll get back to you quickly."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">Talk to us</h2>
            <p className="mt-3 text-steel-600">
              Whether you have a project in mind or just want to learn more about how we work,
              we&apos;re here to help.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-steel-900">Office</p>
                  <p className="text-steel-600">{s.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-steel-900">Phone</p>
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-steel-600 hover:text-accent-600">
                    {s.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-steel-900">Email</p>
                  <a href={`mailto:${s.email}`} className="text-steel-600 hover:text-accent-600">
                    {s.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-steel-900">Hours</p>
                  <p className="text-steel-600">Monday – Friday, 8:00am – 5:00pm</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold">Send a message</h2>
              <p className="mt-1 text-sm text-steel-500">Fields marked * are required.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
