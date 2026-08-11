/* ============================================================================
   Wires AsciiPhotoEffect into TWO spots:
     1) #hero-ascii   — full detail hero background (responsive by screen width)
     2) #footer-ascii — same source photo, sparse/dim, "a thread" in the footer

   Load AFTER ascii-photo-effect.js. Load anywhere relative to script.js.
   ============================================================================ */

(function () {
  "use strict";

  const SOURCE_PHOTO = "media/mystrat.png"; // adjust to wherever you upload it

  // ---- Hero: responsive detail tiers -----------------------------------
  // Smaller cellSize = more glyphs = more detail = more CPU/GPU per frame.
  // We want real detail on desktop but can't afford (or read) that same
  // density on a phone, so cellSize/coverage step down by breakpoint.
  // dpr is clamped to 2 inside the engine regardless, so this is the main
  // perf lever.
  function heroConfigForWidth(w) {
    let cellSize, coverage;
    if (w < 480) { cellSize = 16; coverage = 78; }       // small phone: coarse, sparse
    else if (w < 900) { cellSize = 11; coverage = 90; }  // large phone / small tablet
    else { cellSize = 7; coverage = 97; }                // desktop: full detail

    return {
      renderMode: "hexdump",
      bgMode: "solid",
      bgColor: "#14161A",
      cellSize,
      coverage,
      invert: false,
      overlayBlend: "color-burn",
      charSet: "binary",
      brightness: 20,
      contrast: 58,
      edgeEmphasis: 75,
      density: 0,
      toneCurve: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      tint: "#260000",
      tintOpacity: 20,
      saturation: 105,
      grayscale: 0,
      blurType: "off",
      pfx: {
        vignette: { enabled: true, intensity: 38 },
      },
      lights: { enabled: false }, // removed per feedback
      mask: { enabled: false },
    };
  }

  function initHero(img) {
    const canvas = document.getElementById("hero-ascii");
    if (!canvas) return;

    const effect = new AsciiPhotoEffect(canvas, img, heroConfigForWidth(window.innerWidth));
    effect.render();

    let raf = null;
    window.addEventListener("resize", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        effect.setParams(heroConfigForWidth(window.innerWidth));
        effect.render();
      });
    });
  }

  // ---- Footer: same source photo, sparse + dim, no solid backdrop -------
  // bgMode "none" so the page's own --navy shows through where cells are
  // skipped; low coverage + dim glyphs so it reads as a texture, not a
  // second hero. Actual "low opacity" is finished with a CSS opacity on
  // the canvas element itself (see the CSS block).
  function initFooter(img) {
    const canvas = document.getElementById("footer-ascii");
    if (!canvas) return;

    const config = {
      renderMode: "hexdump",
      bgMode: "none",
      cellSize: 12,
      coverage: 55,
      invert: false,
      overlayBlend: "color-burn",
      charSet: "binary",
      brightness: -10,
      contrast: 40,
      edgeEmphasis: 60,
      density: 0,
      toneCurve: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      tint: "#260000",
      tintOpacity: 10,
      saturation: 80,
      grayscale: 0,
      blurType: "off",
      pfx: {},
      lights: { enabled: false },
      mask: { enabled: false },
    };

    const effect = new AsciiPhotoEffect(canvas, img, config);
    effect.render();

    let raf = null;
    window.addEventListener("resize", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => effect.render());
    });
  }

  function init() {
    const heroCanvas = document.getElementById("hero-ascii");
    const footerCanvas = document.getElementById("footer-ascii");
    if (!heroCanvas && !footerCanvas) return;

    const img = new Image();
    img.src = SOURCE_PHOTO;
    img.decoding = "async";
    img.onload = () => {
      if (heroCanvas) initHero(img);
      if (footerCanvas) initFooter(img);
    };
    img.onerror = () => {
      console.warn("[site-ascii] could not load " + SOURCE_PHOTO + " — check the path at the top of site-ascii.js");
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
