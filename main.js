/* TERRA & THREAD — page controller: journey UI, rooms track, collection,
   swatch book, mending story and the reservation demo form. */
import { createJourney } from './journey.js';
import { PRODUCTS } from './catalogue.js';
import { MATERIALS, MATERIAL_ORDER } from './garments.js';

window.ttReady = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqMobile = window.matchMedia('(max-width: 900px)');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ---------------- copy ---------------- */
const STEP_NAMES = ['Fibre', 'Yarn', 'Weave', 'Garment'];
const STEP_TEXT = {
  linen: [
    ['from flax', 'Flax stalks are pulled from the ground rather than cut, retted, then combed into long, pale fibres with a natural sheen.'],
    ['spun wet', 'The long fibres are drawn out and spun while damp, so they lie flat and make a smooth, slightly lustrous yarn.'],
    ['in plain weave', 'Over one, under one. A plain weave keeps linen airy and crisp, and every slub in the yarn shows in the cloth.'],
    ['the Field Shirt', 'Cut loose, with one chest pocket and five corozo buttons. It will crease, soften and pale with every wash.'],
  ],
  wool: [
    ['from fleece', 'Wool grows back every year. Each fibre has a natural crimp, the springy wave that traps air and keeps you warm.'],
    ['spun for loft', 'Spun with a gentle twist, so the yarn stays airy and full rather than tight and smooth.'],
    ['knitted, not woven', 'Wool takes a different road: each row of loops hangs from the last. The V of every stitch is what you see on the face of a jumper.'],
    ['the Shepherd Jumper', 'A heavy crew neck with deep ribs at the hem and cuffs, knitted in undyed and moss-dyed yarn.'],
  ],
  hemp: [
    ['from the stalk', 'Hemp gives long, coarse fibres from the outer stalk. They start stiff and grow softer with every wear.'],
    ['spun strong', 'Long-line spinning keeps the fibres parallel, which makes a strong, slightly irregular yarn.'],
    ['woven as canvas', 'A tight plain weave in a heavier yarn gives a dense canvas that holds its shape and takes a beating.'],
    ['the Carpenter Smock', 'An A-line smock with a split kangaroo pocket. It earns its softness over its first months of wear.'],
  ],
  cotton: [
    ['from the boll', 'Cotton fibres grow inside a seed pod. They are short and fine, and twisted like flat ribbons.'],
    ['rope-dyed indigo', 'The spun yarn is dipped in indigo again and again, so the colour builds at the surface and leaves a pale core.'],
    ['in a denim twill', 'Indigo warp over three, ecru weft under one, stepped along each row. That is the diagonal you see on denim.'],
    ['the Chore Jacket', 'A boxy three-pocket work jacket. The indigo wears back at the seams and edges, differently for every wearer.'],
  ],
};
const MAT_NOTES = {
  linen: { no: '01', lede: 'The oldest cloth we know how to make, and still one of the best for warm days.', fibre: 'Flax stalk, a bast fibre', spun: 'Wet-spun for a smooth, lustrous yarn', cloth: 'Plain weave, washed after sewing', hand: 'Cool, dry and crisp at first', ages: 'Softer and paler with every wash', care: 'Wash cool and dry on a line' },
  wool: { no: '02', lede: 'Springy, warm and forgiving. It asks to be aired far more often than washed.', fibre: 'Fleece, shorn once a year', spun: 'Woollen-spun for loft and warmth', cloth: 'Knitted in a deep rib', hand: 'Springy, warm, a little rustic', ages: 'Develops a soft halo over time', care: 'Hand-wash cool and dry flat' },
  hemp: { no: '03', lede: 'Our workhorse. It arrives like new canvas and slowly becomes your favourite thing.', fibre: 'Hemp stalk, a bast fibre', spun: 'Long-line spun for strength', cloth: 'Plain-weave canvas', hand: 'Dry and firm, like new canvas', ages: 'Softens markedly with wear and washing', care: 'Machine wash warm' },
  cotton: { no: '04', lede: 'Indigo-dyed twill that records how you live in it, one fade at a time.', fibre: 'Seed fibres from the cotton boll', spun: 'Ring-spun, then rope-dyed in indigo', cloth: 'Three-by-one twill: indigo warp, ecru weft', hand: 'Dense and smooth', ages: 'Fades at the edges and creases', care: 'Wash rarely, inside out, cold' },
};

