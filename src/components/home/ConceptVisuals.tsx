import React from "react";

interface VisualProps {
  className?: string;
}

/**
 * 01. Bát Quái Đồ (8 Trigrams Bagua)
 */
export function BatQuaiVisual({ className }: VisualProps) {
  const cx = 210;
  const cy = 140;
  const rOuter = 102;
  const rInner = 68;

  // 8 trigrams: name, hanzi, symbol, angle in degrees
  const trigrams = [
    { name: "Càn", hanzi: "☰", a: -90, cardinal: "NAM" },
    { name: "Tốn", hanzi: "☴", a: -45, cardinal: "TÂY NAM" },
    { name: "Khảm", hanzi: "☵", a: 0, cardinal: "TÂY" },
    { name: "Cấn", hanzi: "☶", a: 45, cardinal: "TÂY BẮC" },
    { name: "Khôn", hanzi: "☷", a: 90, cardinal: "BẮC" },
    { name: "Chấn", hanzi: "☳", a: 135, cardinal: "ĐÔNG BẮC" },
    { name: "Ly", hanzi: "☲", a: 180, cardinal: "ĐÔNG" },
    { name: "Đoài", hanzi: "☱", a: 225, cardinal: "ĐÔNG NAM" },
  ];

  // Helper to make octagon points
  const makeOctagon = (r: number) =>
    Array.from({ length: 8 })
      .map((_, i) => {
        const rad = ((i * 45 - 22.5) * Math.PI) / 180;
        return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
      })
      .join(" ");

  return (
    <svg
      viewBox="0 0 420 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Bát Quái Đồ"
    >
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d9b975" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#d9b975" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d9b975" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx={cx} cy={cy} r={rOuter + 25} fill="url(#goldGlow)" />

      {/* Outer decorative octagons */}
      <polygon
        points={makeOctagon(rOuter + 14)}
        stroke="#d9b975"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.45"
      />
      <polygon points={makeOctagon(rOuter)} stroke="#d9b975" strokeWidth="1.5" opacity="0.85" />
      <polygon points={makeOctagon(rInner + 12)} stroke="#cdb28b" strokeWidth="1" opacity="0.5" />

      {/* Radial dividing rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const rad = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx + (rInner - 8) * Math.cos(rad)}
            y1={cy + (rInner - 8) * Math.sin(rad)}
            x2={cx + (rOuter + 2) * Math.cos(rad)}
            y2={cy + (rOuter + 2) * Math.sin(rad)}
            stroke="#d9b975"
            strokeWidth="0.75"
            opacity="0.4"
          />
        );
      })}

      {/* Trigram glyphs */}
      {trigrams.map((t) => {
        const rad = (t.a * Math.PI) / 180;
        const x = cx + (rOuter - 18) * Math.cos(rad);
        const y = cy + (rOuter - 18) * Math.sin(rad);
        const lblX = cx + (rOuter + 25) * Math.cos(rad);
        const lblY = cy + (rOuter + 25) * Math.sin(rad);

        return (
          <g key={t.name}>
            <text
              x={x}
              y={y + 6}
              textAnchor="middle"
              fill="#f5e4b7"
              fontSize="22"
              fontWeight="bold"
              fontFamily="monospace"
              className="select-none"
            >
              {t.hanzi}
            </text>
            <text
              x={lblX}
              y={lblY + 4}
              textAnchor="middle"
              fill="#f5e4b7"
              fontSize="11.5"
              fontWeight="bold"
              letterSpacing="0.04em"
            >
              {t.cardinal}
            </text>
          </g>
        );
      })}

      {/* Central Yin-Yang disc */}
      <circle cx={cx} cy={cy} r="33" fill="#fffaf2" stroke="#d9b975" strokeWidth="1.5" />
      <path
        d={`M ${cx} ${cy - 33} A 33 33 0 0 1 ${cx} ${cy + 33} A 16.5 16.5 0 0 1 ${cx} ${cy} A 16.5 16.5 0 0 0 ${cx} ${cy - 33} Z`}
        fill="#300f0d"
      />
      <circle cx={cx} cy={cy - 16.5} r="4.5" fill="#fffaf2" />
      <circle cx={cx} cy={cy + 16.5} r="4.5" fill="#300f0d" />
      <circle cx={cx} cy={cy} r="33" fill="none" stroke="#d9b975" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * 02. Ngũ Hành Sinh Khắc (Five Elements)
 */
export function NguHanhVisual({ className }: VisualProps) {
  const cx = 190;
  const cy = 138;
  const r = 80;

  // 5 elements placed at 72 degree increments starting from top
  const elements = [
    { name: "Hỏa", hanzi: "火", color: "#c0392b", ringColor: "#f56565", a: -90, desc: "Cung Nam" },
    {
      name: "Thổ",
      hanzi: "土",
      color: "#a87d2e",
      ringColor: "#ecc94b",
      a: -18,
      desc: "Trung Cung",
    },
    { name: "Kim", hanzi: "金", color: "#718096", ringColor: "#cbd5e0", a: 54, desc: "Cung Tây" },
    { name: "Thủy", hanzi: "水", color: "#2563a8", ringColor: "#63b3ed", a: 126, desc: "Cung Bắc" },
    { name: "Mộc", hanzi: "木", color: "#2d6a40", ringColor: "#48bb78", a: 198, desc: "Cung Đông" },
  ];

  const coords = elements.map((el) => {
    const rad = (el.a * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
      ...el,
    };
  });

  // Star points for Tương Khắc (Hỏa -> Kim -> Mộc -> Thổ -> Thủy -> Hỏa)
  // Indices: 0 -> 2 -> 4 -> 1 -> 3 -> 0
  const starPath = `M ${coords[0].x} ${coords[0].y} L ${coords[2].x} ${coords[2].y} L ${coords[4].x} ${coords[4].y} L ${coords[1].x} ${coords[1].y} L ${coords[3].x} ${coords[3].y} Z`;

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Ngũ Hành Sinh Khắc"
    >
      <defs>
        <marker id="arrowGold" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#d9b975" />
        </marker>
        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#e53e3e" opacity="0.8" />
        </marker>
      </defs>

      {/* Outer generating circle (Tương Sinh) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="#d9b975"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.7"
      />

      {/* Inner overcoming star (Tương Khắc) */}
      <path d={starPath} stroke="#e53e3e" strokeWidth="1.25" strokeDasharray="5 3" opacity="0.65" />

      {/* Center label seal - solid opaque background occludes star lines for maximum readability */}
      <circle cx={cx} cy={cy} r="35" fill="#1b0807" stroke="#d9b975" strokeWidth="1.8" />
      <circle
        cx={cx}
        cy={cy}
        r="31"
        fill="#3d120f"
        stroke="#f5e4b7"
        strokeWidth="0.75"
        strokeDasharray="3 2"
        opacity="0.85"
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="13"
        fontWeight="bold"
        fontFamily="serif"
      >
        SINH KHẮC
      </text>
      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="10.5"
        letterSpacing="0.1em"
        fontWeight="bold"
      >
        NGŨ HÀNH
      </text>

      {/* 5 Element nodes */}
      {coords.map((el) => (
        <g key={el.name}>
          <circle cx={el.x} cy={el.y} r="23" fill="#1b120c" stroke={el.ringColor} strokeWidth="2" />
          <circle cx={el.x} cy={el.y} r="19" fill={el.color} opacity="0.35" />
          <text
            x={el.x}
            y={el.y + 6.5}
            textAnchor="middle"
            fill="#fffaf2"
            fontSize="18"
            fontWeight="bold"
            fontFamily="serif"
          >
            {el.hanzi}
          </text>
          <text
            x={el.x}
            y={el.y + 36}
            textAnchor="middle"
            fill="#f5e4b7"
            fontSize="12"
            fontWeight="bold"
          >
            {el.name}
          </text>
        </g>
      ))}

      {/* Legend markers at bottom */}
      <g transform="translate(24, 260)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#d9b975" strokeWidth="2" strokeDasharray="4 2" />
        <text x="26" y="3.5" fill="#d9b975" fontSize="10.5" fontWeight="600">
          Vòng ngoài: Tương Sinh
        </text>
        <line
          x1="180"
          y1="0"
          x2="200"
          y2="0"
          stroke="#e53e3e"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <text x="206" y="3.5" fill="#e53e3e" fontSize="10.5" fontWeight="600" opacity="0.95">
          Đường chéo: Tương Khắc
        </text>
      </g>
    </svg>
  );
}

/**
 * 03. Can Chi (10 Thiên Can · 12 Địa Chi)
 */
export function CanChiVisual({ className }: VisualProps) {
  // 12 palaces boundary representing traditional chart layout
  const gridCells = [
    { label: "TỴ", row: 0, col: 0 },
    { label: "NGỌ", row: 0, col: 1 },
    { label: "MÙI", row: 0, col: 2 },
    { label: "THÂN", row: 0, col: 3 },
    { label: "THÌN", row: 1, col: 0 },
    { label: "DẬU", row: 1, col: 3 },
    { label: "MÃO", row: 2, col: 0 },
    { label: "TUẤT", row: 2, col: 3 },
    { label: "DẦN", row: 3, col: 0 },
    { label: "SỬU", row: 3, col: 1 },
    { label: "TÍ", row: 3, col: 2 },
    { label: "HỢI", row: 3, col: 3 },
  ];

  const ox = 20;
  const oy = 20;
  const colXs = [ox, ox + 76, ox + 76 + 114, ox + 76 + 114 + 114];
  const colWs = [76, 114, 114, 76];
  const rowYs = [oy, oy + 56, oy + 56 + 64, oy + 56 + 64 + 64];
  const rowHs = [56, 64, 64, 56];

  const totalW = 380;
  const totalH = 240;
  const cx = ox + totalW / 2; // 210

  return (
    <svg
      viewBox="0 0 420 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Can Chi"
    >
      {/* Outer border of 12 palaces */}
      <rect
        x={ox}
        y={oy}
        width={totalW}
        height={totalH}
        stroke="#d9b975"
        strokeWidth="1.75"
        fill="#210a09"
        fillOpacity="0.85"
      />

      {/* Grid cells */}
      {gridCells.map((c) => {
        const x = colXs[c.col];
        const y = rowYs[c.row];
        const w = colWs[c.col];
        const h = rowHs[c.row];
        return (
          <g key={c.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              stroke="#cdb28b"
              strokeWidth="0.85"
              fill="#300f0d"
              fillOpacity="0.5"
            />
            <text
              x={x + w / 2}
              y={y + h / 2 + 5.5}
              textAnchor="middle"
              fill="#f5e4b7"
              fontSize="14.5"
              fontWeight="bold"
              fontFamily="serif"
            >
              {c.label}
            </text>
          </g>
        );
      })}

      {/* Center inner courtyard (Thiên Bàn trung cung - spacious 228x128) */}
      <rect
        x={colXs[1]}
        y={rowYs[1]}
        width={colWs[1] + colWs[2]}
        height={rowHs[1] + rowHs[2]}
        fill="#160505"
        stroke="#d9b975"
        strokeWidth="1.5"
      />

      {/* Inner decorative subtle frame */}
      <rect
        x={colXs[1] + 6}
        y={rowYs[1] + 6}
        width={colWs[1] + colWs[2] - 12}
        height={rowHs[1] + rowHs[2] - 12}
        fill="none"
        stroke="#cdb28b"
        strokeWidth="0.6"
        strokeDasharray="3 3"
        opacity="0.4"
      />

      {/* Top 5 Can */}
      <text
        x={cx}
        y={96}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="9.5"
        fontWeight="bold"
        letterSpacing="0.14em"
      >
        10 THIÊN CAN
      </text>
      <text
        x={cx}
        y={113}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="11"
        fontWeight="bold"
        letterSpacing="0.08em"
      >
        GIÁP · ẤT · BÍNH · ĐINH · MẬU
      </text>

      {/* Center seal badge */}
      <rect
        x={cx - 42}
        y={123}
        width="84"
        height="34"
        fill="#9f3028"
        rx="3"
        stroke="#f5e4b7"
        strokeWidth="1.2"
      />
      <text x={cx} y={137} textAnchor="middle" fill="#fffaf2" fontSize="11.5" fontWeight="bold">
        LỤC THẬP
      </text>
      <text
        x={cx}
        y={150}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="10"
        fontWeight="bold"
        letterSpacing="0.08em"
      >
        HOA GIÁP
      </text>

      {/* Bottom 5 Can */}
      <text
        x={cx}
        y={176}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="11"
        fontWeight="bold"
        letterSpacing="0.08em"
      >
        KỶ · CANH · TÂN · NHÂM · QUÝ
      </text>

      {/* Courtyard subtitle */}
      <text
        x={cx}
        y={193}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="0.08em"
        opacity="0.9"
      >
        12 ĐỊA CHI PHỐI 10 THIÊN CAN
      </text>
    </svg>
  );
}

/**
 * 04. Thái Cực & Lưỡng Nghi (Taijitu)
 */
export function ThaiCucVisual({ className }: VisualProps) {
  const cx = 190;
  const cy = 135;
  const r = 80;

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Thái Cực Âm Dương"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Celestial orbit rings */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 30}
        stroke="#d9b975"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.4"
      />
      <circle cx={cx} cy={cy} r={r + 16} stroke="#d9b975" strokeWidth="1" opacity="0.65" />
      <circle
        cx={cx}
        cy={cy}
        r={r + 8}
        stroke="#cdb28b"
        strokeWidth="0.75"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* 24 Solar tick marks around the perimeter */}
      {Array.from({ length: 24 }).map((_, i) => {
        const rad = (i * 15 * Math.PI) / 180;
        const x1 = cx + (r + 12) * Math.cos(rad);
        const y1 = cy + (r + 12) * Math.sin(rad);
        const x2 = cx + (r + 16) * Math.cos(rad);
        const y2 = cy + (r + 16) * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d9b975"
            strokeWidth="1"
            opacity="0.7"
          />
        );
      })}

      {/* Main Taijitu Sphere */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#fffaf2"
        stroke="#d9b975"
        strokeWidth="2"
        filter="url(#glow)"
      />
      {/* Dark Yin half with S-curve */}
      <path
        d={`M ${cx} ${cy - r}
            A ${r} ${r} 0 0 1 ${cx} ${cy + r}
            A ${r / 2} ${r / 2} 0 0 1 ${cx} ${cy}
            A ${r / 2} ${r / 2} 0 0 0 ${cx} ${cy - r} Z`}
        fill="#260b09"
      />

      {/* Eyes */}
      <circle cx={cx} cy={cy - r / 2} r="10" fill="#260b09" stroke="#d9b975" strokeWidth="1" />
      <circle cx={cx} cy={cy + r / 2} r="10" fill="#fffaf2" stroke="#d9b975" strokeWidth="1" />

      {/* Labels */}
      <g transform={`translate(${cx - r - 45}, ${cy})`}>
        <rect
          x="-32"
          y="-16"
          width="64"
          height="32"
          fill="#300f0d"
          stroke="#d9b975"
          strokeWidth="1.2"
          rx="3"
        />
        <text x="0" y="5" textAnchor="middle" fill="#f5e4b7" fontSize="13" fontWeight="bold">
          DƯƠNG
        </text>
      </g>
      <g transform={`translate(${cx + r + 45}, ${cy})`}>
        <rect
          x="-32"
          y="-16"
          width="64"
          height="32"
          fill="#300f0d"
          stroke="#d9b975"
          strokeWidth="1.2"
          rx="3"
        />
        <text x="0" y="5" textAnchor="middle" fill="#f5e4b7" fontSize="13" fontWeight="bold">
          ÂM
        </text>
      </g>

      <text
        x={cx}
        y={cy + r + 40}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        VẠN VẬT QUÂN BÌNH TRONG THÁI CỰC
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * 05. Chưởng Bàn — left hand built from a small numerical skeleton.
 *
 * Proportions follow a drawn reference hand: the palm is the tall mass
 * (≈150 units) and the fingers are shorter (middle finger ≈105, ring .95,
 * index .96, little .65 of it), so the palm — not the fingers — carries the
 * shape. The palm is widest on the knuckle line and tapers to the heel, the
 * thumb leaves the thenar at ≈21° with a rounded armpit corner, and the web
 * between two fingers leaves/enters both flanks along the finger axes.
 *
 * Silhouette, knuckle hatches and the 12 branch badges all derive from the same
 * numbers: editing a base/tip/width below reshapes the whole drawing.
 * ------------------------------------------------------------------------- */
type Pt = { x: number; y: number };
type FingerSkeleton = { base: Pt; tip: Pt; wBase: number; wTip: number };

const pt = (x: number, y: number): Pt => ({ x, y });
const addPt = (a: Pt, b: Pt): Pt => pt(a.x + b.x, a.y + b.y);
const subPt = (a: Pt, b: Pt): Pt => pt(a.x - b.x, a.y - b.y);
const mulPt = (a: Pt, k: number): Pt => pt(a.x * k, a.y * k);
const normPt = (a: Pt): Pt => {
  const len = Math.hypot(a.x, a.y) || 1;
  return pt(a.x / len, a.y / len);
};
// Perpendicular on the +x side while the finger axis points up.
const perpPt = (a: Pt): Pt => pt(-a.y, a.x);
const r2 = (n: number) => Math.round(n * 100) / 100;

const HAND_FINGERS: FingerSkeleton[] = [
  { base: pt(150, 132), tip: pt(126, 34), wBase: 40, wTip: 32 }, // index
  { base: pt(208, 124), tip: pt(198, 20), wBase: 42, wTip: 33 }, // middle
  { base: pt(266, 128), tip: pt(284, 30), wBase: 40, wTip: 32 }, // ring
  { base: pt(318, 142), tip: pt(338, 66), wBase: 34, wTip: 27 }, // little
];
// Knuckle · middle · tip joints, as fractions along each finger axis.
const HAND_JOINTS = [0.14, 0.44, 0.74];
// Webs are drawn per gap: the little finger sits lower, so its web is shallower
// and its three badges would otherwise collide.
const HAND_WEB_DIP = [13, 13, 9];
// How far the fingertip cap reaches down the finger (0 = flat, 1 = round).
const HAND_CAP = 0.34;
const HAND_THUMB: FingerSkeleton = {
  base: pt(128, 188),
  tip: pt(56, 160),
  wBase: 23,
  wTip: 11,
};
// The whole drawing is nudged down and slightly shrunk so the fingertips keep
// air above them on the slide.
const HAND_SCALE = "translate(248 152) scale(0.955) translate(-248 -152)";

function fingerGeom(finger: FingerSkeleton) {
  const axis = normPt(subPt(finger.tip, finger.base));
  const p = perpPt(axis);
  const hw = (t: number) => (finger.wBase + (finger.wTip - finger.wBase) * t) / 2;
  const at = (t: number) => addPt(finger.base, mulPt(subPt(finger.tip, finger.base), t));
  return {
    axis,
    p,
    hw,
    at,
    left: (t: number) => subPt(at(t), mulPt(p, hw(t))),
    right: (t: number) => addPt(at(t), mulPt(p, hw(t))),
  };
}

const HAND_G = HAND_FINGERS.map(fingerGeom);

// The thumb takes full widths (not half) and can bend sideways at its joint.
const HAND_THUMB_G = (() => {
  const { base, tip, wBase, wTip } = HAND_THUMB;
  const axis = normPt(subPt(tip, base));
  const p = perpPt(axis);
  const hw = (t: number) => wBase + (wTip - wBase) * t;
  const at = (t: number, bend = 0) =>
    addPt(addPt(base, mulPt(subPt(tip, base), t)), mulPt(p, bend));
  return {
    axis,
    p,
    at,
    left: (t: number, bend = 0) => subPt(at(t, bend), mulPt(p, hw(t))),
    right: (t: number, bend = 0) => addPt(at(t, bend), mulPt(p, hw(t))),
  };
})();

function buildHandOutline(): string {
  // Deepest point of the web between the thumb and the index finger.
  const web = pt(HAND_G[0].left(0).x + 3, HAND_G[0].left(0).y + 26);
  const d: string[] = [`M ${r2(web.x)} ${r2(web.y)}`];
  const curveTo = (a: Pt, b: Pt, c: Pt) =>
    d.push(`C ${r2(a.x)} ${r2(a.y)} ${r2(b.x)} ${r2(b.y)} ${r2(c.x)} ${r2(c.y)}`);
  const quadTo = (a: Pt, b: Pt) => d.push(`Q ${r2(a.x)} ${r2(a.y)} ${r2(b.x)} ${r2(b.y)}`);

  HAND_FINGERS.forEach((finger, i) => {
    const g = HAND_G[i];
    // Finger flanks bow slightly outwards like real fingers.
    const bulge = (t: number, side: "l" | "r") => {
      const half = g.hw(t) + 2.6;
      const mid = g.at(t);
      return side === "l" ? subPt(mid, mulPt(g.p, half)) : addPt(mid, mulPt(g.p, half));
    };
    quadTo(bulge(0.5, "l"), g.left(1));
    // Rounded, slightly tapered fingertip.
    curveTo(
      addPt(g.left(1), mulPt(g.axis, HAND_CAP * finger.wTip)),
      addPt(g.right(1), mulPt(g.axis, HAND_CAP * finger.wTip)),
      g.right(1),
    );
    quadTo(bulge(0.55, "r"), g.right(0.06));
    if (i < HAND_FINGERS.length - 1) {
      const next = HAND_G[i + 1];
      // Web between two fingers: a rounded U that meets both flanks along the
      // finger axes, so no sharp notch is drawn between them.
      const a = g.right(0.06);
      const b = next.left(0.06);
      const dip = HAND_WEB_DIP[i];
      curveTo(subPt(a, mulPt(g.axis, dip)), subPt(b, mulPt(next.axis, dip)), b);
    }
  });

  // Ulnar edge → heel → base of the palm → thenar → thumb → purlicue.
  const ulnar = HAND_G[3].right(0);
  curveTo(addPt(ulnar, pt(9, 30)), addPt(ulnar, pt(-3, 62)), addPt(ulnar, pt(-8, 86)));
  curveTo(addPt(ulnar, pt(-13, 108)), addPt(ulnar, pt(-46, 124)), addPt(ulnar, pt(-92, 127)));
  curveTo(addPt(ulnar, pt(-140, 130)), addPt(ulnar, pt(-180, 126)), addPt(ulnar, pt(-202, 114)));
  const thumb = HAND_THUMB_G;
  // Thenar eminence climbing into the base of the thumb.
  curveTo(pt(126, 252), pt(120, 228), thumb.left(0.06));
  // Rounded, convex armpit corner where the thenar meets the thumb flank.
  quadTo(addPt(thumb.left(0.06), mulPt(thumb.axis, 12)), thumb.left(0.34));
  quadTo(
    addPt(mulPt(addPt(thumb.left(0.3), thumb.left(1)), 0.5), mulPt(thumb.p, -3)),
    thumb.left(1),
  );
  curveTo(
    addPt(thumb.left(1), mulPt(thumb.axis, 0.52 * 22)),
    addPt(thumb.right(1), mulPt(thumb.axis, 0.52 * 22)),
    thumb.right(1),
  );
  quadTo(
    addPt(mulPt(addPt(thumb.right(1), thumb.right(0.3)), 0.5), mulPt(thumb.p, 3)),
    thumb.right(0.3, 1.2),
  );
  // Purlicue: leaves the thumb flank along its axis and enters the index flank.
  curveTo(
    subPt(thumb.right(0.3, 1.2), mulPt(thumb.axis, 12)),
    subPt(web, mulPt(HAND_G[0].axis, 13)),
    web,
  );
  d.push("Z");
  return d.join(" ");
}

type HandCrease = { d: string; width: number; opacity: number };

// Two short hatches per knuckle, offset like pen strokes around each joint.
function buildHandCreases(): HandCrease[] {
  const out: HandCrease[] = [];
  HAND_FINGERS.forEach((_, i) => {
    const g = HAND_G[i];
    HAND_JOINTS.forEach((t) => {
      const stroke = (offset: number, span: number) => {
        const at = addPt(g.at(t), mulPt(g.axis, offset));
        const a = subPt(at, mulPt(g.p, g.hw(t) * span));
        const b = addPt(at, mulPt(g.p, g.hw(t) * span));
        const mid = subPt(at, mulPt(g.axis, 2));
        return `M ${r2(a.x)} ${r2(a.y)} Q ${r2(mid.x)} ${r2(mid.y)} ${r2(b.x)} ${r2(b.y)}`;
      };
      out.push({ d: stroke(-1.5, 0.95), width: 1.05, opacity: 0.45 });
      out.push({ d: stroke(5.5, 0.75), width: 0.85, opacity: 0.28 });
    });
  });
  const thumb = HAND_THUMB_G;
  const a = thumb.left(0.62);
  const b = thumb.right(0.62);
  const mid = subPt(thumb.at(0.62), mulPt(thumb.axis, 3));
  out.push({
    d: `M ${r2(a.x)} ${r2(a.y)} Q ${r2(mid.x)} ${r2(mid.y)} ${r2(b.x)} ${r2(b.y)}`,
    width: 0.95,
    opacity: 0.35,
  });
  return out;
}

// Palm lines (sinh · trí · tâm đạo) plus a few short hatch marks, kept well
// inside the silhouette so they never read as a second outline.
const HAND_PALM_LINES: HandCrease[] = [
  { d: "M 146 164 C 132 192 138 222 160 242", width: 1.05, opacity: 0.58 },
  { d: "M 138 180 C 180 204 236 212 290 198", width: 1.05, opacity: 0.56 },
  { d: "M 314 166 C 286 150 244 148 210 162", width: 1.05, opacity: 0.48 },
  { d: "M 188 224 C 208 232 232 233 254 228", width: 1, opacity: 0.26 },
  { d: "M 156 234 C 174 243 194 246 212 245", width: 1, opacity: 0.22 },
  { d: "M 300 200 C 308 216 310 232 306 246", width: 1, opacity: 0.22 },
  { d: "M 166 196 C 176 210 180 226 179 240", width: 0.95, opacity: 0.2 },
  { d: "M 288 174 C 295 182 299 192 300 202", width: 0.95, opacity: 0.18 },
];

// Bàn tay bấm cung walk: up the index finger, down the middle, up the ring,
// down the little finger, so the dashed trail never doubles back on itself.
const HAND_BRANCH_LAYOUT = [
  { name: "DẦN", finger: 0, joint: 0 },
  { name: "MÃO", finger: 0, joint: 1 },
  { name: "THÌN", finger: 0, joint: 2 },
  { name: "TỴ", finger: 1, joint: 2 },
  { name: "NGỌ", finger: 1, joint: 1 },
  { name: "MÙI", finger: 1, joint: 0 },
  { name: "THÂN", finger: 2, joint: 0 },
  { name: "DẬU", finger: 2, joint: 1 },
  { name: "TUẤT", finger: 2, joint: 2 },
  { name: "HỢI", finger: 3, joint: 2 },
  { name: "TÝ", finger: 3, joint: 1 },
  { name: "SỬU", finger: 3, joint: 0 },
];

const HAND_OUTLINE = buildHandOutline();
const HAND_CREASES = buildHandCreases();

// Badge centres sit on the joint fractions of each finger axis.
const HAND_BRANCHES = HAND_BRANCH_LAYOUT.map(({ name, finger, joint }) => ({
  name,
  ...HAND_G[finger].at(HAND_JOINTS[joint]),
}));

const HAND_CIRCUIT = `M ${[...HAND_BRANCHES, HAND_BRANCHES[0]]
  .map((b) => `${r2(b.x)} ${r2(b.y)}`)
  .join(" L ")}`;

/**
 * 05. Chưởng Bàn (Bàn tay bấm độn)
 */
export function ChuongBanVisual({ className }: VisualProps) {
  return (
    <svg
      viewBox="0 0 430 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Bàn Tay Bấm Độn"
    >
      <defs>
        <radialGradient id="palmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d9b975" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#d9b975" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="handStroke" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#f0d9a3" />
          <stop offset="60%" stopColor="#dcbc7d" />
          <stop offset="100%" stopColor="#c9a35f" />
        </linearGradient>
        <clipPath id="handClip">
          <path d={HAND_OUTLINE} transform={HAND_SCALE} />
        </clipPath>
      </defs>

      <ellipse cx="216" cy="150" rx="166" ry="152" fill="url(#palmGlow)" />

      <g transform={HAND_SCALE}>
        <path
          d={HAND_OUTLINE}
          fill="#1b0807"
          fillOpacity="0.3"
          stroke="url(#handStroke)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Palm lines and knuckle hatches stay inside the silhouette. */}
        <g clipPath="url(#handClip)">
          {HAND_PALM_LINES.map((c) => (
            <path
              key={c.d}
              d={c.d}
              stroke="#e0c07f"
              strokeWidth={c.width}
              opacity={c.opacity}
              strokeLinecap="round"
            />
          ))}
          {HAND_CREASES.map((c) => (
            <path
              key={c.d}
              d={c.d}
              stroke="#e0c07f"
              strokeWidth={c.width}
              opacity={c.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Dashed trail of the 12 joints in walk order, closed on the first one. */}
        <path
          d={HAND_CIRCUIT}
          stroke="#d9b975"
          strokeWidth="1.3"
          strokeDasharray="3 3"
          opacity="0.4"
        />

        {HAND_BRANCHES.map((b) => (
          <g key={b.name}>
            <circle
              cx={b.x}
              cy={b.y}
              r="10.8"
              fill="#1b0807"
              fillOpacity="0.78"
              stroke="#d9b975"
              strokeWidth="1.3"
            />
            <text
              x={b.x}
              y={b.y + 3.9}
              textAnchor="middle"
              fill="#fffaf2"
              fontSize={b.name.length >= 4 ? 8.7 : 9.6}
              fontWeight="bold"
              fontFamily="serif"
              letterSpacing="-0.2"
            >
              {b.name}
            </text>
          </g>
        ))}
      </g>

      {/* Center Palm Seal */}
      <rect
        x="186"
        y="222"
        width="116"
        height="27"
        rx="3"
        fill="#9f3028"
        stroke="#f5e4b7"
        strokeWidth="1"
      />
      <text
        x="244"
        y="240"
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="11.5"
        fontWeight="bold"
        fontFamily="serif"
      >
        CHƯỞNG QUYẾT
      </text>

      <text
        x="222"
        y="292"
        textAnchor="middle"
        fill="#d9b975"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.06em"
      >
        12 CUNG ĐỊA CHI TRÊN 4 NGÓN TAY TRÁI
      </text>
    </svg>
  );
}

/**
 * 06. Tam Hợp & Xung Chiếu
 */
export function TamHopVisual({ className }: VisualProps) {
  const cx = 190;
  const cy = 135;
  const r = 85;

  // 12 Palaces on circle
  const palaces = [
    { name: "Tí", a: 90 },
    { name: "Sửu", a: 60 },
    { name: "Dần", a: 30 },
    { name: "Mão", a: 0 },
    { name: "Thìn", a: -30 },
    { name: "Tỵ", a: -60 },
    { name: "Ngọ", a: -90 },
    { name: "Mùi", a: -120 },
    { name: "Thân", a: -150 },
    { name: "Dậu", a: 180 },
    { name: "Tuất", a: 150 },
    { name: "Hợi", a: 120 },
  ];

  const getPt = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Tam Hợp: Thân - Tí - Thìn
  const pThan = getPt(-150);
  const pTi = getPt(90);
  const pThin = getPt(-30);

  // Xung Chiếu: Tí - Ngọ
  const pNgo = getPt(-90);

  // Nhị Hợp: Tí - Sửu
  const pSuu = getPt(60);

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Tam Hợp và Xung Chiếu"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="#cdb28b"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Tam Hợp Triangle (Golden fill) */}
      <polygon
        points={`${pThan.x},${pThan.y} ${pTi.x},${pTi.y} ${pThin.x},${pThin.y}`}
        fill="#d9b975"
        fillOpacity="0.2"
        stroke="#d9b975"
        strokeWidth="2"
      />

      {/* Xung Chiếu line (Red laser) */}
      <line
        x1={pTi.x}
        y1={pTi.y}
        x2={pNgo.x}
        y2={pNgo.y}
        stroke="#c0392b"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Nhị Hợp line */}
      <line x1={pTi.x} y1={pTi.y} x2={pSuu.x} y2={pSuu.y} stroke="#2563a8" strokeWidth="1.75" />

      {/* Center Label */}
      <circle cx={cx} cy={cy} r="30" fill="#300f0d" stroke="#d9b975" strokeWidth="1.2" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#f5e4b7" fontSize="10.5" fontWeight="bold">
        THÂN · TÍ · THÌN
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#d9b975" fontSize="9" fontWeight="bold">
        THỦY CỤC
      </text>

      {/* 12 Palaces nodes */}
      {palaces.map((p) => {
        const pt = getPt(p.a);
        const isHighlight =
          p.name === "Thân" || p.name === "Tí" || p.name === "Thìn" || p.name === "Ngọ";
        return (
          <g key={p.name}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isHighlight ? 14 : 10.5}
              fill={isHighlight ? "#9f3028" : "#240b0a"}
              stroke="#d9b975"
              strokeWidth={isHighlight ? 1.75 : 1}
            />
            <text
              x={pt.x}
              y={pt.y + (isHighlight ? 4.5 : 3.5)}
              textAnchor="middle"
              fill="#fffaf2"
              fontSize={isHighlight ? "11.5" : "9"}
              fontWeight="bold"
            >
              {p.name}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(35, 260)">
        <polygon points="0,0 8,-5 8,5" fill="#d9b975" />
        <text x="14" y="3.5" fill="#d9b975" fontSize="10" fontWeight="600">
          Tam Hợp (Thủy Cục)
        </text>
        <line
          x1="125"
          y1="0"
          x2="140"
          y2="0"
          stroke="#c0392b"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
        <text x="146" y="3.5" fill="#e53e3e" fontSize="10" fontWeight="600">
          Xung Chiếu (Tí - Ngọ)
        </text>
        <line x1="260" y1="0" x2="275" y2="0" stroke="#2563a8" strokeWidth="2" />
        <text x="280" y="3.5" fill="#63b3ed" fontSize="10" fontWeight="600">
          Nhị Hợp
        </text>
      </g>
    </svg>
  );
}

/**
 * 07. Vòng Trường Sinh (12 giai đoạn chu kỳ sinh mệnh)
 */
export function VongTruongSinhVisual({ className }: VisualProps) {
  const stages = [
    { name: "Thai", val: 35 },
    { name: "Dưỡng", val: 45 },
    { name: "Trường Sinh", val: 65, peak: true },
    { name: "Mộc Dục", val: 60 },
    { name: "Quan Đới", val: 75 },
    { name: "Lâm Quan", val: 90 },
    { name: "Đế Vượng", val: 100, peak: true },
    { name: "Suy", val: 80 },
    { name: "Bệnh", val: 55 },
    { name: "Tử", val: 30 },
    { name: "Mộ", val: 20 },
    { name: "Tuyệt", val: 10, low: true },
  ];

  const left = 30;
  const top = 35;
  const graphW = 380;
  const graphH = 145;
  const dx = graphW / (stages.length - 1);

  // Compute curve points
  const points = stages.map((s, i) => {
    const x = left + i * dx;
    const y = top + graphH - (s.val / 100) * graphH;
    return { x, y, ...s };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + dx / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + dx / 2;
    const cpy2 = p.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${top + graphH} L ${points[0].x} ${top + graphH} Z`;

  return (
    <svg
      viewBox="0 0 440 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Vòng Trường Sinh"
    >
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9b975" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d9b975" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid horizontal guidelines */}
      <line
        x1={left}
        y1={top}
        x2={left + graphW}
        y2={top}
        stroke="#d9b975"
        strokeWidth="0.75"
        strokeDasharray="3 3"
        opacity="0.3"
      />
      <line
        x1={left}
        y1={top + graphH / 2}
        x2={left + graphW}
        y2={top + graphH / 2}
        stroke="#cdb28b"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.3"
      />
      <line
        x1={left}
        y1={top + graphH}
        x2={left + graphW}
        y2={top + graphH}
        stroke="#d9b975"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Shaded Area */}
      <path d={areaD} fill="url(#waveGrad)" />

      {/* Sinusoidal Curve */}
      <path d={pathD} stroke="#d9b975" strokeWidth="2.5" />

      {/* Stage Dots & Labels with staggered height to prevent any crowding */}
      {points.map((p, idx) => (
        <g key={p.name}>
          <circle
            cx={p.x}
            cy={p.y}
            r={p.peak ? 5.5 : 3.5}
            fill={p.peak ? "#c0392b" : "#fffaf2"}
            stroke="#d9b975"
            strokeWidth={p.peak ? 2 : 1}
          />
          <text
            x={p.x}
            y={top + graphH + (idx % 2 === 0 ? 17 : 33)}
            textAnchor="middle"
            fill={p.peak ? "#f5e4b7" : "#e0cdb1"}
            fontSize={p.peak ? "11" : "9.5"}
            fontWeight={p.peak ? "bold" : "600"}
          >
            {p.name}
          </text>
        </g>
      ))}

      {/* Crown indicator at Đế Vượng */}
      <g transform={`translate(${points[6].x}, ${points[6].y - 18})`}>
        <rect
          x="-32"
          y="-14"
          width="64"
          height="19"
          rx="3"
          fill="#9f3028"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="0" textAnchor="middle" fill="#fffaf2" fontSize="9.5" fontWeight="bold">
          CỰC THỊNH
        </text>
      </g>

      <text
        x="220"
        y={top + graphH + 54}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        CHU KỲ SINH TRƯỞNG · THỊNH SUY 12 VẬN HẠN
      </text>
    </svg>
  );
}

/**
 * 08. Hà Đồ & Lạc Thư (Magic Square 3x3)
 */
export function HaDoLacThuVisual({ className }: VisualProps) {
  // Luo Shu 3x3 layout
  // 4 9 2
  // 3 5 7
  // 8 1 6
  const magic = [
    [
      { num: 4, elem: "Kim", color: "#a0aec0" },
      { num: 9, elem: "Kim", color: "#a0aec0" },
      { num: 2, elem: "Hỏa", color: "#f56565" },
    ],
    [
      { num: 3, elem: "Mộc", color: "#48bb78" },
      { num: 5, elem: "Thổ (Trung)", color: "#ecc94b", center: true },
      { num: 7, elem: "Hỏa", color: "#f56565" },
    ],
    [
      { num: 8, elem: "Mộc", color: "#48bb78" },
      { num: 1, elem: "Thủy", color: "#4299e1" },
      { num: 6, elem: "Thủy", color: "#4299e1" },
    ],
  ];

  const ox = 90;
  const oy = 35;
  const cellSize = 65;

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Hà Đồ Lạc Thư"
    >
      <rect
        x={ox - 6}
        y={oy - 6}
        width={cellSize * 3 + 12}
        height={cellSize * 3 + 12}
        fill="#210a09"
        stroke="#d9b975"
        strokeWidth="1.5"
        rx="4"
      />

      {magic.flatMap((row, rIdx) =>
        row.map((cell, cIdx) => {
          const x = ox + cIdx * cellSize;
          const y = oy + rIdx * cellSize;
          return (
            <g key={`${rIdx}-${cIdx}`}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={cell.center ? "#591816" : "#300f0d"}
                stroke="#d9b975"
                strokeWidth="0.8"
              />
              <circle
                cx={x + cellSize / 2}
                cy={y + cellSize / 2 - 6}
                r="18"
                fill="#1b0807"
                stroke={cell.color}
                strokeWidth="1.75"
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2}
                textAnchor="middle"
                fill="#fffaf2"
                fontSize="18"
                fontWeight="bold"
                fontFamily="serif"
              >
                {cell.num}
              </text>
              <text
                x={x + cellSize / 2}
                y={y + cellSize - 7}
                textAnchor="middle"
                fill="#d9b975"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="0.04em"
              >
                {cell.elem}
              </text>
            </g>
          );
        }),
      )}

      {/* Formula note */}
      <text
        x="190"
        y="255"
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.06em"
      >
        1-6 THỦY · 2-7 HỎA · 3-8 MỘC · 4-9 KIM · 5-10 THỔ
      </text>
    </svg>
  );
}

/**
 * 09. Tứ Hóa Phi Tinh (Lộc · Quyền · Khoa · Kỵ)
 */
export function TuHoaPhiTinhVisual({ className }: VisualProps) {
  const cx = 210;
  const cy = 125;

  return (
    <svg
      viewBox="0 0 420 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Tứ Hóa Phi Tinh"
    >
      <defs>
        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#48bb78" />
        </marker>
        <marker id="arrowRed2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#f56565" />
        </marker>
        <marker id="arrowGold2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#ecc94b" />
        </marker>
        <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#b794f4" />
        </marker>
      </defs>

      {/* Decorative chart board outline - spacious 320x195 */}
      <rect
        x="50"
        y="24"
        width="320"
        height="195"
        fill="#200908"
        stroke="#d9b975"
        strokeWidth="1.5"
        rx="4"
      />

      {/* Corner ticks instead of a busy inner frame */}
      {[
        [58, 32, 1, 1],
        [362, 32, -1, 1],
        [58, 211, 1, -1],
        [362, 211, -1, -1],
      ].map(([x, y, sx, sy]) => (
        <path
          key={`tick-${x}-${y}`}
          d={`M ${x} ${y + 10 * sy} L ${x} ${y} L ${x + 10 * sx} ${y}`}
          stroke="#d9b975"
          strokeWidth="1.2"
          opacity="0.6"
        />
      ))}

      {/* 4 Vector Flow Arcs connecting the 4 quadrants cleanly */}
      {/* 1. Hóa Lộc (Xanh ngọc - Cung Mệnh đến Cung Tài) */}
      <path
        d="M 142 48 Q 210 30 278 48"
        stroke="#48bb78"
        strokeWidth="2.5"
        markerEnd="url(#arrowGreen)"
      />
      {/* 2. Hóa Quyền (Đỏ thắm - Cung Quan qua Mệnh) */}
      <path
        d="M 314 68 Q 235 125 144 178"
        stroke="#f56565"
        strokeWidth="2.5"
        markerEnd="url(#arrowRed2)"
      />
      {/* 3. Hóa Khoa (Vàng kim - Cung Phúc đến Thiên Di) */}
      <path
        d="M 138 178 Q 210 128 280 74"
        stroke="#ecc94b"
        strokeWidth="2.5"
        markerEnd="url(#arrowGold2)"
      />
      {/* 4. Hóa Kỵ (Tím - Cung Phụ Mẫu đến Tật Ách) */}
      <path
        d="M 314 74 L 314 168"
        stroke="#b794f4"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        markerEnd="url(#arrowPurple)"
      />

      {/* Center courtyard seal — stamped on top of the flight lines so the
          two characters stay readable where the arrows cross. */}
      <circle cx={cx} cy={cy} r="27" fill="#1b0807" stroke="#d9b975" strokeWidth="1.4" />
      <circle
        cx={cx}
        cy={cy}
        r="22"
        fill="none"
        stroke="#d9b975"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.8"
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="12"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="0.04em"
      >
        PHI
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="12"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="0.04em"
      >
        TINH
      </text>

      {/* 4 Badges in 4 Distinct Quadrants */}
      {/* Top Left: LỘC */}
      <g transform="translate(108, 48)">
        <rect
          x="-38"
          y="-14"
          width="76"
          height="28"
          rx="3"
          fill="#2d6a40"
          stroke="#f5e4b7"
          strokeWidth="1.2"
        />
        <text x="0" y="6" textAnchor="middle" fill="#fffaf2" fontSize="12" fontWeight="bold">
          祿 LỘC
        </text>
      </g>

      {/* Top Right: QUYỀN */}
      <g transform="translate(314, 48)">
        <rect
          x="-38"
          y="-14"
          width="76"
          height="28"
          rx="3"
          fill="#9e2b1e"
          stroke="#f5e4b7"
          strokeWidth="1.2"
        />
        <text x="0" y="6" textAnchor="middle" fill="#fffaf2" fontSize="12" fontWeight="bold">
          權 QUYỀN
        </text>
      </g>

      {/* Bottom Left: KHOA */}
      <g transform="translate(108, 187)">
        <rect
          x="-38"
          y="-14"
          width="76"
          height="28"
          rx="3"
          fill="#8a6420"
          stroke="#f5e4b7"
          strokeWidth="1.2"
        />
        <text x="0" y="6" textAnchor="middle" fill="#fffaf2" fontSize="12" fontWeight="bold">
          科 KHOA
        </text>
      </g>

      {/* Bottom Right: KỴ */}
      <g transform="translate(314, 187)">
        <rect
          x="-38"
          y="-14"
          width="76"
          height="28"
          rx="3"
          fill="#553c9a"
          stroke="#f5e4b7"
          strokeWidth="1.2"
        />
        <text x="0" y="6" textAnchor="middle" fill="#fffaf2" fontSize="12" fontWeight="bold">
          忌 KỴ
        </text>
      </g>

      <text
        x={cx}
        y="255"
        textAnchor="middle"
        fill="#d9b975"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        MẠNG LƯỚI PHI HÓA BIẾN DỊCH VẬN MỆNH
      </text>
    </svg>
  );
}

/**
 * 10. Tam Tài: Thiên – Địa – Nhân
 */
export function TamTaiVisual({ className }: VisualProps) {
  const cx = 210;
  const cy = 135;

  // 3 outer sacred triangle points at 120°
  const trianglePoints = Array.from({ length: 3 })
    .map((_, i) => {
      const rad = ((i * 120 - 90) * Math.PI) / 180;
      return `${cx + 106 * Math.cos(rad)},${cy + 106 * Math.sin(rad)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 420 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Tam Tài Thiên Địa Nhân"
    >
      {/* 3 Concentric Celestial Discs - wide and spacious */}
      {/* Outer: THIÊN BÀN (r=106) */}
      <circle
        cx={cx}
        cy={cy}
        r="106"
        stroke="#d9b975"
        strokeWidth="1.5"
        fill="#240b0a"
        fillOpacity="0.85"
      />
      <circle
        cx={cx}
        cy={cy}
        r="98"
        stroke="#d9b975"
        strokeWidth="0.75"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Middle: ĐỊA BÀN (r=74) */}
      <circle
        cx={cx}
        cy={cy}
        r="74"
        stroke="#cdb28b"
        strokeWidth="1.3"
        fill="#300f0d"
        fillOpacity="0.9"
      />
      <circle
        cx={cx}
        cy={cy}
        r="66"
        stroke="#cdb28b"
        strokeWidth="0.75"
        strokeDasharray="2 3"
        opacity="0.45"
      />

      {/* Inner: NHÂN BÀN (r=44) */}
      <circle cx={cx} cy={cy} r="44" stroke="#f5e4b7" strokeWidth="1.5" fill="#4d1512" />

      {/* Connecting sacred triangle along outer rim - does not cut through text */}
      <polygon
        points={trianglePoints}
        fill="#d9b975"
        fillOpacity="0.04"
        stroke="#d9b975"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.55"
      />
      {Array.from({ length: 3 }).map((_, i) => {
        const rad = ((i * 120 - 90) * Math.PI) / 180;
        const x = cx + 106 * Math.cos(rad);
        const y = cy + 106 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#d9b975" stroke="#1b0807" strokeWidth="1" />
        );
      })}

      {/* Center Seal 人 */}
      <circle cx={cx} cy={cy} r="18" fill="#9f3028" stroke="#fffaf2" strokeWidth="1.2" />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="17"
        fontWeight="bold"
        fontFamily="serif"
      >
        人
      </text>

      {/* Labels positioned in the golden center of each spacious realm ring */}
      <text
        x={cx}
        y={cy - 86}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="11.5"
        fontWeight="bold"
        letterSpacing="0.08em"
      >
        THIÊN BÀN · TIÊN THIÊN
      </text>

      <text
        x={cx}
        y={cy - 56}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="10.5"
        fontWeight="bold"
        letterSpacing="0.06em"
      >
        ĐỊA BÀN · CĂN CƠ
      </text>

      <text
        x={cx}
        y={cy + 33}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="10"
        fontWeight="bold"
        letterSpacing="0.06em"
      >
        NHÂN BÀN
      </text>

      <text
        x={cx}
        y="255"
        textAnchor="middle"
        fill="#d9b975"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        TAM TÀI ĐỒNG QUY · BẢN NGUYÊN VẬN MỆNH
      </text>
    </svg>
  );
}

export function ConceptVisualRenderer({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "bat-quai":
      return <BatQuaiVisual className={className} />;
    case "ngu-hanh":
      return <NguHanhVisual className={className} />;
    case "can-chi":
      return <CanChiVisual className={className} />;
    case "thai-cuc":
      return <ThaiCucVisual className={className} />;
    case "chuong-ban":
      return <ChuongBanVisual className={className} />;
    case "tam-hop-xung-chieu":
      return <TamHopVisual className={className} />;
    case "vong-truong-sinh":
      return <VongTruongSinhVisual className={className} />;
    case "ha-do-lac-thu":
      return <HaDoLacThuVisual className={className} />;
    case "tu-hoa-phi-tinh":
      return <TuHoaPhiTinhVisual className={className} />;
    case "tam-tai":
      return <TamTaiVisual className={className} />;
    default:
      return <BatQuaiVisual className={className} />;
  }
}
