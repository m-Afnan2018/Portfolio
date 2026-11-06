/**
 * projects.ts — the single source of truth for every project on the site.
 *
 * To add a project: append an object to `projects` below, drop a 16:10 image
 * at /public/projects/<slug>.webp (and optionally a short muted loop at
 * /public/projects/<slug>.mp4) — nothing else needs to change.
 */

export type ProjectCategory =
  "Full Stack" | "Frontend" | "DevOps" | "Shopify" | "WordPress" | "Automation" | "Open Source";

export interface Project {
  slug: string;
  title: string;
  tagline: string; // one line
  description: string; // 2–4 sentences
  category: ProjectCategory[];
  stack: string[];
  highlights: string[]; // 2–4 bullet impact points
  image: string; // /projects/<slug>.webp (16:10)
  gallery?: string[]; // extra images for the modal
  video?: string; // optional short muted loop for hover preview
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean; // featured projects get the large card treatment
  year: number | string;
  codeSnippet?: { lang: string; code: string }; // shown on the "view source" flip side
  /** true for the seeded placeholders — they render a small TODO badge */
  placeholder?: boolean;
  /* ── case-study page (/work/<slug>) — all optional, the page falls back to
        description + highlights when these are missing ── */
  role?: string; // e.g. "Solo — design & full-stack build"
  challenge?: string; // the problem, in one or two sentences
  approach?: { title: string; body: string }[]; // what you built, step by step
  outcome?: string; // the result
}

export const projectCategories: ProjectCategory[] = [
  "Full Stack",
  "Frontend",
  "DevOps",
  "Shopify",
  "WordPress",
  "Automation",
  "Open Source",
];

