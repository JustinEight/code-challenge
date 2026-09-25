const pending = new Map<string, Promise<void>>();
const settled = new Set<string>();
const retained: HTMLImageElement[] = [];

export function preloadImage(url: string): Promise<void> {
  let promise = pending.get(url);
  if (!promise) {
    const image = new Image();
    image.src = url;
    retained.push(image);
    promise = image
      .decode()
      .catch(() => undefined)
      .then(() => {
        settled.add(url);
      });
    pending.set(url, promise);
  }
  return promise;
}

export function isImagePreloaded(url: string): boolean {
  return settled.has(url);
}
