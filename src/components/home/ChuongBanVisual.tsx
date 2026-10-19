// The illustration is a separately licensed CC BY-SA 3.0 asset. Attribution
// and modification details: public/illustrations/left-palm.LICENSE.txt.

// Anatomical order, from the thumb side towards the little finger. Coordinates
// annotate the artwork; they must never be used to reshape the fingers.
const BRANCHES = [
  { name: "Dần", finger: "index", x: 245, y: 121, labelX: 288 },
  { name: "Mão", finger: "index", x: 254, y: 87, labelX: 296 },
  { name: "Thìn", finger: "index", x: 261, y: 57, labelX: 303 },
  { name: "Tỵ", finger: "middle", x: 208, y: 37 },
  { name: "Ngọ", finger: "middle", x: 210, y: 77 },
  { name: "Mùi", finger: "middle", x: 215, y: 116 },
  { name: "Thân", finger: "ring", x: 180, y: 124 },
  { name: "Dậu", finger: "ring", x: 173, y: 91 },
  { name: "Tuất", finger: "ring", x: 164, y: 60, labelX: 126 },
  { name: "Hợi", finger: "little", x: 123, y: 107, labelX: 88 },
  { name: "Tý", finger: "little", x: 137, y: 126, labelX: 99 },
  { name: "Sửu", finger: "little", x: 152, y: 145, labelX: 112 },
];

export function ChuongBanVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="60 10 300 310"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Bàn Tay Bấm Độn"
    >
      <desc>
        Lòng bàn tay trái hướng về người xem, ngón cái bên phải. Mười hai địa chi trên bốn ngón: trỏ
        Dần, Mão, Thìn; giữa Mùi, Ngọ, Tỵ; áp út Thân, Dậu, Tuất; út Sửu, Tý, Hợi, từ gốc lên.
      </desc>
      <image href="/illustrations/left-palm.svg" width="430" height="320" />

      {BRANCHES.map((branch) => (
        <g key={branch.name} data-branch={branch.name} data-finger={branch.finger}>
          {branch.labelX !== undefined ? (
            <>
              <path
                d={
                  branch.labelX < branch.x
                    ? `M ${branch.labelX + 13} ${branch.y} H ${branch.x - 5}`
                    : `M ${branch.x + 5} ${branch.y} H ${branch.labelX - 13}`
                }
                stroke="#d9b975"
                strokeWidth="0.7"
                opacity="0.65"
              />
              <circle cx={branch.x} cy={branch.y} r="1.3" fill="#edd39b" />
            </>
          ) : null}
          <text
            x={branch.labelX ?? branch.x}
            y={branch.y + 3.5}
            textAnchor="middle"
            fill="#fff3d8"
            stroke="#611d17"
            strokeWidth="3"
            paintOrder="stroke"
            strokeLinejoin="round"
            fontSize="10"
            fontWeight="600"
            fontFamily="serif"
          >
            {branch.name}
          </text>
        </g>
      ))}

      <text
        x="215"
        y="295"
        textAnchor="middle"
        fill="#d9b975"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        12 ĐỊA CHI · LÒNG BÀN TAY TRÁI
      </text>
      <a href="/illustrations/left-palm.LICENSE.txt" target="_blank" rel="noreferrer">
        <text x="215" y="313" textAnchor="middle" fill="#d9b975" fontSize="7.5" opacity="0.8">
          Dáng tay: LucasVB / Kenny sh · CC BY-SA 3.0 · đã chỉnh sửa
        </text>
      </a>
    </svg>
  );
}
