import { useTheme, type ThemePreference } from "@/shared/hooks/useTheme";
import "./ThemeSwitcher.css";

const OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Colour theme">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          className={
            theme === option.value
              ? "theme-switcher__option theme-switcher__option--active"
              : "theme-switcher__option"
          }
          onClick={() => setTheme(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
