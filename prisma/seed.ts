import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Real media is referenced from the source site's public CDN. Project/team
// descriptions below are short, factual summaries written for this demo.
const RZ = "https://revision-zero.com/wp-content/uploads";

async function main() {
  console.log("Seeding database...");

  // --- Admin user -----------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@revisionzero.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Site Administrator";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, password: hashed },
    create: { email: adminEmail, name: adminName, password: hashed, role: "admin" },
  });
  console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);

  // --- Site settings --------------------------------------------------------
  const heroSlides = [
    `${RZ}/2018/01/Ichthys-Project-1920-GR.jpg`,
    `${RZ}/2017/12/Bridges.jpg`,
    `${RZ}/2017/12/Mining-Resources.jpg`,
    `${RZ}/2017/12/Commercial-Light-Industrial.jpg`,
  ].join("\n");

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    update: {
      heroImage: `${RZ}/2018/01/Ichthys-Project-1920-GR.jpg`,
      heroImages: heroSlides,
      logoDark: `${RZ}/2018/01/Revision-Zero-Logo-DK.png`,
      logoLight: `${RZ}/2018/01/Revision-Zero-Logo-LT.png`,
      aboutImage: `${RZ}/2022/11/revision-zero-brochure-mock-up-img-1.webp`,
      brochureUrl: `${RZ}/2024/05/Revision-Zero-Brochure.pdf`,
    },
    create: {
      id: "site",
      companyName: "Revision Zero",
      tagline: "Steel Detailers",
      heroHeadline: "Steel Detailers",
      heroSubtext: "Innovative. Focused. Collaborative.",
      heroImage: `${RZ}/2018/01/Ichthys-Project-1920-GR.jpg`,
      heroImages: heroSlides,
      logoDark: `${RZ}/2018/01/Revision-Zero-Logo-DK.png`,
      logoLight: `${RZ}/2018/01/Revision-Zero-Logo-LT.png`,
      aboutTitle: "Welcome to Revision Zero",
      aboutText:
        "At Revision Zero we prioritise customer intimacy and an unwavering commitment to quality in every aspect of our services. As a construction modelling and steel detailing company, we build strong relationships with our clients, understand their unique needs and deliver tailored solutions that exceed expectations.\n\nWith expertise in 3D construction modelling we provide personalised services that reduce risk, enhance performance and prioritise quality at every step. From mining and resources to commercial markets, we strive to deliver excellence on every project — backed by comprehensive support including model estimating, resource leasing, document control and construction animation.",
      aboutImage: `${RZ}/2022/11/revision-zero-brochure-mock-up-img-1.webp`,
      email: "info@revision-zero.com",
      phone: "+63 (2) 8650-3478",
      address: "Production Office, Manila, Philippines",
      facebook: "https://www.facebook.com/revisionzero/",
      linkedin: "https://www.linkedin.com/company/3526317/",
      brochureUrl: `${RZ}/2024/05/Revision-Zero-Brochure.pdf`,
      footerNote: "It's in the detail.",
    },
  });

  // --- Project categories ---------------------------------------------------
  const categories = [
    {
      slug: "animation",
      name: "Animation",
      description:
        "Dynamic construction sequence animations and walkthroughs that showcase our projects and methodology in detail.",
      image: `${RZ}/2022/11/TSB-UK-Horizontal_Revision2.png`,
      order: 1,
    },
    {
      slug: "mining-resources",
      name: "Mining & Resources",
      description:
        "Heavy structural detailing for processing plants, materials handling, conveyors and supporting infrastructure across the resources sector.",
      image: `${RZ}/2017/12/Mining-Resources.jpg`,
      order: 2,
    },
    {
      slug: "bridges",
      name: "Bridges",
      description:
        "Steel and composite bridge detailing, from pedestrian crossings to major highway and rail structures.",
      image: `${RZ}/2017/12/Bridges.jpg`,
      order: 3,
    },
    {
      slug: "commercial-light-industrial",
      name: "Commercial & Light Industrial",
      description:
        "Detailing for offices, retail, warehouses and light industrial facilities where speed and accuracy keep programmes on track.",
      image: `${RZ}/2017/12/Commercial-Light-Industrial.jpg`,
      order: 4,
    },
    {
      slug: "health-education",
      name: "Health & Education",
      description:
        "Detailing for hospitals, laboratories, schools and universities where complex services coordination is critical.",
      image: `${RZ}/2017/12/Health-Education.jpg`,
      order: 5,
    },
  ];

  const categoryRecords: Record<string, string> = {};
  for (const c of categories) {
    const rec = await prisma.projectCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image, order: c.order },
      create: c,
    });
    categoryRecords[c.slug] = rec.id;
  }

  // --- Projects (2 per category, real media) --------------------------------
  const projects = [
    // Animation (with video)
    {
      slug: "parramatta-railway-maintenance-facility",
      title: "Parramatta Railway Maintenance Facility",
      category: "animation",
      summary: "Construction sequence animation for a rail maintenance facility.",
      location: "Parramatta, NSW",
      year: "2022",
      image: `${RZ}/2022/11/TSB-UK-Horizontal_Revision2.png`,
      videoUrl: `${RZ}/2022/11/Parramatta-Maintenance-Facility-Animation_1.mp4`,
      imageColor: "#1b2533",
      featured: true,
      description:
        "A dynamic construction sequence animation produced for the Parramatta Railway Maintenance Facility, showcasing the build methodology in detail.",
    },
    {
      slug: "united-wambo-meeting",
      title: "United Wambo Meeting",
      category: "animation",
      summary: "Construction animation for the United Wambo project.",
      location: "Hunter Valley, NSW",
      year: "2022",
      image: `${RZ}/2022/04/Screenshot-2022-04-08-113437.png`,
      videoUrl: `${RZ}/2022/04/United-Wambo-_Construction_Revision2_1.mp4`,
      imageColor: "#34465e",
      description:
        "An engaging construction animation prepared for the United Wambo project, communicating sequencing and methodology to stakeholders.",
    },

    // Mining & Resources
    {
      slug: "prominent-hill-expansion",
      title: "Prominent Hill Expansion",
      category: "mining-resources",
      summary: "Structural detailing for a major South Australian mining expansion.",
      client: "BHP",
      location: "South Australia",
      year: "2025",
      image: `${RZ}/2026/06/model-image-1-6a22f87b34375.webp`,
      imageColor: "#3f5573",
      featured: true,
      description:
        "The Prominent Hill Expansion Project (PHOX) is a major mining development in South Australia, around 650 km north-west of Adelaide near Coober Pedy, managed by BHP.",
    },
    {
      slug: "dbct-rl4-reclaimer",
      title: "DBCT RL4 Reclaimer",
      category: "mining-resources",
      summary: "Reclaimer detailing for a major bulk coal export terminal.",
      location: "Port of Hay Point, QLD",
      year: "2025",
      image: `${RZ}/2026/06/internet-image-01-6a22f8370d0cc.jpg`,
      imageColor: "#2d3c50",
      description:
        "Dalrymple Bay Coal Terminal is a major bulk coal export terminal at the Port of Hay Point, Queensland, supporting the handling, storage, reclaiming and export of coal from the Bowen Basin.",
    },

    // Bridges
    {
      slug: "ballarat-station",
      title: "Ballarat Station",
      category: "bridges",
      summary: "Steel detailing for a key regional station upgrade.",
      location: "Ballarat, VIC",
      year: "2025",
      image: `${RZ}/2026/04/model-image-3-69d7e0de4a061.webp`,
      imageColor: "#34465e",
      featured: true,
      description:
        "Revision Zero completed the Ballarat Station upgrade in Q3 2025. Located on Lydiard Street North in central Ballarat, Victoria, the station is a key regional transport hub.",
    },
    {
      slug: "martinsville-bridge-228-girders",
      title: "Martinsville Bridge 228 Girders",
      category: "bridges",
      summary: "Girder detailing for a community infrastructure upgrade.",
      client: "City of Lake Macquarie",
      location: "Lake Macquarie, NSW",
      year: "2024",
      image: `${RZ}/2025/04/martinsville-bridge-228-girders-model-image-1-67f731ebac263.webp`,
      imageColor: "#516b8c",
      description:
        "In Q2 2024, Revision Zero delivered the Martinsville Bridge 228 Girders project for the City of Lake Macquarie, NSW — a small but vital infrastructure upgrade for the local community.",
    },

    // Commercial & Light Industrial
    {
      slug: "135-quinns-hill-rd-warehouse",
      title: "135 Quinns Hill Rd Warehouse",
      category: "commercial-light-industrial",
      summary: "Warehouse detailing in a major SE Queensland logistics precinct.",
      location: "Gilberton, QLD",
      year: "2025",
      image: `${RZ}/2026/06/model-images-01-6a22f7e48270a.webp`,
      imageColor: "#3f5573",
      description:
        "Located within the Yatala–Stapylton industrial precinct in South-East Queensland, a well-established logistics and manufacturing hub with direct access to the M1 Pacific Motorway.",
    },
    {
      slug: "405-bourke-street",
      title: "405 Bourke Street",
      category: "commercial-light-industrial",
      summary: "Premium-grade commercial tower in Melbourne's CBD.",
      location: "Melbourne, VIC",
      year: "2025",
      image: `${RZ}/2025/08/405-bourke-street-model-image-12-688ddc9a7b42c.webp`,
      imageColor: "#2d3c50",
      featured: true,
      description:
        "A premium-grade commercial tower in Melbourne's CBD delivering 66,000 m² of office space across 40 levels, achieving a 6 Star Green Star Design & As-Built rating.",
    },

    // Health & Education
    {
      slug: "the-forest-high-school-block-f",
      title: "The Forest High School Block F",
      category: "health-education",
      summary: "3D modelling and steel detailing for a school building.",
      location: "Frenchs Forest, Sydney",
      year: "2024",
      image: `${RZ}/2024/10/The-Forest-High-School-Block-F_Internet-Image-1.png`,
      imageColor: "#34465e",
      description:
        "In 2024, Revision Zero completed the Block F project at Forest High School in Frenchs Forest, Sydney — a public secondary school serving students from years 7 to 12.",
    },
    {
      slug: "wakefield-hospital",
      title: "Wakefield Hospital",
      category: "health-education",
      summary: "Steel detailing for a hospital development in Wellington.",
      location: "Wellington, NZ",
      year: "2020",
      image: `${RZ}/2023/11/Wakefield-Hospital_Internet-Image-1.jpg`,
      imageColor: "#516b8c",
      description:
        "Revision Zero completed the Wakefield Hospital project in early 2020, located in the Newtown suburb about 5 km south of Wellington's CBD on a spacious 2.2-hectare site.",
    },
  ];

  for (const [i, p] of projects.entries()) {
    const { category, ...rest } = p;
    const data = { ...rest, order: i, categoryId: categoryRecords[category] };
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }

  // --- Services -------------------------------------------------------------
  const services = [
    {
      slug: "steel-detailing",
      title: "Steel Detailing",
      icon: "Ruler",
      summary: "Fully connected fabrication and erection drawings for structures of any scale.",
      description:
        "We produce complete steel detailing packages including general arrangement drawings, shop drawings, assembly marking plans, bolt lists and CNC data — every model fully connected and checked so your fabricator and erector receive clean, buildable information.",
    },
    {
      slug: "3d-construction-modelling",
      title: "3D Construction Modelling",
      icon: "Box",
      summary: "Accurate 3D models that drive coordination, estimating and fabrication.",
      description:
        "Our 3D construction models become the single source of truth for a project, supporting clash detection, quantity extraction and downstream fabrication in industry-standard platforms.",
    },
    {
      slug: "model-estimating",
      title: "Model Estimating",
      icon: "Calculator",
      summary: "Fast, model-based quantities and estimates you can rely on.",
      description:
        "By estimating directly from a model we deliver fast, transparent and accurate quantities for tendering and budgeting, reducing risk and helping you win and plan work with confidence.",
    },
    {
      slug: "resource-leasing",
      title: "Resource Leasing",
      icon: "Users",
      summary: "Scale your detailing capacity up or down with dedicated detailers.",
      description:
        "Lease dedicated, experienced detailers who work as an extension of your own team — scaling capacity to match your pipeline without the overhead of permanent recruitment.",
    },
    {
      slug: "construction-animation",
      title: "Construction Animation",
      icon: "Clapperboard",
      summary: "4D animations that make complex build sequences easy to understand.",
      description:
        "We turn build programmes into clear construction sequence animations and walkthroughs, helping stakeholders understand methodology, sequencing and access at a glance.",
    },
    {
      slug: "document-control",
      title: "Document Control",
      icon: "FolderKanban",
      summary: "Structured back-office document control to keep projects organised.",
      description:
        "Our document control support keeps revisions, transmittals and approvals organised and auditable, so the right information reaches the right people at the right time.",
    },
  ];

  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, order: i },
      create: { ...s, order: i },
    });
  }

  // --- Team (real photos, short factual bios) -------------------------------
  const team = [
    { name: "Russell Neal", role: "Executive Director", image: `${RZ}/2024/05/Russell.jpg`,
      bio: "Founding partner with over four decades in boilermaking, steel fabrication and detailing, now guiding strategy from the board." },
    { name: "Paul Symes", role: "Non-Executive Director", image: `${RZ}/2024/05/Paul.jpg`,
      bio: "Director and business leader with a background in accounting, commercial law and construction modelling, leading governance and succession." },
    { name: "Rainer Lwin", role: "Chief Executive Officer", image: `${RZ}/2024/05/Rainer-crop.jpg`,
      bio: "Decades of fabrication, construction and shop-detailing experience across structural, mechanical and piping projects; a strong advocate for BIM-led planning." },
    { name: "Cora Canapi", role: "Chief Operating Officer", image: `${RZ}/2024/05/Cora.jpg`,
      bio: "Rose from junior detailer to COO, overseeing estimating, quality assurance and production across all projects." },
    { name: "Catherine Boo", role: "Chief Finance Officer", image: `${RZ}/2024/05/Catherine.jpg`,
      bio: "Former office manager turned CFO, leading budgeting, forecasting, reporting and risk management." },
    { name: "Jazmin Landicho", role: "Chief Technical Officer", image: `${RZ}/2024/05/Jazmin.jpg`,
      bio: "Started as an IT technician and now drives the company's technology strategy and innovation as CTO." },
    { name: "Maria Quilang", role: "Production Manager", image: `${RZ}/2024/05/Maria.jpg`,
      bio: "Progressed from junior detailer to Production Manager, championing balance, empowerment and continuous improvement." },
    { name: "Jelyd Acaba", role: "Estimating Manager", image: `${RZ}/2024/05/Jelyd.jpg`,
      bio: "Leads the estimating team, preparing quotes and appraising variations with a focus on fair value and accuracy." },
    { name: "Windell Marfil", role: "Project Manager", image: `${RZ}/2020/02/Windell-Marfil.jpg`,
      bio: "Experienced project manager and mentor who runs an in-house training programme toward national detailer certification." },
    { name: "Jay-Ar Villanueva", role: "Project Manager", image: `${RZ}/2021/05/jayar.jpg`,
      bio: "Project manager focused on client satisfaction, quality deliverables and meeting schedules." },
    { name: "Fregelito Maglalang", role: "Project Manager", image: `${RZ}/2022/07/fregelito-maglalang.jpg`,
      bio: "Project manager who rose from trainee detailer to lead, known for mentoring and integrity." },
    { name: "Lenilyn Nantes", role: "Project Manager", image: `${RZ}/2025/02/Lenilyn-Nantes.jpeg`,
      bio: "Civil engineer and project manager focused on delivering on time, on budget and to a high standard." },
  ];

  await prisma.teamMember.deleteMany({});
  for (const [i, m] of team.entries()) {
    await prisma.teamMember.create({ data: { ...m, order: i } });
  }

  // --- News (real thumbnails) ----------------------------------------------
  const news = [
    {
      slug: "introducing-our-new-executive-directors-russell-neal-paul-symes",
      title: "Introducing Our New Executive Directors – Russell Neal & Paul Symes",
      image: `${RZ}/2024/06/russel-neal-news-thumbnail-1.jpg`,
      date: "2024-06-04T10:00:00.000Z",
      excerpt:
        "We are pleased to introduce Russell Neal and Paul Symes as part of Revision Zero's new leadership structure.",
      content:
        "As part of our succession planning, we are proud to introduce Russell Neal and Paul Symes to the board. Together they bring decades of fabrication, detailing and business leadership experience to guide Revision Zero's next chapter.",
    },
    {
      slug: "partnership-announcement-rainer-lwin",
      title: "Partnership Announcement – Rainer Lwin",
      image: `${RZ}/2024/06/rainer-lwin-news-thumbnail.jpg`,
      date: "2024-06-04T09:00:00.000Z",
      excerpt: "We are delighted to announce Rainer Lwin as a partner at Revision Zero.",
      content:
        "We are delighted to welcome Rainer Lwin into partnership. With deep experience across structural, mechanical and piping projects, Rainer continues to drive our offshore detailing services and BIM-led delivery.",
    },
    {
      slug: "partnership-announcement-jazmin-landicho",
      title: "Partnership Announcement – Jazmin Landicho",
      image: `${RZ}/2024/06/jazmin-landicho-news-thumbnail.jpg`,
      date: "2024-06-04T08:00:00.000Z",
      excerpt: "We are proud to announce Jazmin Landicho as a partner at Revision Zero.",
      content:
        "We are proud to announce Jazmin Landicho's partnership. From IT technician to Chief Technical Officer, Jazmin's journey reflects our commitment to nurturing and empowering young talent.",
    },
    {
      slug: "partnership-announcement-cora-canapi",
      title: "Partnership Announcement – Cora Canapi",
      image: `${RZ}/2024/06/cora-canapi-news-thumbnail.jpg`,
      date: "2024-06-04T07:00:00.000Z",
      excerpt: "We are pleased to announce Cora Canapi as a partner at Revision Zero.",
      content:
        "We are pleased to announce Cora Canapi's partnership. Having risen from junior detailer to Chief Operating Officer, Cora oversees estimating, quality assurance and production across the business.",
    },
    {
      slug: "partnership-announcement-catherine-boo",
      title: "Partnership Announcement – Catherine Boo",
      image: `${RZ}/2024/06/catherine-boo-news-thumbnail.jpg`,
      date: "2024-06-04T06:00:00.000Z",
      excerpt: "We are happy to announce Catherine Boo as a partner at Revision Zero.",
      content:
        "We are happy to announce Catherine Boo's partnership. As Chief Finance Officer, Catherine leads budgeting, forecasting, reporting and risk management to support sustainable growth.",
    },
    {
      slug: "partnership-announcement",
      title: "Partnership Announcement",
      image: `${RZ}/2022/05/News-Thumbnail.jpg`,
      date: "2024-06-04T05:00:00.000Z",
      excerpt: "An exciting new chapter begins for Revision Zero with our partnership announcement.",
      content:
        "An exciting new chapter begins for Revision Zero. Our partnership announcement reflects our continued investment in people, leadership and long-term client relationships.",
    },
  ];

  for (const n of news) {
    const data = {
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      image: n.image,
      author: "Revision Zero",
      published: true,
      publishedAt: new Date(n.date),
    };
    await prisma.newsPost.upsert({ where: { slug: n.slug }, update: data, create: data });
  }

  // --- Partners / software suppliers + accreditations (real logos) ----------
  const partners = [
    { name: "Tekla Structures", category: "Software", logo: `${RZ}/2022/08/tekla-structures-logo-img.png` },
    { name: "Autodesk Advance Steel", category: "Software", logo: `${RZ}/2022/08/autodesk-advance-steel-logo-min.png` },
    { name: "Autodesk AutoCAD", category: "Software", logo: `${RZ}/2022/08/autodesk-autocad-logo-img.png` },
    { name: "Autodesk Revit", category: "Software", logo: `${RZ}/2022/08/autodesk-revit-logo.png` },
    { name: "Autodesk Navisworks", category: "Software", logo: `${RZ}/2022/08/autodesk-navisworks-logo-img.png` },
    { name: "Bluebeam Revu", category: "Software", logo: `${RZ}/2022/08/bluebeam-revu-logo-img.png` },
    { name: "AutoCAD Plant 3D", category: "Software", logo: `${RZ}/2022/08/autocad-plant-3d-logo-min.png` },
    { name: "Smartsheet", category: "Software", logo: `${RZ}/2022/08/smartsheet-logo.png` },
    { name: "BQE Core", category: "Software", logo: `${RZ}/2022/08/bqe-core-logo-min.png` },
    { name: "Microsoft", category: "Software", logo: `${RZ}/2022/08/microsoft-logo.png` },
    { name: "Dropbox", category: "Software", logo: `${RZ}/2022/08/dropbox-logo.png` },
    { name: "AISC", category: "Accreditation", logo: `${RZ}/2019/01/AISC-Logo.png` },
    { name: "NISD", category: "Accreditation", logo: `${RZ}/2018/04/NISD-Logo.png` },
    { name: "PCMA", category: "Accreditation", logo: `${RZ}/2022/07/pcma-logo-coloured.png` },
  ];

  await prisma.partner.deleteMany({});
  for (const [i, p] of partners.entries()) {
    await prisma.partner.create({ data: { ...p, order: i } });
  }

  // --- Careers --------------------------------------------------------------
  const jobs = [
    {
      slug: "senior-steel-detailer",
      title: "Senior Steel Detailer",
      location: "Manila, Philippines",
      type: "Full-time",
      department: "Production",
      summary: "Lead detailing on major structural projects and mentor junior detailers.",
      description:
        "We are looking for an experienced senior detailer to take ownership of detailing packages on significant structural and infrastructure projects, working closely with project managers and checkers to deliver fabrication-ready output.",
      requirements:
        "5+ years steel detailing experience; strong Tekla Structures skills; sound knowledge of connection detailing; excellent attention to detail; good written English.",
      order: 1,
    },
    {
      slug: "bim-modeller",
      title: "BIM Modeller",
      location: "Manila, Philippines",
      type: "Full-time",
      department: "Production",
      summary: "Build coordinated 3D models that drive detailing and estimating.",
      description:
        "Join our modelling team to produce accurate, well-structured 3D models used across coordination, estimating and fabrication.",
      requirements:
        "Experience with 3D modelling platforms; understanding of structural steel; ability to work to standards and deadlines.",
      order: 2,
    },
    {
      slug: "estimator",
      title: "Estimator",
      location: "Manila, Philippines",
      type: "Full-time",
      department: "Estimating",
      summary: "Prepare fast, accurate model-based estimates and quotes.",
      description:
        "Support our estimating team in preparing quotes and appraising project variations using model-based quantities.",
      requirements:
        "Background in steel detailing or estimating; strong numeracy; familiarity with model-based take-off is an advantage.",
      order: 3,
    },
  ];

  for (const j of jobs) {
    await prisma.jobPosting.upsert({ where: { slug: j.slug }, update: j, create: j });
  }

  // --- Sample inbound messages / calls so the admin isn't empty -------------
  if ((await prisma.contactSubmission.count()) === 0) {
    await prisma.contactSubmission.createMany({
      data: [
        {
          name: "Pat Lawson",
          email: "pat@example.com",
          company: "Lawson Fabrication",
          subject: "Detailing for a warehouse project",
          message:
            "Hi, we have a 12,000m2 portal frame warehouse coming up and would like a quote for detailing. Are you available next month?",
        },
        {
          name: "Jamie Okafor",
          email: "jamie@example.com",
          company: "Okafor Engineering",
          subject: "Bridge detailing capability",
          message:
            "Could you tell me more about your experience with composite bridge structures? We have a rail overpass in early planning.",
        },
      ],
    });
  }

  if ((await prisma.callRequest.count()) === 0) {
    await prisma.callRequest.create({
      data: {
        name: "Robin Shaw",
        email: "robin@example.com",
        company: "Shaw Constructions",
        preferredDate: "2026-06-20",
        preferredTime: "Morning",
        topic: "Resource leasing",
        message: "Keen to discuss leasing two detailers for a six month project.",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
