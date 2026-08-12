/* ============================================================================
   Hero ASCII portrait — fills the right half of the hero, shifted 45px
   (roughly 5 character-cells at cellSize:9) left of the viewport edge.
   Uses cover-fit so it reaches every edge of that box; crops ~20% off each
   side of the source photo (see site-ascii.js history / prior chat for why
   that's the accepted trade-off over contain-fit's letterboxing).

   Real sampled color, boosted saturation (220%) and a touch more contrast
   than earlier versions, specifically so the guitar's actual red/wood tones
   pop clearly against the neutral black clothing and hair — that contrast
   is what reads as "the guitar," not just density of glyphs.

   Only initializes at wide viewports (see CSS breakpoint below) — the box
   math that keeps it clear of the text column only holds above ~1536px now
   (bumped up from 1440px to cover the 45px leftward shift), and cramming a
   portrait into a laptop-or-smaller screen isn't legible anyway. Below that,
   .hero-ascii is display:none in CSS and this script no-ops.
   ============================================================================ */

(function () {
  "use strict";

  const SOURCE_PHOTO = "media/new_hero_picture.png";
  const MIN_WIDTH = 1536; // keep in sync with the CSS breakpoint

  const CONFIG = {
    renderMode: "characters",
    charSet: "default",
    bgMode: "none",
    sourceAlign: "center",
    sourceFit: "cover", // fills the box edge-to-edge; crops ~20% off each side
    transparentFill: "#EEF1EE", // matches --paper — flattens the cutout's transparent bg
    cellSize: 9,
    coverage: 75,
    invert: true, // dark subject -> dense glyphs, light bg -> blank
    // no flatColor — real sampled color, so the guitar's actual hue shows
    tint: null,
    tintOpacity: 0,
    brightness: -4,
    contrast: 26,
    edgeEmphasis: 70,
    saturation: 220, // pushed up from 155 so the guitar's red/wood tones stand out
    density: 0,
    toneCurve: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
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
