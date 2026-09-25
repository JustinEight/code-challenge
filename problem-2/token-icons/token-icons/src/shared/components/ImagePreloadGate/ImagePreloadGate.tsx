import type { ReactNode } from "react";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";
import { usePreloadImages } from "@/shared/hooks/usePreloadImages";

interface ImagePreloadGateProps {
  urls: readonly string[];
  loadingLabel?: string;
  children: ReactNode;
}

export function ImagePreloadGate({
  urls,
  loadingLabel,
  children,
}: ImagePreloadGateProps) {
  const { done } = usePreloadImages(urls);

  if (!done) return <LoadingIndicator label={loadingLabel} />;

  return <>{children}</>;
}
