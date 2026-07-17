/* ============================================================================
   EDIT YOUR CONTENT HERE.
   Everything on the page is generated from the objects below — you should
   not need to touch index.html or style.css just to update your info.
   ============================================================================ */

const PROFILE = {
  name: "Clayton Yen",
  initials: "CY",
  role: "Electrical engineer focused on analog circuit design",
  tagline:
    "Aspiring analog IC designer working across signal processing, " +
    "audio electronics, and motor control, from simulation to breadboard to" +
    " PCB.",
  resumeUrl: "resume.pdf", // put a resume.pdf next to index.html, or link elsewhere
  email: "claytonyen@.com",
  github: "https://github.com/claytonyen",
  linkedin: "https://linkedin.com/in/claytonyen",
  // add more links here if you want, e.g. twitter, personal blog, etc.
  extraLinks: [
    // { label: "Blog", url: "https://example.com" },
  ],
  contactBlurb:
    "Open to new roles and interesting collaborations — reach out any of these ways.",
};

const ABOUT = {
  bio:
    "I'm an electrical engineer who likes understanding a system from the " +
    "ground up. As a result, I gravitate towards projects where I can be" +
    " apart of the entire design process: designing, simulating, measuring," +
    " and most importantly improving. My hobbies include guitar, rock climbing" +
     " and documenting my outdoor adventures through photography.",
  facts: [
    { label: "Based in", value: "San Diego, CA" },
    { label: "Focus", value: "Analog electronics & IC design" },
    { label: "Education", value: "B.S. EE University of Illinois Urbana-Champaign 2028" },
    { label: "Currently", value: "Student" },
  ],
};

// Most recent first.
const EXPERIENCE = [
  {
    role: "PCB Designer",
    company: "Zephyr Boards",
    location: "Urbana, IL",
    start: "2025",
    end: "2026",
    bullets: [
      "Designed a three-phase current-sensing circuit for a BLDC motor controller, using bidirectional current-sense amplifiers and precision shunt resistors for closed-loop motor control.",
      "Optimized PCB component placement and routing, reducing board size ~10% to meet enclosure and cost constraints while preserving controlled-impedance signal integrity.",
      "Sourced and qualified pin-compatible replacement parts from alternate vendors when original components went obsolete, avoiding board respins and keeping the project on schedule.",
    ],
    tags: ["Altium", "PCB Design", "Motor Control", "Analog Circuit Design"],
  } // make sure to add a comma here once you add another experience
 // {
//    role: "Software Engineering Intern",
 //   company: "Earlier Company",
//    location: "New York, NY",
//    start: "2020",
//    end: "2020",
//    bullets: [
//      "Shipped a self-serve onboarding flow that reduced support tickets by 15%.",
//    ],
//    tags: ["React", "Python"],
//  },
  // Copy any block above, paste it here, and edit the fields to add another role.
];

const PROJECTS = [
  {
    title: "Gated Reverb & Distortion Electric Guitar Pedal",
    description:
      "Pedal that features customizable reverb and distortion levels, as well as toggleable gate feature.",
    tags: ["LTSpice", "Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/gated-reverb-distortion",
    featured: false,
  },
  {
    title: "Resistor Color Code Reader GUI",
    description:
      "User chooses band colors to get resistor value or inputs resistor value for band color. Streamlines breadboard prototyping.",
    tags: ["Python"],
    liveUrl: "", // add this
    repoUrl: "https://github.com/claytonyen/resistor-code-reader",
    featured: false,
  },
  {
    title: "Electra Distortion Electric Guitar Pedal",
    description:
      "Pedal that uses CE amplifier and diode clipping stage for distortion effect. Has multiple iterations with different clipping stages.",
    tags: ["LTSpice", "Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/electra-distortion-pedal",
    featured: false,
  },
  {
    title: "Chorus Electric Guitar Pedal",
    description:
      "Pedal that utilizes PT2399 IC to achieve chorus effect.",
    tags: ["LTSpice", "Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/chorus-pedal",
    featured: false,
   },
  // Copy any block above, paste it here, and edit the fields to add another project.
  // Leave liveUrl or repoUrl as "" to hide that link on the card.
];

const SKILLS = [
  { category: "Languages", items: ["Python", "C++", "LaTeX"] },
  { category: "Software", items: ["Altium Designer", "OnShape", "Adobe Lightroom", "Davinci Resolve"] },
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
