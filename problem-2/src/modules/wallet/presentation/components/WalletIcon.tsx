interface WalletIconProps {
  size?: number;
}

export function WalletIcon({ size = 18 }: WalletIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17a1 1 0 0 1 1 1v2M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M4 7.5A1.5 1.5 0 0 0 5.5 9H19a1 1 0 0 1 1 1v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12h-3.5a1.5 1.5 0 0 0 0 3H20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
