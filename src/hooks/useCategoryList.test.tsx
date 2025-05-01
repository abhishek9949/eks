import { renderHook, act } from "@testing-library/react";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useLazyGetCategoryQuery } from "@/redux/allReducer";
import { CategoryListResponse } from "@/types/community";

jest.mock("@/redux/allReducer", () => ({
  useLazyGetCategoryQuery: jest.fn(),
}));

describe("useCategoryList Hook", () => {
  let getCategoryMock: jest.Mock;

  beforeEach(() => {
    getCategoryMock = jest.fn();
    (useLazyGetCategoryQuery as jest.Mock).mockReturnValue([getCategoryMock]);
  });

  it("should fetch and return category list successfully", async () => {
    const mockData: CategoryListResponse = {
      data: [
        { category_id: 1, name: "Tech", color: "#ff0000" },
        { category_id: 2, name: "Health", color: "#00ff00" },
      ],
      message: ""
    };

    getCategoryMock.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(mockData),
    });

    const { result } = renderHook(() => useCategoryList());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.categoryList).toEqual(mockData.data);
  });

  it("should handle API error correctly", async () => {
    getCategoryMock.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error("API Error")),
    });

    const { result } = renderHook(() => useCategoryList());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.categoryList).toEqual([]);
  });
});
