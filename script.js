/* ============================================================================
   EDIT YOUR CONTENT HERE.
   Everything on the page is generated from the objects below — you should
   not need to touch index.html or style.css just to update your info.
   ============================================================================ */

const PROFILE = {
  name: "Clayton Yen",
  initials: "CY",
  tagline:
    "Aspiring IC designer working across signal processing, audio electronics," +
    " and motor control, from simulation to breadboard to PCB.",
  resumeUrl: "resume.pdf",
  email: "claytonyen@gmail.com",
  github: "https://github.com/claytonyen",
  linkedin: "https://linkedin.com/in/claytonyen",
  extraLinks: [],
  contactBlurb: "Reach out any of these ways.",
};

const ABOUT = {
  bio:
    "Hello! I am Clayton Yen, currently a third year electrical engineering student " +
    "at the University of Illinois, Urbana-Champaign. I'm an engineer who likes " +
    "understanding a system from the ground up. As a result, I gravitate towards " +
    "projects where I can be a part of the entire design process: designing, simulating, measuring, " +
    "and most importantly improving. When I'm not in the lab, you can find me playing " +
    "guitar, rock climbing, or documenting my outdoor adventures through photography.",
  photo: {
    src: "media/hero_photo.jpg",
    alt: "Clayton Yen's workbench with test equipment and guitar",
  },
};

// Most recent first.
const EXPERIENCE = [
  {
    role: "PCB Designer",
    company: "Zephyr Boards",
    location: "Urbana, IL",
    start: "Dec. 2025",
    end: "May 2026",
    blurb:
      "Zephyr Boards was a startup that specialized in the creation of " +
      "foldable electric longboards with an emphasis on portability and battery life. " + 
      "I worked on the three-phase current-sensing circuit for their " +
      "BLDC motor controller, using bidirectional current-sense amplifiers and precision " +
      "shunt resistors for closed-loop control. I optimized component " +
      "placement and routing in Altium, cutting board size roughly 10%." +
      "When parts went obsolete I sourced and qualified pin-compatible replacements.",
    // Add these once you have them — same pattern as PROJECTS images below.
    pcbImage: "", // e.g. "media/zephyr-pcb-altium.png"
    pcbImageAlt: "PCB layout in Altium Designer",
    productImage: "", // e.g. "media/zephyr-product.jpg"
    productImageAlt: "Finished motor controller board",
  }, // make sure to add a comma here once you add another experience
  // {
  //   role: "Software Engineering Intern",
  //   company: "Earlier Company",
  //   location: "New York, NY",
  //   start: "2020",
  //   end: "2020",
  //   blurb: "What the company does, and what you actually worked on there.",
  //   pcbImage: "",
  //   pcbImageAlt: "",
  //   productImage: "",
  //   productImageAlt: "",
  // },
  // Copy any block above, paste it here, and edit the fields to add another role.
];

