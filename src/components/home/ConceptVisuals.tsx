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
              y={lblY + 3.5}
              textAnchor="middle"
              fill="#d9b975"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.04em"
              opacity="0.9"
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

      {/* Center label seal */}
      <circle cx={cx} cy={cy} r="24" fill="#300f0d" stroke="#d9b975" strokeWidth="1" />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="10"
        fontWeight="600"
        fontFamily="serif"
      >
        SINH KHẮC
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="7.5"
        letterSpacing="0.08em"
        opacity="0.85"
      >
        NGŨ HÀNH
      </text>

      {/* 5 Element nodes */}
      {coords.map((el) => (
        <g key={el.name}>
          <circle
            cx={el.x}
            cy={el.y}
            r="21"
            fill="#1b120c"
            stroke={el.ringColor}
            strokeWidth="1.75"
          />
          <circle cx={el.x} cy={el.y} r="17" fill={el.color} opacity="0.3" />
          <text
            x={el.x}
            y={el.y + 6}
            textAnchor="middle"
            fill="#fffaf2"
            fontSize="15"
            fontWeight="bold"
            fontFamily="serif"
          >
            {el.hanzi}
          </text>
          <text
            x={el.x}
            y={el.y + 32}
            textAnchor="middle"
            fill="#f5e4b7"
            fontSize="9"
            fontWeight="bold"
          >
            {el.name}
          </text>
        </g>
      ))}

      {/* Legend markers at bottom */}
      <g transform="translate(70, 260)">
        <line
          x1="0"
          y1="0"
          x2="20"
          y2="0"
          stroke="#d9b975"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text x="26" y="3" fill="#d9b975" fontSize="8.5" fontWeight="500">
          Vòng ngoài: Tương Sinh
        </text>
        <line
          x1="130"
          y1="0"
          x2="150"
          y2="0"
          stroke="#e53e3e"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text x="156" y="3" fill="#e53e3e" fontSize="8.5" fontWeight="500" opacity="0.9">
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

  const ox = 50;
  const oy = 25;
  const w = 70;
  const h = 55;

  const stems = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

  return (
    <svg
      viewBox="0 0 380 280"
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
        width={w * 4}
        height={h * 4}
        stroke="#d9b975"
        strokeWidth="1.5"
        fill="#210a09"
        fillOpacity="0.8"
      />

      {/* Grid cells */}
      {gridCells.map((c) => {
        const x = ox + c.col * w;
        const y = oy + c.row * h;
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
              fillOpacity="0.45"
            />
            <text
              x={x + w / 2}
              y={y + h / 2 + 5}
              textAnchor="middle"
              fill="#f5e4b7"
              fontSize="12"
              fontWeight="bold"
              fontFamily="serif"
            >
              {c.label}
            </text>
          </g>
        );
      })}

      {/* Center inner courtyard (Thiên Bàn trung cung) */}
      <rect
        x={ox + w}
        y={oy + h}
        width={w * 2}
        height={h * 2}
        fill="#1a0706"
        stroke="#d9b975"
        strokeWidth="1.2"
      />

      {/* Center seal & 10 Can orbit */}
      <circle
        cx={ox + w * 2}
        cy={oy + h * 2}
        r="38"
        stroke="#d9b975"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <rect
        x={ox + w * 2 - 28}
        y={oy + h * 2 - 20}
        width="56"
        height="40"
        fill="#9f3028"
        rx="2"
        stroke="#f5e4b7"
        strokeWidth="1"
      />
      <text
        x={ox + w * 2}
        y={oy + h * 2 - 4}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="9.5"
        fontWeight="bold"
      >
        LỤC THẬP
      </text>
      <text
        x={ox + w * 2}
        y={oy + h * 2 + 10}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="8.5"
        letterSpacing="0.08em"
      >
        HOA GIÁP
      </text>

      {/* 10 Can horizontal ribbons */}
      <g transform={`translate(${ox + w + 12}, ${oy + h + 14})`}>
        <text fill="#d9b975" fontSize="7.5" fontWeight="600" opacity="0.9">
          10 THIÊN CAN:
        </text>
        <text y="14" fill="#f5e4b7" fontSize="7.5" letterSpacing="0.04em">
          {stems.slice(0, 5).join(" · ")}
        </text>
      </g>
      <g transform={`translate(${ox + w + 12}, ${oy + h * 2 + 28})`}>
        <text y="14" fill="#f5e4b7" fontSize="7.5" letterSpacing="0.04em">
          {stems.slice(5).join(" · ")}
        </text>
      </g>
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
          x="-30"
          y="-14"
          width="60"
          height="28"
          fill="#300f0d"
          stroke="#d9b975"
          strokeWidth="1"
          rx="2"
        />
        <text x="0" y="4" textAnchor="middle" fill="#f5e4b7" fontSize="10" fontWeight="bold">
          DƯƠNG
        </text>
      </g>
      <g transform={`translate(${cx + r + 45}, ${cy})`}>
        <rect
          x="-30"
          y="-14"
          width="60"
          height="28"
          fill="#300f0d"
          stroke="#d9b975"
          strokeWidth="1"
          rx="2"
        />
        <text x="0" y="4" textAnchor="middle" fill="#f5e4b7" fontSize="10" fontWeight="bold">
          ÂM
        </text>
      </g>

      <text
        x={cx}
        y={cy + r + 40}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="10"
        letterSpacing="0.08em"
      >
        VẠN VẬT QUÂN BÌNH TRONG THÁI CỰC
      </text>
    </svg>
  );
}

