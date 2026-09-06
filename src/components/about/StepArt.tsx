export type StepArtKind =
  "need" | "data" | "priority" | "initiative" | "resources" | "impact";

const A = "#16B3A0";

/** رسوم مسطّحة ترافق محطات المسار — مكتوبة يدويًا لا صورًا نمطية. */
export function StepArt({ kind }: { kind: StepArtKind }) {
  return (
    <svg viewBox="0 0 360 220" role="img" aria-hidden="true">
      {kind === "need" && (
        <>
          <rect
            x="106"
            y="26"
            width="148"
            height="168"
            rx="18"
            fill="none"
            stroke={A}
            strokeWidth="1.6"
            opacity=".55"
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="128"
              y={58 + i * 34}
              width="104"
              height="12"
              rx="6"
              fill={A}
              opacity={0.5 - i * 0.13}
            />
          ))}
          <circle cx="180" cy="164" r="16" fill={A} opacity=".22" />
          <path
            d="M172 164h16M180 156v16"
            stroke={A}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}

      {kind === "data" &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const w = 150 - i * 22;
          return (
            <rect
              key={i}
              x={180 - w / 2}
              y={28 + i * 28}
              width={w}
              height="17"
              rx="8"
              fill={A}
              opacity={0.18 + i * 0.11}
            />
          );
        })}

      {kind === "priority" &&
        [70, 110, 150].map((y, i) => (
          <g key={y}>
            <rect
              x="60"
              y={y}
              width={[230, 170, 120][i]}
              height="22"
              rx="11"
              fill={[A, "#8FA9BC", "#33566A"][i]}
              opacity={[0.85, 0.5, 0.4][i]}
            />
            <text
              x="54"
              y={y + 16}
              fill="#8FA9BC"
              fontSize="13"
              textAnchor="end"
            >
              {["عالية", "متوسطة", "منخفضة"][i]}
            </text>
          </g>
        ))}

      {kind === "initiative" && (
        <>
          <rect
            x="46"
            y="44"
            width="120"
            height="132"
            rx="16"
            fill="none"
            stroke="rgba(234,242,245,.25)"
            strokeWidth="1.4"
          />
          <rect
            x="194"
            y="44"
            width="120"
            height="132"
            rx="16"
            fill="rgba(22,179,160,.12)"
            stroke={A}
            strokeWidth="1.6"
          />
          <path
            d="M172 110h16m-6-6 6 6-6 6"
            stroke={A}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="106"
            y="116"
            fill="#8FA9BC"
            fontSize="14"
            textAnchor="middle"
          >
            تقدير
          </text>
          <text
            x="254"
            y="116"
            fill="#EAF2F5"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            أرقام
          </text>
        </>
      )}

      {kind === "resources" && (
        <>
          <circle
            cx="180"
            cy="110"
            r="34"
            fill="rgba(22,179,160,.18)"
            stroke={A}
            strokeWidth="1.6"
          />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = ((-90 + i * 72) * Math.PI) / 180;
            const x = 180 + 82 * Math.cos(a);
            const y = 110 + 82 * Math.sin(a);
            return (
              <g key={i}>
                <line
                  x1="180"
                  y1="110"
                  x2={x}
                  y2={y}
                  stroke={A}
                  strokeWidth="1.2"
                  opacity=".45"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="15"
                  fill="#0A1722"
                  stroke={A}
                  strokeWidth="1.6"
                />
              </g>
            );
          })}
        </>
      )}

      {kind === "impact" && (
        <>
          <path
            d="M40 178 L108 150 L176 158 L244 112 L312 62"
            fill="none"
            stroke={A}
            strokeWidth="2.4"
          />
          {[40, 108, 176, 244, 312].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={[178, 150, 158, 112, 62][i]}
              r="6"
              fill={A}
            />
          ))}
          <path d="M312 62 l-2 22 22-2 Z" fill={A} opacity=".7" />
        </>
      )}
    </svg>
  );
}
