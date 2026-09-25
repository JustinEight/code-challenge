import { useCallback } from "react";
import { useSearchParams } from "react-router";

const PARAM = "q";

export function useSearchQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(PARAM) ?? "";

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        (params) => {
          if (value) params.set(PARAM, value);
          else params.delete(PARAM);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [query, setQuery] as const;
}
