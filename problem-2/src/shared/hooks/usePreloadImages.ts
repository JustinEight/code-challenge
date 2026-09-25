import { useEffect, useState } from "react";
import { isImagePreloaded, preloadImage } from "@/shared/utils/preloadImage";

const DEFAULT_TIMEOUT_MS = 10_000;

export interface PreloadImagesState {
  done: boolean;
  loaded: number;
  total: number;
}

const countPreloaded = (urls: readonly string[]) =>
  urls.filter(isImagePreloaded).length;

export function usePreloadImages(
  urls: readonly string[],
  timeoutMs = DEFAULT_TIMEOUT_MS,
): PreloadImagesState {
  const [loaded, setLoaded] = useState(() => countPreloaded(urls));
  const [timedOut, setTimedOut] = useState(false);
  const urlsKey = urls.join("\n");

  useEffect(() => {
    const currentUrls = urlsKey ? urlsKey.split("\n") : [];
    let cancelled = false;
    setLoaded(countPreloaded(currentUrls));
    setTimedOut(false);

    for (const url of currentUrls) {
      if (isImagePreloaded(url)) continue;
      preloadImage(url).then(() => {
        if (!cancelled) setLoaded((count) => count + 1);
      });
    }

    const timer = window.setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [urlsKey, timeoutMs]);

  return {
    done: loaded >= urls.length || timedOut,
    loaded: Math.min(loaded, urls.length),
    total: urls.length,
  };
}
