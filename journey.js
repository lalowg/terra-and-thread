/* TERRA & THREAD — the material journey.
   A set of SVG strands re-forms from loose fibres, to a twisted yarn,
   to a woven (or knitted) swatch, to the rows of a finished garment. */
import { MATERIALS, GARMENTS, JOURNEY_GARMENT, spanAt, bounds } from './garments.js';

const TAU = Math.PI * 2;
const hash = (n) => { const s = Math.sin(n * 91.345 + 47.853) * 43758.5453; return s - Math.floor(s); };
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const NS = 'http://www.w3.org/2000/svg';

export function createJourney({ svg, strandsG, reduced = false, small = false, onRender }) {
  const S = small ? 22 : 30;
  const K = 28;
  const strands = [];
  for (let i = 0; i < S; i++) {
    const el = document.createElementNS(NS, 'path');
    strandsG.appendChild(el);
    strands.push({
      el,
      cur: new Float32Array(K * 2),
      from: new Float32Array(K * 2),
      tgt: new Float32Array(K * 2),
      r: [1, 2, 3, 4, 5, 6].map((k) => hash(i * 7.13 + k * 1.91)),
    });
  }
  const swatches = Array.from(svg.querySelectorAll('.stage-swatch'));
  const garments = Array.from(svg.querySelectorAll('.stage-garment'));
  garments.forEach((g) => g.querySelectorAll('.gm__line, .gm__detail').forEach((p) => p.setAttribute('pathLength', '1')));

  let step = 0, mat = 'linen';
  let tStart = -1e9, raf = 0, inView = true, clock = 0, last = performance.now();
  const DUR = 1400, STAGGER = 420;

  /* ---------- layouts ---------- */
  function fibre(s, i, t, out) {
    const m = MATERIALS[mat], [r1, r2, r3, r4, r5, r6] = s.r;
    const len = m.len * (0.7 + 0.6 * r3);
    let x0 = 400 + (r1 - 0.5) * 380 - len / 2;
    x0 = Math.max(70, Math.min(730 - len, x0));
    const y0 = 300 + (r2 - 0.5) * 260;
    const a = (r4 - 0.5) * 0.42;
    const dx = reduced ? 0 : Math.sin(t * 0.5 + i) * 5, dy = reduced ? 0 : Math.cos(t * 0.43 + i * 1.7) * 4;
    const ca = Math.cos(a), sa = Math.sin(a);
    for (let k = 0; k < K; k++) {
      const u = k / (K - 1), d = u * len;
      const w = m.amp * Math.sin(d * m.freq + r5 * TAU) + 12 * (r6 - 0.5) * Math.sin(Math.PI * u);
      out[k * 2] = x0 + d * ca - w * sa + dx;
      out[k * 2 + 1] = y0 + d * sa + w * ca + dy;
    }
  }

  function yarn(s, i, t, out) {
    const m = MATERIALS[mat], [r1] = s.r;
    const spin = reduced ? 0 : t * 1.3;
    const R = m.radius * (0.55 + 0.45 * r1);
    const ph = (TAU * i) / S;
    for (let k = 0; k < K; k++) {
      const u = 0.02 + 0.96 * (k / (K - 1));
      const cx = 70 + 660 * u, cy = 360 - 120 * u - 40 * Math.sin(Math.PI * u);
      const tx = 660, ty = -120 - 40 * Math.PI * Math.cos(Math.PI * u);
      const l = Math.hypot(tx, ty), nx = -ty / l, ny = tx / l;
      const off = R * Math.sin(TAU * m.turns * u + ph + spin);
      out[k * 2] = cx + nx * off;
      out[k * 2 + 1] = cy + ny * off;
    }
  }

  function weave(s, i, t, out) {
    if (mat === 'wool') { // knitted rows of V loops
      const y = 156 + ((i + 0.5) * 288) / S;
      for (let k = 0; k < K; k++) {
        out[k * 2] = 254 + (292 * k) / (K - 1);
        out[k * 2 + 1] = y + (k % 2 ? 4.5 : -4.5);
      }
      return;
    }
    const half = Math.floor(S / 2);
    if (i < half) { // warp
      const cell = 300 / half;
      const x = 250 + (i + 0.5) * cell;
      for (let k = 0; k < K; k++) {
        const y = 152 + (296 * k) / (K - 1);
        out[k * 2] = x + 2.4 * Math.sin((Math.PI * (y - 150)) / cell + i * Math.PI);
        out[k * 2 + 1] = y;
      }
    } else { // weft
      const j = i - half, n = S - half, cell = 300 / n;
      const y = 150 + (j + 0.5) * cell;
      for (let k = 0; k < K; k++) {
        const x = 252 + (296 * k) / (K - 1);
        out[k * 2] = x;
        out[k * 2 + 1] = y + 2.4 * Math.sin((Math.PI * (x - 250)) / cell + j * Math.PI + Math.PI / 2);
      }
    }
  }

  function garment(s, i, t, out) {
    const g = GARMENTS[JOURNEY_GARMENT[mat]];
    const b = bounds(g.pts);
    const top = b.minY + 34, bot = b.maxY - 10;
    const y = top + ((i + 0.5) * (bot - top)) / S;
    const [l, r] = spanAt(g.pts, y);
    const knit = mat === 'wool';
    for (let k = 0; k < K; k++) {
      const x = l + 5 + ((r - l - 10) * k) / (K - 1);
      out[k * 2] = x;
      out[k * 2 + 1] = y + (knit ? (k % 2 ? 2.5 : -2.5) : 1.6 * Math.sin(x * 0.12 + i * 1.3));
    }
  }

  const LAYOUTS = [fibre, yarn, weave, garment];

  function styleFor(i) {
    const m = MATERIALS[mat];
    let stroke = m.stroke, width = m.width, op = 0.86;
    if (step === 1) { width = m.width * 1.15; op = 0.92; }
    if (step === 2) {
      width = m.width * 1.7; op = 0.95;
      if (mat === 'cotton' && i >= Math.floor(S / 2)) stroke = m.weft;
      if (mat === 'cotton' && i < Math.floor(S / 2)) stroke = '#26304D';
      if (mat === 'linen') stroke = '#7A6443';
    }
    if (step === 3) { stroke = m.deep; width = 1.1; op = 0.42; }
    return { stroke, width, op };
  }

  function applyStyles() {
    strands.forEach((s, i) => {
      const st = styleFor(i);
      s.el.style.stroke = st.stroke;
      s.el.style.strokeWidth = st.width;
      s.el.style.strokeOpacity = st.op;
    });
    swatches.forEach((g) => g.classList.toggle('is-on', step === 2 && g.dataset.mat === mat));
    garments.forEach((g) => g.classList.toggle('is-on', step === 3 && g.dataset.mat === mat));
  }

  /* ---------- path smoothing (Catmull-Rom → cubic Bézier) ---------- */
  function toPath(a) {
    let d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)}`;
    for (let k = 0; k < K - 1; k++) {
      const i0 = Math.max(0, k - 1) * 2, i1 = k * 2, i2 = (k + 1) * 2, i3 = Math.min(K - 1, k + 2) * 2;
      const c1x = a[i1] + (a[i2] - a[i0]) / 6, c1y = a[i1 + 1] + (a[i2 + 1] - a[i0 + 1]) / 6;
      const c2x = a[i2] - (a[i3] - a[i1]) / 6, c2y = a[i2 + 1] - (a[i3 + 1] - a[i1 + 1]) / 6;
      d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${a[i2].toFixed(1)} ${a[i2 + 1].toFixed(1)}`;
    }
    return d;
  }

  function render(now) {
    const since = now - tStart;
    const morphing = since < DUR + STAGGER;
    const lay = LAYOUTS[step];
    strands.forEach((s, i) => {
      lay(s, i, clock, s.tgt);
      if (morphing) {
        const u = ease(clamp01((since - (i / S) * STAGGER) / DUR));
        const lift = Math.sin(Math.PI * u) * 16 * (s.r[1] - 0.5);
        for (let k = 0; k < K * 2; k += 2) {
          s.cur[k] = s.from[k] + (s.tgt[k] - s.from[k]) * u;
          s.cur[k + 1] = s.from[k + 1] + (s.tgt[k + 1] - s.from[k + 1]) * u + lift;
        }
      } else {
        s.cur.set(s.tgt);
      }
      s.el.setAttribute('d', toPath(s.cur));
    });
    onRender?.();
    return morphing;
  }

  function loop(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) clock += dt;
    const morphing = render(now);
    const idle = !reduced && step <= 1;
    if ((morphing || idle) && inView && !document.hidden) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }

  function morph() {
    strands.forEach((s) => s.from.set(s.cur));
    tStart = reduced ? -1e9 : performance.now();
    applyStyles();
    kick();
  }

  // first frame: start from the fibre layout
  strands.forEach((s, i) => { fibre(s, i, 0, s.cur); });
  applyStyles();
  render(performance.now());

  const io = new IntersectionObserver((en) => { inView = en[0].isIntersecting; if (inView) kick(); }, { threshold: 0 });
  io.observe(svg);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  kick();

  return {
    get step() { return step; },
    get material() { return mat; },
    setStep(n) { n = Math.max(0, Math.min(3, n)); if (n === step) return; step = n; morph(); },
    setMaterial(m) { if (m === mat || !MATERIALS[m]) return; mat = m; morph(); },
    set(m, n) { const ch = m !== mat || n !== step; mat = m; step = n; if (ch) morph(); },
  };
}
