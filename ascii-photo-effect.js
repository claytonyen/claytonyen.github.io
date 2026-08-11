/* ============================================================================
   AsciiPhotoEffect
   Standalone Canvas2D reimplementation of the 21st.dev "Custom ASCII art"
   pipeline. No external deps, no build step — drop this <script> in and
   instantiate.

   COVERAGE NOTE (read before relying on this for other configs):
   Fully implemented: renderMode "hexdump" and "characters" (glyph-from-
   charSet, used as the fallback for any other renderMode), plus "pixel",
   "dots", and "mosaic" as bonus since they're cheap. bgMode: solid / blur /
   photo / none. Color pipeline: brightness, contrast, saturation, grayscale,
   tint+overlayBlend, blur. pfx: vignette, scanLines, filmGrain, chromatic,
   pixelate — fully implemented. pfx: bloom, glitch, halftone, filmDust — left
   as documented no-ops (they're off in the shipped config; each needs enough
   extra machinery — real gaussian blur compositing, displacement mapping,
   angled screen dots, particle sprites — that faking them would just be
   wrong, not simpler). lights + mask (reveal mask) are implemented.
   Any renderMode not in the switch below falls back to "characters" with a
   one-time console.warn so nothing silently breaks.
   ============================================================================ */

(function (global) {
  "use strict";

  const HEXDUMP_GLYPHS = "0123456789ABCDEF";
  const DEFAULT_CHARSET = " .:-=+*#%@";
  const CHARSET_PRESETS = {
    binary: "01",
    hex: HEXDUMP_GLYPHS,
    blocks: " ░▒▓█",
    default: DEFAULT_CHARSET,
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Cheap deterministic hash -> [0,1), used for coverage/density skip so the
  // pattern is stable across re-renders instead of flickering.
  function hash2(x, y) {
    let h = (x * 374761393 + y * 668265263) ^ (x << 13);
    h = (h ^ (h >>> 7)) * 2654435761;
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967295;
  }

  function applyToneCurve(l, points) {
    if (!points || points.length < 2) return l;
    const pts = [...points].sort((a, b) => a.x - b.x);
    if (l <= pts[0].x) return pts[0].y;
    if (l >= pts[pts.length - 1].x) return pts[pts.length - 1].y;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (l >= a.x && l <= b.x) {
        const t = b.x === a.x ? 0 : (l - a.x) / (b.x - a.x);
        return a.y + (b.y - a.y) * t;
      }
    }
    return l;
  }

  class AsciiPhotoEffect {
    /**
     * @param {HTMLCanvasElement} canvas  target canvas (already sized in CSS px; this class handles DPR)
     * @param {HTMLImageElement}  image   source photo, already loaded (naturalWidth/Height available)
     * @param {object}            params  see the JSON schema this was built against
     */
    constructor(canvas, image, params) {
      this.canvas = canvas;
      this.image = image;
      this.params = params;
      this.ctx = canvas.getContext("2d");
      this._maskImage = null;
      this._warnedModes = new Set();
    }

    setParams(next) {
      this.params = { ...this.params, ...next };
    }

    // Public entry point. Call whenever params or canvas size change.
    render() {
      const p = this.params;
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      const cssW = this.canvas.clientWidth || this.canvas.width;
      const cssH = this.canvas.clientHeight || this.canvas.height;
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }
      const cellSize = Math.max(2, Math.round((p.cellSize || 14) * dpr));

      const source = this._prepareSource(w, h);
      const ctx = this.ctx;
      ctx.clearRect(0, 0, w, h);

      this._drawBackground(ctx, source, w, h);
      this._drawCells(ctx, source, w, h, cellSize);
      this._applyLights(ctx, w, h);
      this._applyPostEffects(ctx, w, h);
      this._applyMask(ctx, source, w, h);
    }

    // ---- Step 4: color-adjusted, size-fitted copy of the source photo ----
    _prepareSource(w, h) {
      const p = this.params;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");

      // brightness / contrast / saturation / grayscale, in that order,
      // via the canvas filter pipeline (applied left-to-right).
      const brightness = 100 + (p.brightness || 0);
      const contrast = 100 + (p.contrast || 0);
      const saturate = p.saturation != null ? p.saturation : 100;
      const grayscale = p.grayscale || 0;
      octx.filter =
        `brightness(${brightness}%) contrast(${contrast}%) ` +
        `saturate(${saturate}%) grayscale(${grayscale}%)`;

      // cover-fit the image into w x h
      const ir = this.image.naturalWidth / this.image.naturalHeight;
      const cr = w / h;
      let dw, dh, dx, dy;
      if (ir > cr) {
        dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0;
      } else {
        dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2;
      }
      octx.drawImage(this.image, dx, dy, dw, dh);
      octx.filter = "none";

      // tint, composited with overlayBlend at tintOpacity
      if (p.tint && p.tintOpacity > 0) {
        octx.save();
        octx.globalCompositeOperation = p.overlayBlend || "source-over";
        octx.globalAlpha = clamp((p.tintOpacity || 0) / 100, 0, 1);
        octx.fillStyle = p.tint;
        octx.fillRect(0, 0, w, h);
        octx.restore();
        octx.globalAlpha = 1;
      }

      // blur (only "off" is exercised by the shipped config, but honor it)
      if (p.blurType && p.blurType !== "off" && p.blurAmount > 0) {
        const blurred = document.createElement("canvas");
        blurred.width = w; blurred.height = h;
        const bctx = blurred.getContext("2d");
        bctx.filter = `blur(${(p.blurAmount / 100) * Math.min(w, h) * 0.05}px)`;
        bctx.drawImage(off, 0, 0);
        return blurred;
      }

      return off;
    }

    _drawBackground(ctx, source, w, h) {
      const p = this.params;
      const opacity = clamp((p.bgOpacity != null ? p.bgOpacity : 100) / 100, 0, 1);
      switch (p.bgMode) {
        case "none":
          return;
        case "solid": {
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = p.bgColor || "#0b0b0d";
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
          return;
        }
        case "blur": {
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.filter = `blur(${Math.max(0, p.bgBlur || 0)}px)`;
          ctx.drawImage(source, 0, 0, w, h);
          ctx.filter = "none";
          ctx.restore();
          return;
        }
        case "photo":
        default: {
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(source, 0, 0, w, h);
          ctx.restore();
        }
      }
    }

    // ---- Steps 2 & 3: grid sample + per-cell primitive ----
    _drawCells(ctx, source, w, h, cellSize) {
      const p = this.params;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);
      // One getImageData call for the whole frame, not one per cell.
      // Per-cell getImageData looks simpler but each call has real fixed
      // overhead; at a 14px cell size on a retina hero that's 2,000+ calls
      // per render/resize. A single full-frame read + manual indexing into
      // the Uint8ClampedArray is the same math, an order of magnitude less
      // call overhead.
      const sctx = source.getContext("2d", { willReadFrequently: true });
      const full = sctx.getImageData(0, 0, w, h).data;
      const coverage = clamp((p.coverage != null ? p.coverage : 100) / 100, 0, 1);
      const density = clamp((p.density || 0) / 100, 0, 1);
      const invert = !!p.invert;
      const edgeEmphasis = clamp((p.edgeEmphasis || 0) / 100, 0, 1);

      // Sample average luminance/color per cell up front (needed for edge
      // detection against neighbors before drawing).
      const lum = new Float32Array(cols * rows);
      const colRGB = new Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) {
        const cy = gy * cellSize;
        const ch = Math.min(cellSize, h - cy);
        if (ch <= 0) continue;
        for (let gx = 0; gx < cols; gx++) {
          const cx = gx * cellSize;
          const cw = Math.min(cellSize, w - cx);
          if (cw <= 0) continue;
          let r = 0, g = 0, b = 0, n = 0;
          // Sample a sparse sub-grid within the cell instead of every pixel —
          // 4x4 samples is visually identical to a full average for a
          // luminance bucket, at a fraction of the reads.
          const stepX = Math.max(1, cw / 4), stepY = Math.max(1, ch / 4);
          for (let sy = 0; sy < ch; sy += stepY) {
            const py = cy + (sy | 0);
            for (let sx = 0; sx < cw; sx += stepX) {
              const px = cx + (sx | 0);
              const i = (py * w + px) * 4;
              r += full[i]; g += full[i + 1]; b += full[i + 2]; n++;
            }
          }
          r /= n; g /= n; b /= n;
          let l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          l = applyToneCurve(l, p.toneCurve);
          if (invert) l = 1 - l;
          const idx = gy * cols + gx;
          lum[idx] = l;
          colRGB[idx] = [r, g, b];
        }
      }

      const renderMode = p.renderMode || "characters";
      const glyphSet = this._resolveCharset();

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const idx = gy * cols + gx;
          if (colRGB[idx] === undefined) continue;

          // coverage: skip cells deterministically
          if (hash2(gx, gy) > coverage) continue;
          // density: skip an additional fraction for a sparser look
          if (density > 0 && hash2(gx + 999, gy + 999) < density * 0.5) continue;

          let l = lum[idx];
          const [r, g, b] = colRGB[idx];

          // simple edge boost: compare to right/bottom neighbor
          const rightL = gx + 1 < cols ? lum[idx + 1] : l;
          const downL = gy + 1 < rows ? lum[idx + cols] : l;
          const edge = Math.abs(l - rightL) + Math.abs(l - downL);
          const edgeBoost = 1 + edge * edgeEmphasis * 2;

          const cx = gx * cellSize, cy = gy * cellSize;
          const color = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;

          this._drawCellGlyph(ctx, renderMode, glyphSet, {
            x: cx, y: cy, size: cellSize, l, color, edgeBoost, gx, gy,
          });
        }
      }
    }

    _resolveCharset() {
      const p = this.params;
      if (p.customChars) return p.customChars;
      if (p.charSet && CHARSET_PRESETS[p.charSet]) return CHARSET_PRESETS[p.charSet];
      return DEFAULT_CHARSET;
    }

    _drawCellGlyph(ctx, mode, glyphSet, cell) {
      switch (mode) {
        case "hexdump":
          return this._drawHexdump(ctx, cell);
        case "pixel":
          return this._drawPixel(ctx, cell);
        case "dots":
          return this._drawDots(ctx, cell);
        case "mosaic":
          return this._drawMosaic(ctx, cell);
        case "characters":
          return this._drawCharacter(ctx, glyphSet, cell);
        default:
          if (!this._warnedModes.has(mode)) {
            this._warnedModes.add(mode);
            console.warn(
              `[AsciiPhotoEffect] renderMode "${mode}" isn't implemented in ` +
              `this build — falling back to "characters". See the file header ` +
              `for what's covered.`
            );
          }
          return this._drawCharacter(ctx, glyphSet, cell);
      }
    }

    _drawHexdump(ctx, { x, y, size, l, color, edgeBoost }) {
      const glyph = HEXDUMP_GLYPHS[clamp(Math.floor(l * 16 * edgeBoost), 0, 15)];
      ctx.save();
      ctx.font = `${Math.round(size * 0.82)}px "IBM Plex Mono", "SFMono-Regular", monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillStyle = color;
      ctx.globalAlpha = clamp(0.25 + l * 0.85, 0, 1);
      ctx.fillText(glyph, x + size * 0.12, y + size * 0.06);
      ctx.restore();
    }

    _drawCharacter(ctx, glyphSet, { x, y, size, l, color, edgeBoost }) {
      const i = clamp(Math.floor(l * edgeBoost * (glyphSet.length - 1)), 0, glyphSet.length - 1);
      const glyph = glyphSet[i];
      if (glyph === " ") return;
      ctx.save();
      ctx.font = `${Math.round(size * 0.9)}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = color;
      ctx.globalAlpha = clamp(0.3 + l * 0.7, 0, 1);
      ctx.fillText(glyph, x + size * 0.1, y);
      ctx.restore();
    }

    _drawPixel(ctx, { x, y, size, l, color }) {
      const s = size * clamp(l, 0.15, 1);
      const o = (size - s) / 2;
      ctx.save();
      ctx.globalAlpha = clamp(0.3 + l * 0.7, 0, 1);
      ctx.fillStyle = color;
      ctx.fillRect(x + o, y + o, s, s);
      ctx.restore();
    }

    _drawDots(ctx, { x, y, size, l, color }) {
      const r = (size / 2) * clamp(l, 0.1, 1) * 0.9;
      ctx.save();
      ctx.globalAlpha = clamp(0.3 + l * 0.7, 0, 1);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _drawMosaic(ctx, { x, y, size, color }) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x + 0.5, y + 0.5, size - 1, size - 1);
      ctx.restore();
    }

    // ---- Step 6: point lights ----
    _applyLights(ctx, w, h) {
      const lights = this.params.lights;
      if (!lights || !lights.enabled || !lights.points) return;
      const diag = Math.hypot(w, h);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const pt of lights.points) {
        const cx = pt.x * w, cy = pt.y * h;
        const r = (pt.radius / 100) * diag;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const a = clamp((pt.intensity || 0) / 100, 0, 1);
        grad.addColorStop(0, `rgba(255, 230, 200, ${a})`);
        grad.addColorStop(1, "rgba(255, 230, 200, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }

    // ---- Step 5: post-effect stack ----
    _applyPostEffects(ctx, w, h) {
      const pfx = this.params.pfx || {};
      if (pfx.scanLines && pfx.scanLines.enabled) this._pfxScanLines(ctx, w, h, pfx.scanLines.intensity);
      if (pfx.chromatic && pfx.chromatic.enabled) this._pfxChromatic(ctx, w, h, pfx.chromatic.intensity);
      if (pfx.filmGrain && pfx.filmGrain.enabled) this._pfxFilmGrain(ctx, w, h, pfx.filmGrain.intensity);
      if (pfx.pixelate && pfx.pixelate.enabled) this._pfxPixelate(ctx, w, h, pfx.pixelate.intensity);
      // vignette last, so it darkens everything above it
      if (pfx.vignette && pfx.vignette.enabled) this._pfxVignette(ctx, w, h, pfx.vignette.intensity);
      // bloom / glitch / halftone / filmDust: intentionally no-op. See file header.
    }

    _pfxVignette(ctx, w, h, intensity) {
      const a = clamp((intensity || 0) / 100, 0, 1);
      const grad = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.35,
        w / 2, h / 2, Math.hypot(w, h) / 1.4
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${a})`);
      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    _pfxScanLines(ctx, w, h, intensity) {
      const a = clamp((intensity || 0) / 100, 0, 0.5);
      ctx.save();
      ctx.fillStyle = `rgba(0,0,0,${a})`;
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
      ctx.restore();
    }

    _pfxFilmGrain(ctx, w, h, intensity) {
      const amt = clamp((intensity || 0) / 100, 0, 1);
      if (amt <= 0) return;
      // sparse random dots rather than a full per-pixel imageData pass —
      // much cheaper, visually reads the same at typical intensities.
      const count = Math.round((w * h) / 900 * amt);
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w, y = Math.random() * h;
        const v = Math.random() < 0.5 ? 0 : 255;
        ctx.fillStyle = `rgba(${v},${v},${v},0.5)`;
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();
    }

    _pfxChromatic(ctx, w, h, intensity) {
      const px = clamp((intensity || 0) / 100, 0, 1) * 4;
      if (px <= 0) return;
      const snap = document.createElement("canvas");
      snap.width = w; snap.height = h;
      snap.getContext("2d").drawImage(this.canvas, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.5;
      ctx.drawImage(snap, -px, 0);
      ctx.drawImage(snap, px, 0);
      ctx.restore();
    }

    _pfxPixelate(ctx, w, h, intensity) {
      const factor = 1 + clamp((intensity || 0) / 100, 0, 1) * 12;
      const sw = Math.max(1, Math.round(w / factor));
      const sh = Math.max(1, Math.round(h / factor));
      const tmp = document.createElement("canvas");
      tmp.width = sw; tmp.height = sh;
      const tctx = tmp.getContext("2d");
      tctx.imageSmoothingEnabled = false;
      tctx.drawImage(this.canvas, 0, 0, sw, sh);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(tmp, 0, 0, sw, sh, 0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
    }

    // ---- Step 7: reveal mask back to the plain photo ----
    _applyMask(ctx, source, w, h) {
      const mask = this.params.mask;
      if (!mask || !mask.enabled || !mask.dataUrl) return;
      if (!this._maskImage || this._maskImage.src !== mask.dataUrl) {
        this._maskImage = new Image();
        this._maskImage.src = mask.dataUrl;
        this._maskImage.onload = () => this.render();
        return; // wait for load, next render() call will apply it
      }
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w; maskCanvas.height = h;
      const mctx = maskCanvas.getContext("2d");
      mctx.drawImage(this._maskImage, 0, 0, w, h);
      if (mask.invert) {
        mctx.globalCompositeOperation = "xor";
        mctx.fillRect(0, 0, w, h);
      }
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(source, 0, 0, w, h);
      ctx.restore();
    }
  }

  global.AsciiPhotoEffect = AsciiPhotoEffect;
})(typeof window !== "undefined" ? window : globalThis);
