type DolphinMotifProps = {
  stroke?: string;
  className?: string;
};

export function DolphinMotif({ stroke = "#19c6ee", className }: DolphinMotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 160"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M28 100 C44 76 76 58 104 56 C132 54 156 66 172 86 C184 102 190 118 192 130" />
        <path d="M192 130 C202 120 210 116 214 118" />
        <path d="M192 130 C199 138 204 144 208 150" />
        <path d="M118 58 C124 44 132 40 138 46 C136 56 130 62 124 66" />
        <path d="M104 56 C108 70 112 84 124 96" />
        <path d="M124 96 C100 92 78 96 60 110" />
      </g>
    </svg>
  );
}