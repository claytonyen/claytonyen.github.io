/* ============================================================================
   EDIT YOUR CONTENT HERE.
   Everything on the page is generated from the objects below — you should
   not need to touch index.html or style.css just to update your info.
   ============================================================================ */

const PROFILE = {
  name: "Ada Reyes",
  initials: "AR",
  role: "Backend-leaning software engineer",
  tagline:
    "I design and build systems that hold up under real load — APIs, " +
    "data pipelines, and the occasional weekend prototype that refuses " +
    "to stay a prototype.",
  resumeUrl: "resume.pdf", // put a resume.pdf next to index.html, or link elsewhere
  email: "hello@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  // add more links here if you want, e.g. twitter, personal blog, etc.
  extraLinks: [
    // { label: "Blog", url: "https://example.com" },
  ],
  contactBlurb:
    "Open to new roles and interesting collaborations — reach out any of these ways.",
};

const ABOUT = {
  bio:
    "I'm a software engineer who likes turning ambiguous problems into " +
    "systems with clear edges: predictable APIs, sane data models, and " +
    "dashboards nobody has to squint at. Outside of work I'm usually " +
    "deep in a side project, a climbing gym, or both.",
  facts: [
    { label: "Based in", value: "Remote / Los Angeles, CA" },
    { label: "Focus", value: "Backend systems, developer tooling" },
    { label: "Stack", value: "TypeScript, Go, Postgres, AWS" },
    { label: "Currently", value: "Building at Company Name" },
  ],
};

