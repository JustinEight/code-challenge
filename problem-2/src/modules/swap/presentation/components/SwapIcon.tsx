interface SwapIconProps {
  size?: number;
}

export function SwapIcon({ size = 18 }: SwapIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M7 4v14m0 0-3.5-3.5M7 18l3.5-3.5M17 20V6m0 0-3.5 3.5M17 6l3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
