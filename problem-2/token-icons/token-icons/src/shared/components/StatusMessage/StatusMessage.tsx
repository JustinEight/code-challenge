import type { ReactNode } from "react";
import "./StatusMessage.css";

interface StatusMessageProps {
  children: ReactNode;
  tone?: "default" | "error";
}

export function StatusMessage({
  children,
  tone = "default",
}: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