// Most recent first.
const EXPERIENCE = [
  {
    role: "Senior Software Engineer",
    company: "Company Name",
    location: "Remote",
    start: "2023",
    end: "Present",
    bullets: [
      "Led the redesign of the core billing pipeline, cutting invoice errors by 40%.",
      "Mentored two junior engineers and ran the team's weekly design reviews.",
      "Introduced integration tests that caught regressions before they hit prod.",
    ],
    tags: ["TypeScript", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    role: "Software Engineer",
    company: "Previous Company",
    location: "San Francisco, CA",
    start: "2021",
    end: "2023",
    bullets: [
      "Built the internal analytics API used by 4 downstream product teams.",
      "Migrated a legacy monolith service to a set of independently deployable services.",
    ],
    tags: ["Go", "Docker", "Kubernetes"],
  },
  {
    role: "Software Engineering Intern",
    company: "Earlier Company",
    location: "New York, NY",
    start: "2020",
    end: "2020",
    bullets: [
      "Shipped a self-serve onboarding flow that reduced support tickets by 15%.",
    ],
    tags: ["React", "Python"],
  },
  // Copy any block above, paste it here, and edit the fields to add another role.
];

const PROJECTS = [
  {
    title: "Project One",
    description:
      "A short, concrete description of what the project does and who it's for — one or two sentences is plenty.",
    tags: ["TypeScript", "Next.js", "Postgres"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/project-one",
    featured: true,
  },
  {
    title: "Project Two",
    description:
      "Same idea — say what it does, what problem it solves, and any interesting technical detail worth flagging.",
    tags: ["Go", "Redis"],
    liveUrl: "",
    repoUrl: "https://github.com/yourusername/project-two",
    featured: false,
  },
  {
    title: "Project Three",
    description:
      "A smaller tool, script, or experiment. Not everything needs a live demo — a repo link is enough.",
    tags: ["Python", "CLI"],
    liveUrl: "",
    repoUrl: "https://github.com/yourusername/project-three",
    featured: false,
  },
  // Copy any block above, paste it here, and edit the fields to add another project.
  // Leave liveUrl or repoUrl as "" to hide that link on the card.
];

const SKILLS = [
  { category: "Languages", items: ["TypeScript", "Go", "Python", "SQL"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "REST", "GraphQL"] },
  { category: "Infra", items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
];

/* ============================================================================
   RENDERING — you shouldn't need to edit anything below this line.
   ============================================================================ */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderHero() {
  document.getElementById("hero-name").textContent = PROFILE.name;
  document.getElementById("hero-role").textContent = PROFILE.role;
  document.getElementById("hero-tagline").textContent = PROFILE.tagline;
  document.getElementById("nav-mark").textContent = PROFILE.initials;
  document.getElementById("nav-resume").href = PROFILE.resumeUrl;
  document.title = `${PROFILE.name} — Portfolio`;
}

function renderAbout() {
  document.getElementById("about-bio").textContent = ABOUT.bio;
  const factsList = document.getElementById("about-facts");
  ABOUT.facts.forEach((fact) => {
    const row = el("div", "row");
    row.appendChild(el("dt", null, fact.label));
    row.appendChild(el("dd", null, fact.value));
    factsList.appendChild(row);
  });
}

function renderExperience() {
  const timeline = document.getElementById("timeline");
  EXPERIENCE.forEach((job) => {
    const item = el("li", "timeline-item reveal");

    const head = el("div", "ti-head");
    head.appendChild(el("span", "ti-role", job.role));
    head.appendChild(el("span", "ti-company", `· ${job.company}`));
    head.appendChild(el("span", "ti-dates", `${job.start} — ${job.end}`));
    item.appendChild(head);

    if (job.location) item.appendChild(el("div", "ti-location", job.location));

    if (job.bullets && job.bullets.length) {
      const bullets = el("ul", "ti-bullets");
      job.bullets.forEach((b) => bullets.appendChild(el("li", null, b)));
      item.appendChild(bullets);
    }

    if (job.tags && job.tags.length) {
      const tagRow = el("div", "tag-row");
      job.tags.forEach((t) => tagRow.appendChild(el("span", "tag", t)));
      item.appendChild(tagRow);
    }

    timeline.appendChild(item);
  });
}

function renderProjects() {
  const grid = document.getElementById("project-grid");
  PROJECTS.forEach((proj, i) => {
    const card = el("article", "project-card reveal");
    if (proj.featured) card.appendChild(el("span", "pc-featured", "FEATURED"));

    const head = el("div", "pc-head");
    head.appendChild(el("span", "pc-index mono", `NO. ${String(i + 1).padStart(2, "0")}`));
    card.appendChild(head);

    card.appendChild(el("h3", "pc-title", proj.title));
    card.appendChild(el("p", "pc-desc", proj.description));

    if (proj.tags && proj.tags.length) {
      const tagRow = el("div", "tag-row");
      proj.tags.forEach((t) => tagRow.appendChild(el("span", "tag", t)));
      card.appendChild(tagRow);
    }

    const links = el("div", "pc-links");
    if (proj.liveUrl) {
      const a = el("a", null, "Live ↗");
      a.href = proj.liveUrl; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    }
    if (proj.repoUrl) {
      const a = el("a", null, "Code ↗");
      a.href = proj.repoUrl; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    }
    if (links.children.length) card.appendChild(links);

    grid.appendChild(card);
  });
}

function renderSkills() {
  const grid = document.getElementById("skills-grid");
  SKILLS.forEach((group) => {
    const wrap = el("div", "skill-group reveal");
    wrap.appendChild(el("h3", null, group.category));
    const list = el("ul", "skill-items");
    group.items.forEach((item) => list.appendChild(el("li", null, item)));
    wrap.appendChild(list);
    grid.appendChild(wrap);
  });
}

function renderContact() {
  document.getElementById("tb-name").textContent = PROFILE.name;
  document.getElementById("tb-year").textContent = new Date().getFullYear();
  document.getElementById("contact-blurb").textContent = PROFILE.contactBlurb;

  const linksList = document.getElementById("contact-links");
  const baseLinks = [
    { label: `Email — ${PROFILE.email}`, url: `mailto:${PROFILE.email}` },
    { label: "GitHub ↗", url: PROFILE.github },
    { label: "LinkedIn ↗", url: PROFILE.linkedin },
    ...(PROFILE.extraLinks || []),
  ];
  baseLinks.forEach((link) => {
    if (!link.url) return;
    const li = el("li");
    const a = el("a", null, link.label);
    a.href = link.url;
    if (link.url.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    li.appendChild(a);
    linksList.appendChild(li);
  });
}

function setupScrollReveal() {
  const revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealables.forEach((n) => n.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealables.forEach((n) => observer.observe(n));
}

function init() {
  renderHero();
  renderAbout();
  renderExperience();
  renderProjects();
  renderSkills();
  renderContact();
  setupScrollReveal();
}

document.addEventListener("DOMContentLoaded", init);
