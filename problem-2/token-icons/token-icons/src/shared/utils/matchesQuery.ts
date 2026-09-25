export function matchesQuery(value: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  return q === "" || value.toLowerCase().includes(q);
}
