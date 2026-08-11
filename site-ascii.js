/* ============================================================================
   Hero ASCII portrait — "Pencil"-style: monochrome, transparent background,
   confined to the right side of the hero so it never fights the text column.

   Only initializes at wide viewports (see CSS breakpoint below) — the box
   math that keeps it clear of the text column only holds above ~1280px, and
   cramming a portrait into a phone-width strip isn't legible anyway. Below
   that, .hero-ascii is display:none in CSS and this script no-ops.

   The footer no longer uses canvas at all — it reuses the original CSS
   dot-grid pattern from the old hero background. See the footer-grid rules
   in style.css.
   ============================================================================ */

(function () {
  "use strict";

  const SOURCE_PHOTO = "media/new_hero_picture.png";
  const MIN_WIDTH = 1280; // keep in sync with the CSS breakpoint below

  const CONFIG = {
    renderMode: "characters",
    charSet: "default",
    bgMode: "none",
    sourceAlign: "center",
    transparentFill: "#EEF1EE", // matches --paper — flattens the cutout's transparent bg
    cellSize: 9,
    coverage: 60,
    invert: true, // dark subject -> dense glyphs, light bg -> blank
    flatColor: "#A8322A", // matches --accent
    brightness: 0,
    contrast: 15,
    edgeEmphasis: 65,
    density: 0,
    toneCurve: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    tint: null,
    tintOpacity: 0,
    saturation: 100,
    grayscale: 0,
    blurType: "off",
    pfx: {},
    lights: { enabled: false },
    mask: { enabled: false },
  };

  function init() {
    const canvas = document.getElementById("hero-ascii");
    if (!canvas) return;
    if (window.innerWidth < MIN_WIDTH) return;

    const img = new Image();
    img.src = SOURCE_PHOTO;
    img.decoding = "async";
    img.onload = () => {
      const effect = new AsciiPhotoEffect(canvas, img, CONFIG);
      effect.render();
      let raf = null;
      window.addEventListener("resize", () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          if (window.innerWidth >= MIN_WIDTH) effect.render();
        });
      });
    };
    img.onerror = () => {
      console.warn("[site-ascii] could not load " + SOURCE_PHOTO + " — check the path at the top of site-ascii.js");
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
