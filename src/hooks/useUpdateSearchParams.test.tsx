import { renderHook, act } from "@testing-library/react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

// Mock Next.js navigation functions
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe("useUpdateSearchParams Hook", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("?sort=asc&filter=%5B%22popular%22%5D"));
    (usePathname as jest.Mock).mockReturnValue("/products");
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("should update search params correctly", () => {
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.updateSearchParams({ sort: "desc", page: "2" });
    });

    expect(pushMock).toHaveBeenCalledWith("/products?sort=desc&filter=%5B%22popular%22%5D&page=2", { scroll: false });
  });

  it("should remove search params correctly", () => {
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.updateSearchParams({ sort: null });
    });

    expect(pushMock).toHaveBeenCalledWith("/products?filter=%5B%22popular%22%5D", { scroll: false });
  });

  it("should handle array search params correctly", () => {
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.updateSearchParams({ tags: ["react", "nextjs"] });
    });

    expect(pushMock).toHaveBeenCalledWith(
        `/products?sort=asc&filter=%5B%22popular%22%5D&tags=${encodeURIComponent(JSON.stringify(["react", "nextjs"]))}`,
        { scroll: false }
    );
  });

  it("should get search params as an object", () => {
    const { result } = renderHook(() => useUpdateSearchParams());

    const params = result.current.getSearchParamsAsObject();

    expect(params).toEqual({
      sort: "asc",
      filter: ["popular"],
    });
  });

  it("should get specific search params", () => {
    const { result } = renderHook(() => useUpdateSearchParams());

    const params = result.current.getSearchParamsAsObject(["sort"]);

    expect(params).toEqual({ sort: "asc" });
  });

  it("should correctly parse JSON arrays in search params", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("?categories=%5B%22tech%22,%22science%22%5D"));

    const { result } = renderHook(() => useUpdateSearchParams());

    const params = result.current.getSearchParamsAsObject();

    expect(params).toEqual({ categories: ["tech", "science"] });
  });
});