const PROJECTS = [
  {
    title: "Reverb Electric Guitar Pedal",
    description:
      "Pedal that features fast reverb or dark reverb with pre-delay.",
    tags: ["Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/reverb-pedal",
    featured: false,
    image: "", // e.g. "projects/reverb-pedal.jpg" — photo of the built pedal
    measurementImage: "", // e.g. "projects/reverb-freq-response.png"
    audio: "",
    longDescription:
      "Work in " +
      "Progress",
  },
  {
    title: "3-Channel Equalizer Electric Guitar Pedal",
    description:
      "Equalizer pedal has 3 near-independent channel modification to shape audio signal",
    tags: ["LTSpice", "Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/3-channel-eq-pedal",
    featured: false,
    image: "media/Circuit_Screenshot.png", // e.g. "projects/reverb-pedal.jpg" — photo of the built pedal
    measurementImage: "media/Frequency_Response_Screenshot.png", // e.g. "projects/reverb-freq-response.png"
    audio: "media/eq_demo.mp3",
    longDescription:
      "Equalizers help to shape the audio signal using filters. You can make your tone brighter by lifting the treble, " +
      "thicker by raising the mids, or darker by increasing the bass. My three channel equalizer design does just that, " +
      "achieved using a gyrator peak filter for each channel into an op-amp mixer which is configured as a swinging input, " +
      "unity gain noninverting amplifier. The circuit also has Sallen-Key low pass filter and high pass filters to get rid of " +
      "unwanted low frequency hum and high frequency buzz. The audio demo is an extreme case of boosting the treble and reducing " +
      "the bass."
   }, 
  {
    title: "Resistor Color Code Reader GUI",
    description:
      "User chooses band colors to get resistor value or inputs resistor value for band color.",
    tags: ["Python", "TKinter"],
    liveUrl: "", // add this
    repoUrl: "https://github.com/claytonyen/resistor-code-reader",
    featured: false,
    image: "media/Resistor_Reader.png",
    imageFit: "contain",
    measurementImage: "",
    longDescription:
      "I wanted to streamline breadboard prototyping for my projects, so I made a GUI using Python " +
      "and its TKinter package. It supports common 4, 5, and 6 band resistors with full bidirectional conversion: " +
      "pick band colors to see the value or type a resistance value to see the band colors. " +
      "The value input is very flexible, allowing inputs like 2200, 2.2k, or 2k2. The input also features " +
      "smart rounding to the nearest valid value."
  },
  {
    title: "Electra Distortion Electric Guitar Pedal",
    description:
      "Pedal that uses CE amplifier and diode clipping stage for distortion effect. Has multiple iterations with different clipping stages.",
    tags: ["LTSpice", "Analog Circuit Design"],
    liveUrl: "",
    repoUrl: "https://github.com/claytonyen/electra-distortion-pedal",
    featured: false,
    image: "media/electra_breadboard_1.png", // e.g. "projects/reverb-pedal.jpg" — photo of the built pedal
    measurementImage: "", // e.g. "projects/reverb-freq-response.png"
    audio: "media/distortion_demo.mp3",
    longDescription:
      "I started my electric guitar pedal design journey with a distortion pedal to " +
      "to become familiar with common elements in pedal circuits, such as various " + 
      "buffers and filters. The circuit utilizes a common emitter buffer to drive " +
      "an asymmetrical diode clipping stage to generate a mix of both even-order and " +
      "odd-order harmonics, which mimics real tube amplifier behavior. I had two iterations " +
      "of the diode clipping stage. A 2-1 1N4148 parallel diode configuration and a 1N270 and " +
      "1N4148 configuration. The audio demo is of the 1N270 1N4148 configuration."
      // Add a fuller writeup here — design goals, topology choices, what to
      //improve next time, measured results, etc. This shows in the expanded view only
  },
  // Copy any block above, paste it here, and edit the fields to add another project.
  // Leave liveUrl or repoUrl as "" to hide that link on the card.
];

const SKILLS = [
  { category: "Languages", items: ["Python", "C++", "LaTeX"] },
  { category: "Software", items: ["Altium Designer", "KiCad", "LTspice", "VS Code", "Git", "OnShape", "Adobe Suite", "Davinci Resolve"] },
];

/* ============================================================================
   RENDERING
   ============================================================================ */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderHero() {
  document.getElementById("hero-name").textContent = PROFILE.name;
  document.getElementById("hero-tagline").textContent = PROFILE.tagline;
  document.getElementById("nav-mark").textContent = PROFILE.initials;
  document.getElementById("nav-resume").href = PROFILE.resumeUrl;
  document.title = `${PROFILE.name} - Portfolio`;
}

function renderAbout() {
  document.getElementById("about-bio").textContent = ABOUT.bio;
  const photoImg = document.getElementById("about-photo-img");
  photoImg.src = ABOUT.photo.src;
  photoImg.alt = ABOUT.photo.alt;
}

function renderExperience() {
  const timeline = document.getElementById("timeline");
  EXPERIENCE.forEach((job) => {
    const item = el("li", "timeline-item reveal");

    const head = el("div", "ti-head");
    head.appendChild(el("span", "ti-role", job.role));
    head.appendChild(el("span", "ti-company", `· ${job.company}`));
    head.appendChild(el("span", "ti-dates", `${job.start} - ${job.end}`));
    item.appendChild(head);

    if (job.location) item.appendChild(el("div", "ti-location", job.location));

    const body = el("div", "ti-body");
    if (job.blurb) body.appendChild(el("p", "ti-blurb", job.blurb));

    const media = el("div", "ti-media");
    if (job.pcbImage) {
      const fig = el("figure", "ti-media-item");
      const img = el("img");
      img.src = job.pcbImage;
      img.alt = job.pcbImageAlt || `${job.role} at ${job.company} - PCB layout`;
      fig.appendChild(img);
      media.appendChild(fig);
    }
    if (job.productImage) {
      const fig = el("figure", "ti-media-item");
      const img = el("img");
      img.src = job.productImage;
      img.alt = job.productImageAlt || `${job.role} at ${job.company} - finished product`;
      fig.appendChild(img);
      media.appendChild(fig);
    }
    if (media.children.length) body.appendChild(media);

    item.appendChild(body);
    timeline.appendChild(item);
  });
}

function renderProjects() {
  const grid = document.getElementById("project-grid");
  PROJECTS.forEach((proj, i) => {
    const card = el("article", "project-card reveal");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");

    if (proj.featured) card.appendChild(el("span", "pc-featured", "FEATURED"));

    if (proj.image) {
      const thumb = el("div", "pc-thumb");
      const img = el("img");
      img.src = proj.image;
      img.alt = proj.title;
      if (proj.imageFit === "contain") img.style.objectFit = "contain";
      thumb.appendChild(img);
      card.appendChild(thumb);
    }

    card.appendChild(el("h3", "pc-title", proj.title));
    card.appendChild(el("p", "pc-desc", proj.description));
    card.appendChild(el("span", "pc-expand mono", "View details →"));

    const openHandler = (e) => {
      // don't trigger modal if a repo/live link inside the card was clicked
      if (e.target.closest("a")) return;
      openProjectModal(proj);
    };
    card.addEventListener("click", openHandler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(proj);
      }
    });

    grid.appendChild(card);
  });
}