/* ---------------- header ---------------- */
const header = $('#site-header'), menuBtn = $('.menu-btn'), nav = $('#site-nav');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  header.classList.toggle('is-menu', open);
  if (open) nav.querySelector('a')?.focus();
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a') && mqMobile.matches) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });
mqMobile.addEventListener('change', () => setMenu(false));
const navLinks = $$('#site-nav a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => { if (a.getAttribute('href') === `#${en.target.id}`) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) secObs.observe(s); });

/* ---------------- journey ---------------- */
const journey = createJourney({
  svg: $('#journey-svg'),
  strandsG: $('#strands'),
  reduced,
  small: window.matchMedia('(max-width: 640px)').matches,
});
const stepTabs = $$('.step');
const stepNote = $('#step-note'), stepTitle = $('#step-title'), stepText = $('#step-text');
const specNo = $('#spec-no'), specLabel = $('#spec-label'), progress = $('#steps-progress');
const playBtn = $('#step-play');
const fibreRadios = $$('input[name="fibre"]');
let playing = !reduced, timer = 0, heroVisible = true;

function updateJourneyUI(animateNote = true) {
  const step = journey.step, mat = journey.material;
  stepTabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === step)); t.tabIndex = k === step ? 0 : -1; });
  stepNote.setAttribute('aria-labelledby', `step-${step}`);
  progress.style.transform = `scaleX(${(step + 1) / 4})`;
  const idx = MATERIAL_ORDER.indexOf(mat);
  specNo.textContent = String(idx * 4 + step + 1).padStart(2, '0');
  specLabel.textContent = `${MATERIALS[mat].name} · ${step === 2 && mat === 'wool' ? 'Knit' : STEP_NAMES[step]}`;
  fibreRadios.forEach((r) => { r.checked = r.value === mat; });
  const [em, text] = STEP_TEXT[mat][step];
  const name = step === 2 && mat === 'wool' ? 'Knit' : STEP_NAMES[step];
  const swap = () => { stepTitle.innerHTML = `${name} <em>${em}</em>`; stepText.textContent = text; stepNote.classList.remove('is-swapping'); };
  if (animateNote && !reduced) { stepNote.classList.add('is-swapping'); setTimeout(swap, 260); } else swap();
}

function schedule() {
  clearTimeout(timer);
  if (!playing || !heroVisible || document.hidden) return;
  timer = setTimeout(() => {
    if (journey.step < 3) journey.setStep(journey.step + 1);
    else journey.set(MATERIAL_ORDER[(MATERIAL_ORDER.indexOf(journey.material) + 1) % 4], 0);
    updateJourneyUI();
    schedule();
  }, journey.step === 3 ? 5200 : 3600);
}
function setPlaying(v) {
  playing = v;
  playBtn.setAttribute('aria-pressed', String(v));
  playBtn.setAttribute('aria-label', v ? 'Pause the journey' : 'Play the journey');
  playBtn.querySelector('use').setAttribute('href', v ? '#i-pause' : '#i-play');
  schedule();
}
function userStep(n) { setPlaying(false); journey.setStep(n); updateJourneyUI(); }
stepTabs.forEach((t, k) => {
  t.addEventListener('click', () => userStep(k));
  t.addEventListener('keydown', (e) => {
    const s = journey.step;
    const map = { ArrowRight: Math.min(3, s + 1), ArrowLeft: Math.max(0, s - 1), Home: 0, End: 3 };
    if (e.key in map) { e.preventDefault(); userStep(map[e.key]); stepTabs[map[e.key]].focus(); }
  });
});
$('#step-prev').addEventListener('click', () => userStep(Math.max(0, journey.step - 1)));
$('#step-next').addEventListener('click', () => userStep(Math.min(3, journey.step + 1)));
playBtn.addEventListener('click', () => setPlaying(!playing));
fibreRadios.forEach((r) => r.addEventListener('change', () => { if (r.checked) { setPlaying(false); journey.setMaterial(r.value); updateJourneyUI(); } }));
new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; schedule(); }, { threshold: 0.2 }).observe($('#journey'));
document.addEventListener('visibilitychange', schedule);
updateJourneyUI(false);
setPlaying(playing);