/**
 * 05. Chưởng Bàn (Bàn tay bấm độn)
 */
export function ChuongBanVisual({ className }: VisualProps) {
  // Hand joints for 12 branches
  const branches = [
    { name: "Tí", x: 175, y: 195, note: "Gốc Áp út" },
    { name: "Sửu", x: 145, y: 195, note: "Gốc Giữa" },
    { name: "Dần", x: 115, y: 195, note: "Gốc Trỏ" },
    { name: "Mão", x: 115, y: 135, note: "Đốt 2 Trỏ" },
    { name: "Thìn", x: 115, y: 75, note: "Đầu Trỏ" },
    { name: "Tỵ", x: 155, y: 55, note: "Đầu Giữa" },
    { name: "Ngọ", x: 195, y: 55, note: "Đầu Áp út" },
    { name: "Mùi", x: 235, y: 75, note: "Đầu Út" },
    { name: "Thân", x: 235, y: 135, note: "Đốt 2 Út" },
    { name: "Dậu", x: 235, y: 195, note: "Gốc Út" },
    { name: "Tuất", x: 205, y: 195, note: "Đốt 2 Áp út" },
    { name: "Hợi", x: 175, y: 135, note: "Đốt 2 Giữa" },
  ];

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Bàn Tay Bấm Độn"
    >
      {/* Palm silhouette */}
      <path
        d="M 100 240
           C 95 190, 95 110, 105 70
           C 110 50, 125 50, 130 70
           L 135 110
           L 142 50
           C 145 35, 165 35, 168 50
           L 172 105
           L 182 50
           C 185 35, 205 35, 208 50
           L 212 110
           L 220 70
           C 223 55, 243 55, 246 70
           C 255 120, 255 190, 245 240
           Z"
        fill="#300f0d"
        stroke="#d9b975"
        strokeWidth="1.5"
        opacity="0.85"
      />

      {/* Thumb contour on the left */}
      <path
        d="M 98 200
           C 70 185, 65 140, 78 125
           C 88 115, 102 125, 106 145"
        stroke="#d9b975"
        strokeWidth="1.5"
        fill="#300f0d"
        opacity="0.75"
      />

      {/* Connecting loop for the finger circuit */}
      <path
        d="M 175 195 L 145 195 L 115 195 L 115 135 L 115 75 L 155 55 L 195 55 L 235 75 L 235 135 L 235 195 L 205 195 L 175 135"
        stroke="#f5e4b7"
        strokeWidth="1.25"
        strokeDasharray="3 3"
        opacity="0.65"
      />

      {/* 12 Joints Nodes */}
      {branches.map((b) => (
        <g key={b.name}>
          <circle cx={b.x} cy={b.y} r="11" fill="#1f0807" stroke="#d9b975" strokeWidth="1.5" />
          <text
            x={b.x}
            y={b.y + 4}
            textAnchor="middle"
            fill="#fffaf2"
            fontSize="9"
            fontWeight="bold"
            fontFamily="serif"
          >
            {b.name}
          </text>
        </g>
      ))}

      {/* Palm center stamp */}
      <rect
        x="145"
        y="145"
        width="60"
        height="24"
        rx="3"
        fill="#9f3028"
        stroke="#f5e4b7"
        strokeWidth="1"
      />
      <text x="175" y="160" textAnchor="middle" fill="#fffaf2" fontSize="9" fontWeight="bold">
        CHƯỞNG QUYẾT
      </text>

      <text
        x="190"
        y="265"
        textAnchor="middle"
        fill="#d9b975"
        fontSize="9.5"
        letterSpacing="0.06em"
      >
        12 LÓNG TAY AN SAO & TÍNH ĐẠI TIỂU HẠN
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
      <circle cx={cx} cy={cy} r="26" fill="#300f0d" stroke="#d9b975" strokeWidth="1" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#f5e4b7" fontSize="9" fontWeight="bold">
        THÂN · TÍ · THÌN
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#d9b975" fontSize="7.5">
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
              r={isHighlight ? 13 : 9}
              fill={isHighlight ? "#9f3028" : "#240b0a"}
              stroke="#d9b975"
              strokeWidth={isHighlight ? 1.5 : 1}
            />
            <text
              x={pt.x}
              y={pt.y + (isHighlight ? 4 : 3)}
              textAnchor="middle"
              fill="#fffaf2"
              fontSize={isHighlight ? "10" : "8"}
              fontWeight="bold"
            >
              {p.name}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(45, 260)">
        <polygon points="0,0 8,-5 8,5" fill="#d9b975" />
        <text x="14" y="3" fill="#d9b975" fontSize="8.5">
          Tam Hợp (Thủy Cục)
        </text>
        <line
          x1="120"
          y1="0"
          x2="135"
          y2="0"
          stroke="#c0392b"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
        <text x="140" y="3" fill="#c0392b" fontSize="8.5">
          Xung Chiếu (Tí - Ngọ)
        </text>
        <line x1="245" y1="0" x2="260" y2="0" stroke="#2563a8" strokeWidth="2" />
        <text x="265" y="3" fill="#63b3ed" fontSize="8.5">
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
            y={top + graphH + (idx % 2 === 0 ? 16 : 30)}
            textAnchor="middle"
            fill={p.peak ? "#f5e4b7" : "#e0cdb1"}
            fontSize={p.peak ? "9.5" : "8.5"}
            fontWeight={p.peak ? "bold" : "600"}
          >
            {p.name}
          </text>
        </g>
      ))}

      {/* Crown indicator at Đế Vượng */}
      <g transform={`translate(${points[6].x}, ${points[6].y - 16})`}>
        <rect
          x="-28"
          y="-13"
          width="56"
          height="17"
          rx="3"
          fill="#9f3028"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="-1" textAnchor="middle" fill="#fffaf2" fontSize="8.5" fontWeight="bold">
          CỰC THỊNH
        </text>
      </g>

      <text
        x="220"
        y={top + graphH + 52}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="10"
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
                cy={y + cellSize / 2 - 4}
                r="16"
                fill="#1b0807"
                stroke={cell.color}
                strokeWidth="1.5"
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2 + 2}
                textAnchor="middle"
                fill="#fffaf2"
                fontSize="15"
                fontWeight="bold"
                fontFamily="serif"
              >
                {cell.num}
              </text>
              <text
                x={x + cellSize / 2}
                y={y + cellSize - 8}
                textAnchor="middle"
                fill="#d9b975"
                fontSize="7"
                letterSpacing="0.04em"
              >
                {cell.elem}
              </text>
            </g>
          );
        }),
      )}

      {/* Formula note */}
      <text x="190" y="255" textAnchor="middle" fill="#f5e4b7" fontSize="9" letterSpacing="0.06em">
        1-6 THỦY · 2-7 HỎA · 3-8 MỘC · 4-9 KIM · 5-10 THỔ
      </text>
    </svg>
  );
}

