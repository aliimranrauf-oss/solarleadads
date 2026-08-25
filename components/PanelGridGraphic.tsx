// Signature visual: a grid of solar-panel cells that also reads as a performance
// chart — cells "light up" in a staggered wave to suggest both sunlight and
// campaign activity. Pure SVG + CSS animation, no external image dependency.
// Swap this component out for a real photo later without touching layout —
// see the comment in Hero.tsx for where the swap happens.

const ROWS = 5;
const COLS = 6;

function cellDelay(row: number, col: number) {
  return ((row + col) * 0.12).toFixed(2);
}

function cellHeight(row: number, col: number) {
  // deterministic pseudo-variation so the "chart" silhouette feels intentional,
  // taller near the bottom-right to suggest upward performance trend
  const base = 0.4 + (row * COLS + col) / (ROWS * COLS) * 0.5;
  return base;
}

export default function PanelGridGraphic() {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-trust-100 via-leaf-50 to-amber-100 blur-2xl opacity-70" />
      <svg viewBox="0 0 360 300" className="w-full drop-shadow-xl" role="img" aria-label="Illustration of a solar panel grid representing ad campaign performance">
        {/* roof frame */}
        <path d="M20 260 L180 40 L340 260 Z" fill="#0B2545" opacity="0.06" />
        <line x1="20" y1="260" x2="340" y2="260" stroke="#0B2545" strokeOpacity="0.15" strokeWidth="2" />

        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            const cellW = 42;
            const cellH = 32;
            const gap = 4;
            const gridW = COLS * (cellW + gap) - gap;
            const startX = 180 - gridW / 2;
            const x = startX + col * (cellW + gap);
            const y = 70 + row * (cellH + gap);
            const opacityScale = cellHeight(row, col);

            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                rx={3}
                fill={row % 2 === 0 ? "#1B6CA8" : "#2E9E5B"}
                style={{
                  opacity: 0.25 + opacityScale * 0.6,
                  animation: `panelPulse 3.6s ease-in-out ${cellDelay(row, col)}s infinite`,
                }}
              />
            );
          })
        )}

        {/* sun accent, upper right, floats gently */}
        <circle cx="308" cy="42" r="16" fill="#F2A93B" className="animate-floatSlow" style={{ transformOrigin: "308px 42px" }} />
      </svg>
    </div>
  );
}
