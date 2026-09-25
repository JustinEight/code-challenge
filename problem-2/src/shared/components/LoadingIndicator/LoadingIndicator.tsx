import { Spinner } from "@/shared/components/Spinner/Spinner";
import { StatusMessage } from "@/shared/components/StatusMessage/StatusMessage";
import "./LoadingIndicator.css";

interface LoadingIndicatorProps {
  label?: string;
}

export function LoadingIndicator({
  label = "Loading…",
}: LoadingIndicatorProps) {
  return (
    <StatusMessage>
      <span className="loading-indicator">
        <Spinner />
        {label}
      </span>
    </StatusMessage>
  );
}