function openProjectModal(proj) {
  const overlay = document.getElementById("project-modal");
  const content = document.getElementById("project-modal-content");
  content.innerHTML = "";

  content.appendChild(el("h2", "pm-title", proj.title));

  if (proj.image) {
    const img = el("img", "pm-image");
    img.src = proj.image;
    img.alt = proj.title;
    if (proj.imageFit === "contain") img.style.objectFit = "contain";
    content.appendChild(img);
  }

  content.appendChild(el("p", "pm-desc", proj.longDescription || proj.description));

  if (proj.measurementImage) {
    const measImg = el("img", "pm-image pm-measurement");
    measImg.src = proj.measurementImage;
    measImg.alt = `${proj.title} - measurement`;
    content.appendChild(measImg);
  }

   if (proj.audio) {
     const audioWrap = el("div", "pm-audio-wrap");
     audioWrap.appendChild(el("p", "pm-audio-label mono", "Audio demo"));
     const audio = document.createElement("audio");
     audio.controls = true;
     audio.src = proj.audio;
     audio.classList.add("pm-audio");
     audioWrap.appendChild(audio);
     content.appendChild(audioWrap);
   }

  const links = el("div", "pc-links");
  if (proj.liveUrl) {
    const a = el("a", null, "Live ↗");
    a.href = proj.liveUrl; a.target = "_blank"; a.rel = "noopener";
    links.appendChild(a);
  }
  if (proj.repoUrl) {
    const a = el("a", null, "Repo ↗");
    a.href = proj.repoUrl; a.target = "_blank"; a.rel = "noopener";
    links.appendChild(a);
  }
  if (links.children.length) content.appendChild(links);

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
  overlay.querySelector(".pm-close").focus();
}

function closeProjectModal() {
  const overlay = document.getElementById("project-modal");
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

function setupModal() {
  const overlay = document.getElementById("project-modal");
  overlay.querySelector(".pm-close").addEventListener("click", closeProjectModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProjectModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeProjectModal();
  });
}

function setupNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-inner")) closeMenu();
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
  document.getElementById("contact-blurb").textContent = PROFILE.contactBlurb;

  const linksList = document.getElementById("contact-links");
  const baseLinks = [
    { label: `Email - ${PROFILE.email}`, url: `mailto:${PROFILE.email}` },
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
  setupModal();
  setupNavToggle();
  setupScrollReveal();
}

document.addEventListener("DOMContentLoaded", init);
