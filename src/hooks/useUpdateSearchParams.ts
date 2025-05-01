"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function useUpdateSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateSearchParams = (updates: Record<string, string | string[] | null | number>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, JSON.stringify(value)); // Store arrays as JSON strings
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getSearchParamsAsObject = (names?: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const result: Record<string, string | string[]> = {};

    params.forEach((value, key) => {
      if (!names || names.includes(key)) {
        try {
          const parsedValue = JSON.parse(value);
          result[key] = Array.isArray(parsedValue) ? parsedValue : value;
        } catch {
          result[key] = value; // If not JSON, keep it as a string
        }
      }
    });

    return result;
  };

  return { updateSearchParams, getSearchParamsAsObject };
}
  