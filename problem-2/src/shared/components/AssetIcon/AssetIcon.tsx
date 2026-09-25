import "./AssetIcon.css";

interface AssetIconProps {
  url?: string;
  label: string;
  size?: number;
}

export function AssetIcon({ url, label, size = 48 }: AssetIconProps) {
  if (!url) {
    return (
      <span
        className="asset-icon asset-icon--fallback"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-label={label}
        role="img"
      >
        {label.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="asset-icon"
      src={url}
      alt={label}
      width={size}
      height={size}
    />
  );
}