/* ---------------- stitch-in reveals ---------------- */
const rev = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); rev.unobserve(en.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
$$('.stitch-in').forEach((el) => rev.observe(el));

/* ---------------- four rooms track ---------------- */
(function rooms() {
  const track = $('#rooms-track'), viewport = $('#rooms-viewport'), list = $('#rooms-list'), bar = $('#rooms-bar');
  const prev = $('#rooms-prev'), next = $('#rooms-next');
  const mqWide = window.matchMedia('(min-width: 1101px)');
  let pinned = false, dist = 0;
  const gut = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
  const stepW = () => { const a = list.children[0], b = list.children[1]; return a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().left : 600; };
  function layout() {
    pinned = mqWide.matches && !reduced;
    track.classList.toggle('is-pinned', pinned);
    list.style.transform = '';
    if (pinned) { dist = Math.max(0, list.scrollWidth - (viewport.clientWidth - gut() * 2)); track.style.height = `${window.innerHeight + dist}px`; }
    else { track.style.height = ''; dist = Math.max(0, viewport.scrollWidth - viewport.clientWidth); }
    update();
  }
  const progressOf = () => (pinned ? (dist ? Math.min(1, Math.max(0, -track.getBoundingClientRect().top / dist)) : 0) : (dist ? viewport.scrollLeft / dist : 0));
  function update() {
    const p = progressOf();
    if (pinned) list.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p.toFixed(3)})`;
    prev.disabled = p <= 0.001; next.disabled = p >= 0.999;
  }
  function go(dir) {
    const step = stepW() * dir;
    if (pinned) {
      const top = window.scrollY + track.getBoundingClientRect().top;
      window.scrollTo({ top: Math.min(top + dist, Math.max(top, window.scrollY + step)), behavior: reduced ? 'auto' : 'smooth' });
    } else viewport.scrollBy({ left: step, behavior: reduced ? 'auto' : 'smooth' });
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  viewport.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  let tick = false;
  const onS = () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; update(); }); };
  window.addEventListener('scroll', onS, { passive: true });
  viewport.addEventListener('scroll', onS, { passive: true });
  let rs = 0;
  window.addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(layout, 150); });
  document.fonts?.ready.then(layout);
  layout();
})();

/* ---------------- collection ---------------- */
const looks = $$('.look');
const chips = $$('.chip');
const countEl = $('#look-count');
let filter = 'all';
function columns() { return window.innerWidth > 1100 ? 4 : window.innerWidth > 900 ? 3 : 2; }
function offsets() {
  const cols = columns();
  looks.filter((l) => !l.hidden).forEach((l, i) => {
    l.classList.toggle('is-low', cols >= 3 && i % cols === 1);
    l.classList.toggle('is-mid', (cols === 4 && i % 4 === 3) || (cols === 2 && i % 2 === 1));
  });
}
function applyFilter(f, animate = true) {
  filter = f;
  const first = new Map(looks.map((el) => [el, el.hidden ? null : el.getBoundingClientRect()]));
  looks.forEach((el) => { el.hidden = !(f === 'all' || el.dataset.mat === f); });
  offsets();
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
  const vis = looks.filter((l) => !l.hidden);
  countEl.textContent = f === 'all' ? `Showing all ${vis.length} pieces` : `Showing ${vis.length} ${MATERIALS[f].name.toLowerCase()} pieces`;
  if (!animate || reduced || !Element.prototype.animate) return;
  vis.forEach((el, i) => {
    const a = first.get(el), b = el.getBoundingClientRect();
    if (a) {
      const dx = a.left - b.left, dy = a.top - b.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    } else {
      el.animate([{ opacity: 0, transform: 'translateY(24px) rotate(-1deg)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: i * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    }
  });
}
chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
offsets();
let rsL = 0;
window.addEventListener('resize', () => { clearTimeout(rsL); rsL = setTimeout(offsets, 150); });

/* dialog */
const dlg = $('#look-dialog');
let opener = null, currentProduct = null;
function paintColour(svg, base, deep) {
  svg.querySelectorAll('.gm__base').forEach((p) => p.setAttribute('fill', base));
  svg.querySelectorAll('.gm__line, .gm__detail').forEach((p) => p.setAttribute('stroke', deep));
  svg.querySelectorAll('.gm__btn').forEach((p) => p.setAttribute('fill', deep));
}
function openLook(id, btn) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  currentProduct = p;
  opener = btn;
  const card = btn.querySelector('.look__svg');
  const art = $('#ld-art');
  art.innerHTML = '';
  const svg = card.cloneNode(true);
  svg.removeAttribute('class');
  art.appendChild(svg);
  $('#ld-mat').textContent = `${MATERIALS[p.mat].name} · ${p.colours[0][0]}`;
  $('#ld-name').textContent = p.name;
  $('#ld-price').textContent = `£${p.price}`;
  $('#ld-note').textContent = p.note;
  $('#ld-care').textContent = p.care;
  $('#ld-mend').textContent = p.mend;
  $('#ld-colour').textContent = p.colours[0][0];
  const opts = $('#ld-colours');
  opts.innerHTML = p.colours.map(([n, base], k) => `<button class="cw" type="button" aria-pressed="${k === 0}" aria-label="${n} colourway" data-k="${k}" style="background:${base}"></button>`).join('');
  $$('.cw', opts).forEach((b) => b.addEventListener('click', () => {
    const [n, base, deep] = p.colours[+b.dataset.k];
    $$('.cw', opts).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#ld-colour').textContent = n;
    $('#ld-mat').textContent = `${MATERIALS[p.mat].name} · ${n}`;
    paintColour(svg, base, deep);
  }));
  if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  $('#ld-close').focus();
}
function closeLook() {
  if (dlg.open) { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
}
dlg.addEventListener('close', () => { opener?.focus({ preventScroll: true }); });
$$('.look__btn').forEach((b) => b.addEventListener('click', () => openLook(b.dataset.id, b)));
$('#ld-close').addEventListener('click', closeLook);
dlg.addEventListener('click', (e) => { if (e.target === dlg) closeLook(); });
$('#ld-reserve').addEventListener('click', () => {
  if (currentProduct) { $('#r-piece').value = currentProduct.id; validatePiece(); }
  opener = null;
  closeLook();
});

/* ---------------- swatch book ---------------- */
const swatches = $$('.book__sw');
const notes = $('#mat-notes');
let bookMat = 'linen';
function setBook(mat, focus = false) {
  if (mat === bookMat && !focus) return;
  bookMat = mat;
  swatches.forEach((s) => { const on = s.dataset.mat === mat; s.setAttribute('aria-checked', String(on)); s.tabIndex = on ? 0 : -1; if (on && focus) s.focus(); });
  const n = MAT_NOTES[mat];
  const fill = () => {
    $('#mn-kicker').textContent = `Swatch ${n.no}`;
    $('#mn-title').textContent = MATERIALS[mat].name;
    $('#mn-lede').textContent = n.lede;
    ['fibre', 'spun', 'cloth', 'hand', 'ages', 'care'].forEach((k) => { $(`#mn-${k}`).textContent = n[k]; });
    $('#mn-show').textContent = `See the ${MATERIALS[mat].name.toLowerCase()} pieces`;
    notes.classList.remove('is-swapping');
  };
  if (reduced) fill(); else { notes.classList.add('is-swapping'); setTimeout(fill, 240); }
}
swatches.forEach((s, i) => {
  s.addEventListener('click', () => setBook(s.dataset.mat));
  s.addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (d) { e.preventDefault(); setBook(swatches[(i + d + 4) % 4].dataset.mat, true); }
  });
});
$('#mn-show').addEventListener('click', () => {
  applyFilter(bookMat, false);
  $('#collection').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => chips.find((c) => c.dataset.filter === bookMat)?.focus({ preventScroll: true }), reduced ? 0 : 700);
});