export const projects: Project[] = [
  {
    slug: "studynotion",
    title: "StudyNotion",
    tagline: "An ed-tech marketplace where instructors sell courses and students learn.",
    description:
      "A full-stack MERN platform where instructors create, publish and manage courses and students buy them and learn from a personal dashboard. Access is split cleanly between students, instructors and admins, and payments run through Razorpay with webhook verification.",
    category: ["Full Stack"],
    stack: ["React", "Node.js", "Express", "MongoDB", "Razorpay"],
    highlights: [
      "Instructors create and manage courses; students buy and track them",
      "Role-based access across students, instructors and admins",
      "Razorpay payments verified via API + webhooks",
    ],
    image: "/projects/studynotion.webp",
    gallery: [
      "/projects/studynotion-1.webp",
      "/projects/studynotion-2.webp",
      "/projects/studynotion-3.webp",
      "/projects/studynotion-4.webp",
    ],
    liveUrl: "https://studynotion-edtech-project.vercel.app",
    // repos (StudyNotion-Frontend / -Backend) are private — make public to add repoUrl
    featured: true,
    year: 2024,
    role: "Solo — full-stack build",
    challenge:
      "Selling courses online means two very different users in one product: instructors who need to build and manage content, and students who need to pay for it and pick up where they left off.",
    approach: [
      {
        title: "Two dashboards, one platform",
        body: "Instructors get course builders with sections and lectures; students get their enrolled courses, progress and cart. Each role only ever sees what it's allowed to.",
      },
      {
        title: "Payments that can be trusted",
        body: "Razorpay checkout on the client, with the order confirmed server-side through the API and a webhook before a student is enrolled.",
      },
      {
        title: "A catalogue that scales",
        body: "Courses are grouped by category with ratings and pricing, so the catalogue stays browsable as instructors keep adding content.",
      },
    ],
    outcome:
      "A complete marketplace — auth, roles, payments and content management — built end to end on the MERN stack.",
  },
  {
    slug: "dynamic-gif-generator",
    title: "Dynamic GIF Generator",
    tagline: "Build, customise and share GIFs from templates — with real-time chat.",
    description:
      "A React app for creating and customising GIFs from templates and effects pulled from a public API. Users sign in with Google through Firebase Auth, and a real-time in-app chat lets them share creations while they build.",
    category: ["Full Stack", "Frontend"],
    stack: ["React", "Firebase", "Node.js", "Public API"],
    highlights: [
      "Template + effects pipeline for generating custom GIFs",
      "Firebase Authentication with Google sign-in",
      "Real-time in-app chat backed by Firebase",
    ],
    image: "/projects/dynamic-gif-generator.webp",
    gallery: [
      "/projects/dynamic-gif-generator-1.webp",
      "/projects/dynamic-gif-generator-2.webp",
      "/projects/dynamic-gif-generator-3.webp",
      "/projects/dynamic-gif-generator-4.webp",
    ],
    liveUrl: "https://dynamicgifgenerator.vercel.app",
    repoUrl: "https://github.com/m-Afnan2018/College-Minor-Project",
    featured: true,
    year: 2023,
    role: "Solo — design & full-stack build",
    challenge:
      "Making GIFs is usually lonely: build it, export it, send it somewhere else. The goal was a tool where people create from templates and share while they're still tweaking.",
    approach: [
      {
        title: "Template + effects pipeline",
        body: "Templates and effects come from a public API and are layered in the browser, so the preview updates the moment an option changes.",
      },
      {
        title: "One-click sign-in",
        body: "Firebase Authentication with Google: no passwords to manage, and every creation belongs to a real account.",
      },
      {
        title: "Chat beside the canvas",
        body: "A Firestore-backed room streams messages in real time, so friends can react while a GIF is still being made.",
      },
    ],
    outcome:
      "A small, complete product where auth, real-time data and a creative tool work together in one React app.",
    codeSnippet: {
      lang: "tsx",
      code: `// realtime chat — subscribe to the room
useEffect(() => {
  const q = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("createdAt", "asc"),
    limit(50),
  );
  return onSnapshot(q, (snap) =>
    setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}, [roomId]);`,
    },
  },
  {
    slug: "weather-app",
    title: "Weather App",
    tagline: "Real-time weather by location or search, installable as a PWA.",
    description:
      "A dependency-free weather app in vanilla JavaScript. It resolves the visitor's location (or a searched city), pulls live conditions from a public weather API and renders a responsive dashboard. A service worker and manifest make it installable as a Progressive Web App.",
    category: ["Frontend"],
    stack: ["HTML/CSS", "Vanilla JS", "Public API", "PWA"],
    highlights: [
      "Geolocation + city search with live conditions",
      "Fully responsive, zero frameworks",
      "Installable PWA with service-worker caching",
    ],
    image: "/projects/weather-app.webp",
    liveUrl: "https://afnan-weather-app.netlify.app",
    repoUrl: "https://github.com/m-Afnan2018/WeatherApp",
    featured: true,
    year: "2023–24",
    role: "Solo — design & build",
    challenge:
      "A weather app that opens instantly, works from where you are and installs like a native app — with zero frameworks and zero dependencies.",
    approach: [
      {
        title: "Location first",
        body: "The browser's geolocation finds you; a city search covers everyone else. Both feed the same fetch → render path.",
      },
      {
        title: "A dashboard without a framework",
        body: "Plain HTML, CSS and JavaScript render a responsive dashboard that feels at home on a phone or a 27-inch screen.",
      },
      {
        title: "Installable PWA",
        body: "A service worker caches the shell and a manifest makes it installable, so it launches like an app from the home screen.",
      },
    ],
    outcome: "Lightweight, installable and fast — proof that the platform alone goes a long way.",
    codeSnippet: {
      lang: "js",
      code: `// geolocate → fetch → render
navigator.geolocation.getCurrentPosition(async ({ coords }) => {
  const url = \`\${API}?lat=\${coords.latitude}&lon=\${coords.longitude}&units=metric\`;
  const res = await fetch(url);
  if (!res.ok) return showError(res.status);
  render(await res.json());
});`,
    },
  },
  {
    slug: "flawsome",
    title: "Flawsome",
    tagline: "E-commerce store for handloom and designer sarees.",
    description:
      "A full-stack e-commerce site for a saree brand: a catalogue of handloom, Madhubani, Kantha and wedding sarees with detailed product pages, search and filters by category, colour and price. Customers get accounts, wishlists, a cart and order history, with product imagery served through Cloudinary.",
    category: ["Full Stack"],
    stack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary"],
    highlights: [
      "Catalogue with search and filters by category, colour and price",
      "Accounts with addresses, wishlist, cart and order history",
      "Product media optimised and served through Cloudinary",
    ],
    image: "/projects/flawsome.webp",
    gallery: [
      "/projects/flawsome-1.webp",
      "/projects/flawsome-2.webp",
      "/projects/flawsome-3.webp",
      "/projects/flawsome-4.webp",
    ],
    // flawsome.in no longer resolves — add liveUrl back if the store comes online again
    repoUrl: "https://github.com/m-Afnan2018/Flawsome",
    featured: true,
    year: 2025,
    role: "Client project — full-stack build",
    challenge:
      "Sarees sell on detail — weave, fabric, colour — so the store had to show a large, image-heavy catalogue clearly and still feel fast.",
    approach: [
      {
        title: "Browse the way shoppers think",
        body: "Collections, a most-popular rail and filters by category, colour and price, so customers narrow hundreds of sarees down quickly.",
      },
      {
        title: "Images without the weight",
        body: "Product photos live on Cloudinary and are delivered resized and compressed, keeping product pages sharp and quick.",
      },
      {
        title: "A real customer account",
        body: "Profiles, saved addresses, wishlist, cart and orders — everything a returning shopper expects.",
      },
    ],
    outcome: "A complete storefront for the brand, from catalogue to checkout-ready cart.",
  },
  {
    slug: "om-tara-foundation",
    title: "Om Tara Foundation",
    tagline: "Website for an NGO working with underprivileged communities.",
    description:
      "The website for Om Tara Foundation, an NGO based in Samastipur, Bihar. It presents the foundation's mission, initiatives and events, shows its impact in numbers, and gives visitors a way to get in touch, volunteer or donate.",
    category: ["Frontend"],
    stack: ["HTML", "CSS", "JavaScript", "Express"],
    highlights: [
      "Mission, initiatives and events in one clear story",
      "Impact counters, contact form and newsletter sign-up",
      "Donation flow so supporters can give directly",
    ],
    image: "/projects/om-tara-foundation.webp",
    gallery: [
      "/projects/om-tara-foundation-1.webp",
      "/projects/om-tara-foundation-2.webp",
      "/projects/om-tara-foundation-3.webp",
      "/projects/om-tara-foundation-4.webp",
    ],
    liveUrl: "https://client-omega-cyan.vercel.app",
    repoUrl: "https://github.com/m-Afnan2018/client",
    year: 2025,
    role: "Client project at Namaste Tech Solutions",
    outcome:
      "A trustworthy online home for the foundation that turns visitors into volunteers and donors.",
  },
  {
    // TODO: replace with a real project
    slug: "todo-saas-dashboard",
    title: "TODO: SaaS Dashboard",
    tagline: "TODO: one-line tagline for a production Next.js app.",
    description:
      "TODO: describe a production Next.js + MongoDB app with auth, role-based access and payments. Two to four sentences on the problem, your role and the result.",
    category: ["Full Stack", "DevOps"],
    stack: ["Next.js", "MongoDB", "Docker", "Nginx"],
    highlights: ["TODO: impact point one", "TODO: impact point two"],
    image: "/projects/todo-saas-dashboard.webp",
    year: 2025,
    placeholder: true,
    codeSnippet: {
      lang: "ts",
      code: `// TODO: paste a snippet you're proud of
export const requireRole =
  (...roles: Role[]) => (req: Req, res: Res, next: Next) =>
    roles.includes(req.user.role) ? next() : res.status(403).end();`,
    },
  },
  {
    // TODO: replace with a real project
    slug: "todo-infra-pipeline",
    title: "TODO: Multi-site Infra",
    tagline: "TODO: Docker + Nginx + CI/CD for 20+ client sites.",
    description:
      "TODO: describe the infrastructure — how sites are containerised, routed through Nginx with Certbot SSL, and deployed by GitHub Actions to EC2/Lightsail/VPS.",
    category: ["DevOps"],
    stack: ["Docker Compose", "Nginx", "Certbot", "GitHub Actions", "AWS"],
    highlights: ["TODO: deploy time / uptime number", "TODO: sites managed"],
    image: "/projects/todo-infra-pipeline.webp",
    year: 2025,
    placeholder: true,
    codeSnippet: {
      lang: "yaml",
      code: `# TODO: your real workflow
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app:\${{ github.sha }} .`,
    },
  },
  {
    // TODO: replace with a real project
    slug: "todo-shopify-theme",
    title: "TODO: Shopify Theme",
    tagline: "TODO: custom Online Store 2.0 theme.",
    description: "TODO: describe the store, the custom sections you built and the outcome.",
    category: ["Shopify", "Frontend"],
    stack: ["Shopify Liquid", "JavaScript", "CSS"],
    highlights: ["TODO: impact point one", "TODO: impact point two"],
    image: "/projects/todo-shopify-theme.webp",
    year: 2025,
    placeholder: true,
  },
  {
    // TODO: replace with a real project
    slug: "todo-n8n-automation",
    title: "TODO: n8n Automation",
    tagline: "TODO: workflow automation for a client.",
    description: "TODO: describe what the workflow automates and the time it saves.",
    category: ["Automation"],
    stack: ["n8n", "Node.js", "Webhooks"],
    highlights: ["TODO: impact point one", "TODO: impact point two"],
    image: "/projects/todo-n8n-automation.webp",
    year: 2025,
    placeholder: true,
  },
  {
    slug: "kontest",
    title: "Kontest",
    tagline: "Open-source Chrome extension for programming-contest reminders.",
    description:
      "Kontest is an open-source Chrome extension that reminds competitive programmers about upcoming contests. I contributed API updates so contest data kept flowing after upstream changes.",
    category: ["Open Source"],
    stack: ["JavaScript", "Chrome Extension", "REST API"],
    highlights: ["Contributed API updates to keep contest data accurate"],
    image: "/projects/kontest.webp",
    // the merged contribution itself — the clearest proof for an OSS entry
    repoUrl: "https://github.com/AliOsm/kontests-browser-extension/pull/2",
    year: 2023,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
