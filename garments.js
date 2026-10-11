/* TERRA & THREAD — shared garment & material data.
   Garment outlines are drawn in an 800 × 600 stage space. */

export const MATERIALS = {
  linen: {
    name: 'Linen', fibre: 'Flax', stroke: '#8A7350', base: '#D8CBAE', deep: '#6F5B3C',
    len: 330, amp: 1.6, freq: 0.03, turns: 7, radius: 16, width: 1.35,
  },
  wool: {
    name: 'Wool', fibre: 'Undyed fleece', stroke: '#4E5B3A', base: '#8C9570', deep: '#3A4429',
    len: 180, amp: 5, freq: 0.12, turns: 5, radius: 26, width: 2.1,
  },
  hemp: {
    name: 'Hemp', fibre: 'Hemp stalk', stroke: '#A65A3A', base: '#CE9878', deep: '#7E3F25',
    len: 300, amp: 2.6, freq: 0.045, turns: 6, radius: 20, width: 1.7,
  },
  cotton: {
    name: 'Cotton', fibre: 'Cotton boll', stroke: '#2E3A5C', base: '#46557E', deep: '#1F2842', weft: '#E6DCC6',
    len: 120, amp: 6, freq: 0.09, turns: 9, radius: 18, width: 1.45,
  },
};
export const MATERIAL_ORDER = ['linen', 'wool', 'hemp', 'cotton'];

export const GARMENTS = {
  shirt: {
    pts: [[362, 118], [300, 138], [232, 170], [192, 318], [238, 330], [268, 222], [272, 512], [528, 512], [532, 222], [562, 330], [608, 318], [568, 170], [500, 138], [438, 118], [400, 152]],
    details: 'M362 118 L392 168 L400 152 L408 168 L438 118 M400 160 V512 M310 214 h56 v52 h-56 z M238 330 L226 304 M562 330 L574 304',
    buttons: [[400, 200], [400, 262], [400, 324], [400, 386], [400, 448]],
  },
  jumper: {
    pts: [[365, 122], [300, 140], [236, 176], [198, 356], [246, 364], [276, 236], [280, 500], [520, 500], [524, 236], [554, 364], [602, 356], [564, 176], [500, 140], [435, 122], [420, 138], [400, 143], [380, 138]],
    details: 'M365 122 Q400 160 435 122 M372 128 Q400 154 428 128 M282 474 H518 M290 476 V500 M310 476 V500 M330 476 V500 M350 476 V500 M370 476 V500 M390 476 V500 M410 476 V500 M430 476 V500 M450 476 V500 M470 476 V500 M490 476 V500 M510 476 V500 M204 330 L250 338 M596 330 L550 338',
    buttons: [],
  },
  smock: {
    pts: [[360, 120], [300, 136], [250, 170], [214, 300], [256, 308], [282, 230], [262, 530], [538, 530], [518, 230], [544, 308], [586, 300], [550, 170], [500, 136], [440, 120], [400, 160]],
    details: 'M360 120 L400 160 L440 120 M290 200 Q400 222 510 200 M330 380 h140 v74 h-140 z M400 380 v74 M266 500 H534',
    buttons: [],
  },
  jacket: {
    pts: [[358, 116], [292, 136], [226, 168], [196, 346], [244, 354], [270, 226], [268, 510], [532, 510], [530, 226], [556, 354], [604, 346], [574, 168], [508, 136], [442, 116], [400, 170]],
    details: 'M358 116 L376 176 L400 170 L424 176 L442 116 M394 176 V510 M300 250 h58 v56 h-58 z M290 380 h70 v70 h-70 z M440 380 h70 v70 h-70 z M200 320 L246 328 M600 320 L554 328',
    buttons: [[394, 214], [394, 280], [394, 346], [394, 412], [394, 478]],
  },
  dress: {
    pts: [[360, 110], [322, 112], [302, 190], [320, 292], [238, 540], [562, 540], [480, 292], [498, 190], [478, 112], [440, 110], [400, 150]],
    details: 'M360 110 Q400 168 440 110 M318 292 Q400 306 482 292 M300 470 Q400 486 500 470',
    buttons: [],
  },
  scarf: {
    pts: [[330, 110], [470, 110], [452, 410], [500, 520], [420, 540], [384, 432], [352, 540], [270, 520], [340, 408]],
    details: 'M340 408 Q396 392 452 410 M274 520 l-6 18 M290 524 l-4 18 M306 528 l-3 18 M322 532 l-2 18 M338 536 l-1 18 M424 540 l2 18 M440 536 l3 18 M456 532 l4 18 M472 528 l5 18 M488 524 l6 18',
    buttons: [],
  },
  trousers: {
    pts: [[300, 120], [500, 120], [522, 530], [432, 530], [403, 252], [397, 252], [368, 530], [278, 530]],
    details: 'M300 142 H500 M400 142 V252 M318 168 Q340 200 352 168 M482 168 Q460 200 448 168 M284 500 H366 M434 500 H516',
    buttons: [[400, 131]],
  },
  tote: {
    pts: [[270, 250], [530, 250], [552, 520], [248, 520]],
    details: 'M318 250 C318 130 482 130 482 250 M338 250 C338 154 462 154 462 250 M276 300 H524',
    buttons: [],
  },
};

export const JOURNEY_GARMENT = { linen: 'shirt', wool: 'jumper', hemp: 'smock', cotton: 'jacket' };

export function polyPath(pts) {
  return `M${pts.map((p) => p.join(' ')).join(' L')} Z`;
}

export function bounds(pts) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pts.forEach(([x, y]) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); });
  return { minX, minY, maxX, maxY };
}

/* horizontal span of the outline at height y that contains (or sits closest to) cx */
export function spanAt(pts, y, cx = 400) {
  const xs = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
  }
  xs.sort((m, n) => m - n);
  let best = null, bestD = Infinity;
  for (let i = 0; i + 1 < xs.length; i += 2) {
    const l = xs[i], r = xs[i + 1];
    const d = cx < l ? l - cx : cx > r ? cx - r : 0;
    if (d < bestD) { bestD = d; best = [l, r]; }
  }
  return best || [cx - 2, cx + 2];
}