/* ---------------- mending story ---------------- */
(function mending() {
  const range = $('#mend-range'), out = $('#mend-out'), cap = $('#mend-cap'), auto = $('#mend-auto');
  const warp = $$('#mend-svg .darn--warp'), weft = $$('#mend-svg .darn--weft');
  const hole = $('#mend-svg .mend__hole');
  const chapters = $$('#chapters .chapter');
  let animId = 0;
  function paint(p) {
    const a = Math.min(1, p / 50), b = Math.max(0, (p - 50) / 50);
    warp.forEach((el, j) => { el.style.strokeDashoffset = String(1 - clamp(a * warp.length - j)); });
    weft.forEach((el, j) => { el.style.strokeDashoffset = String(1 - clamp(b * weft.length - j)); });
    hole.style.fillOpacity = String(0.86 - 0.36 * b);
    out.textContent = `${Math.round(p)}%`;
    range.style.setProperty('--p', `${p}%`);
    const active = p >= 100 ? 3 : p >= 50 ? 2 : p > 0 ? 1 : 0;
    chapters.forEach((c, k) => c.classList.toggle('is-active', k === active));
    cap.textContent = [
      'Drag the slider to darn the hole, one thread at a time.',
      'Laying the warp: parallel threads, anchored in sound stitches.',
      'Weaving the weft: over one, under one, alternating each row.',
      'Mended, and good for many more winters. The darn is part of its story now.',
    ][active];
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  range.addEventListener('input', () => { cancelAnimationFrame(animId); paint(+range.value); });
  auto.addEventListener('click', () => {
    cancelAnimationFrame(animId);
    const from = +range.value >= 100 ? 0 : +range.value;
    if (reduced) { range.value = 100; paint(100); return; }
    const t0 = performance.now(), dur = 4200 * (1 - from / 100) + 400;
    const stepF = () => {
      const u = Math.min(1, (performance.now() - t0) / dur);
      const v = from + (100 - from) * u;
      range.value = v; paint(v);
      if (u < 1) animId = requestAnimationFrame(stepF);
    };
    animId = requestAnimationFrame(stepF);
  });
  paint(0);
})();

/* ---------------- reservation form ---------------- */
const form = $('#reserve-form');
const piece = $('#r-piece');
PRODUCTS.forEach((p) => piece.add(new Option(`${p.name} — ${MATERIALS[p.mat].name}, £${p.price}`, p.id)));
const F = {
  piece: { el: piece, err: $('#e-piece'), check: (v) => (v ? '' : 'Please choose a piece.') },
  name: { el: $('#r-name'), err: $('#e-rname'), check: (v) => (v.trim().length < 2 ? 'Please tell us your name.' : '') },
  email: { el: $('#r-email'), err: $('#e-remail'), check: (v) => (!v.trim() ? 'Please add your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'That email address looks incomplete.' : '') },
};
const sizeRadios = $$('input[name="size"]', form), sizeErr = $('#e-size');
function check(f) { const m = f.check(f.el.value); f.err.textContent = m; f.el.setAttribute('aria-invalid', m ? 'true' : 'false'); return !m; }
function validatePiece() { return check(F.piece); }
Object.values(F).forEach((f) => {
  f.el.addEventListener('blur', () => { if (f.el.value) check(f); });
  f.el.addEventListener('input', () => { if (f.el.getAttribute('aria-invalid') === 'true') check(f); });
  f.el.addEventListener('change', () => { if (f.el.getAttribute('aria-invalid') === 'true') check(f); });
});
sizeRadios.forEach((r) => r.addEventListener('change', () => { sizeErr.textContent = ''; }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const okPiece = check(F.piece);
  const size = sizeRadios.find((r) => r.checked);
  sizeErr.textContent = size ? '' : 'Please choose a size.';
  const okName = check(F.name), okEmail = check(F.email);
  const firstBad = !okPiece ? F.piece.el : !size ? sizeRadios[0] : !okName ? F.name.el : !okEmail ? F.email.el : null;
  if (firstBad) { firstBad.focus(); return; }
  const p = PRODUCTS.find((x) => x.id === piece.value);
  $('#reserve-done-title').textContent = `Set aside, ${F.name.el.value.trim().split(/\s+/)[0]}.`;
  $('#reserve-done-text').textContent = `This is a portfolio demo: nothing was sent and nothing has been reserved. In a real workroom, a ${p.name} in size ${size.value} would now be cut for you from the first bolt.`;
  const done = $('#reserve-done');
  done.hidden = false;
  done.focus();
});
$('#reserve-again').addEventListener('click', () => {
  form.reset();
  Object.values(F).forEach((f) => { f.err.textContent = ''; f.el.removeAttribute('aria-invalid'); });
  sizeErr.textContent = '';
  $('#reserve-done').hidden = true;
  piece.focus();
});
