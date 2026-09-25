import { useEffect, useState, type DependencyList } from "react";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function useAsync<T>(
  load: () => Promise<T>,
  deps: DependencyList,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    load().then(
      (data) => {
        if (!cancelled) setState({ status: "success", data });
      },
      (error: unknown) => {
        if (!cancelled)
          setState({
            status: "error",
            error: error instanceof Error ? error : new Error(String(error)),
          });
      },
    );

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}