/**
 * 09. Tứ Hóa Phi Tinh (Lộc · Quyền · Khoa · Kỵ)
 */
export function TuHoaPhiTinhVisual({ className }: VisualProps) {
  const cx = 190;

  return (
    <svg
      viewBox="0 0 380 280"
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

      {/* Decorative chart board outline */}
      <rect
        x="70"
        y="30"
        width="240"
        height="190"
        fill="#200908"
        stroke="#d9b975"
        strokeWidth="1.5"
        rx="3"
      />
      <rect
        x="130"
        y="75"
        width="120"
        height="100"
        fill="#300f0d"
        stroke="#d9b975"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* 4 Vector Flow Arcs */}
      {/* 1. Hóa Lộc (Xanh ngọc - Cung Mệnh đến Cung Tài) */}
      <path
        d="M 95 60 Q 150 40 265 60"
        stroke="#48bb78"
        strokeWidth="2.5"
        markerEnd="url(#arrowGreen)"
      />
      {/* 2. Hóa Quyền (Đỏ thắm - Cung Quan đến Mệnh) */}
      <path
        d="M 285 100 Q 220 130 95 180"
        stroke="#f56565"
        strokeWidth="2.5"
        markerEnd="url(#arrowRed2)"
      />
      {/* 3. Hóa Khoa (Vàng kim - Cung Phúc đến Thiên Di) */}
      <path
        d="M 95 100 Q 190 90 285 180"
        stroke="#ecc94b"
        strokeWidth="2.5"
        markerEnd="url(#arrowGold2)"
      />
      {/* 4. Hóa Kỵ (Tím - Cung Phụ Mẫu đến Tật Ách) */}
      <path
        d="M 285 60 Q 170 180 160 205"
        stroke="#b794f4"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        markerEnd="url(#arrowPurple)"
      />

      {/* 4 Badges */}
      <g transform="translate(145, 50)">
        <rect
          x="-18"
          y="-10"
          width="36"
          height="20"
          rx="3"
          fill="#2d6a40"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="4" textAnchor="middle" fill="#fffaf2" fontSize="9" fontWeight="bold">
          祿 LỘC
        </text>
      </g>
      <g transform="translate(235, 115)">
        <rect
          x="-18"
          y="-10"
          width="36"
          height="20"
          rx="3"
          fill="#9e2b1e"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="4" textAnchor="middle" fill="#fffaf2" fontSize="9" fontWeight="bold">
          權 QUYỀN
        </text>
      </g>
      <g transform="translate(190, 155)">
        <rect
          x="-18"
          y="-10"
          width="36"
          height="20"
          rx="3"
          fill="#8a6420"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="4" textAnchor="middle" fill="#fffaf2" fontSize="9" fontWeight="bold">
          科 KHOA
        </text>
      </g>
      <g transform="translate(100, 135)">
        <rect
          x="-18"
          y="-10"
          width="36"
          height="20"
          rx="3"
          fill="#553c9a"
          stroke="#f5e4b7"
          strokeWidth="1"
        />
        <text x="0" y="4" textAnchor="middle" fill="#fffaf2" fontSize="9" fontWeight="bold">
          忌 KỴ
        </text>
      </g>

      <text x={cx} y="250" textAnchor="middle" fill="#d9b975" fontSize="9.5" letterSpacing="0.08em">
        MẠNG LƯỚI PHI HÓA BIẾN DỊCH VẬN MỆNH
      </text>
    </svg>
  );
}

