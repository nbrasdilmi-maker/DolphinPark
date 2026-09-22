type WavesProps = {
  fill?: string;
  flip?: boolean;
  className?: string;
};

export function Waves({ fill = "#ffffff", flip = false, className }: WavesProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", transform: flip ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M0,80 C240,110 480,50 720,80 C960,110 1200,50 1440,80 L1440,120 L0,120 Z"
        fill={fill}
        opacity="0.45"
      />
      <path
        d="M0,104 C240,120 480,88 720,104 C960,120 1200,88 1440,104 L1440,120 L0,120 Z"
        fill={fill}
      />
    </svg>
  );
}