/**
 * 10. Tam Tài: Thiên – Địa – Nhân
 */
export function TamTaiVisual({ className }: VisualProps) {
  const cx = 190;
  const cy = 135;

  return (
    <svg
      viewBox="0 0 380 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Tam Tài Thiên Địa Nhân"
    >
      {/* 3 Concentric Celestial Discs */}
      {/* Outer: THIÊN BÀN */}
      <circle
        cx={cx}
        cy={cy}
        r="95"
        stroke="#d9b975"
        strokeWidth="1.5"
        fill="#240b0a"
        fillOpacity="0.8"
      />
      <circle
        cx={cx}
        cy={cy}
        r="88"
        stroke="#d9b975"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.6"
      />

      {/* Middle: ĐỊA BÀN */}
      <circle
        cx={cx}
        cy={cy}
        r="65"
        stroke="#cdb28b"
        strokeWidth="1.2"
        fill="#300f0d"
        fillOpacity="0.9"
      />
      <circle
        cx={cx}
        cy={cy}
        r="58"
        stroke="#cdb28b"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.5"
      />

      {/* Inner: NHÂN BÀN */}
      <circle cx={cx} cy={cy} r="35" stroke="#f5e4b7" strokeWidth="1.5" fill="#591816" />

      {/* Center Seal */}
      <circle cx={cx} cy={cy} r="14" fill="#9f3028" stroke="#fffaf2" strokeWidth="1" />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="11"
        fontWeight="bold"
        fontFamily="serif"
      >
        人
      </text>

      {/* Labels positioned along rings */}
      <text
        x={cx}
        y={cy - 72}
        textAnchor="middle"
        fill="#f5e4b7"
        fontSize="8.5"
        fontWeight="bold"
        letterSpacing="0.1em"
      >
        THIÊN BÀN · TIÊN THIÊN
      </text>
      <text
        x={cx}
        y={cy - 44}
        textAnchor="middle"
        fill="#d9b975"
        fontSize="8"
        fontWeight="bold"
        letterSpacing="0.08em"
      >
        ĐỊA BÀN · CĂN CƠ
      </text>
      <text
        x={cx}
        y={cy + 25}
        textAnchor="middle"
        fill="#fffaf2"
        fontSize="7.5"
        fontWeight="bold"
        letterSpacing="0.06em"
      >
        NHÂN BÀN
      </text>

      {/* Connecting sacred triangle */}
      {Array.from({ length: 3 }).map((_, i) => {
        const rad = ((i * 120 - 90) * Math.PI) / 180;
        const x = cx + 95 * Math.cos(rad);
        const y = cy + 95 * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#d9b975" />
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#d9b975" strokeWidth="0.8" opacity="0.4" />
          </g>
        );
      })}

      <text x={cx} y="255" textAnchor="middle" fill="#d9b975" fontSize="9" letterSpacing="0.08em">
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
