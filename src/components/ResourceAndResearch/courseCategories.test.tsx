import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCategories from "./CourseCategories";
import { CourseCategoriesProps } from "@/types/course";

// Mock data for filters
const mockFilters = [
  { category_id: 2, name: "Vocabulary" },
  { category_id: 3, name: "Writing" },
  { category_id: 4, name: "Verbal" },
];

describe("CourseCategories", () => {
  const filters: CourseCategoriesProps["filters"] = mockFilters;

  it("renders the default selected filter as 'All'", () => {
    render(
      <CourseCategories
        filters={filters}
        selectedCategoryFilter={null}
        handleFilterCategoryList={jest.fn()}
        isCategoriesLoading={false}
      />,
    );

    const defaultButton = screen.getByText(/All/)?.parentElement;
    expect(defaultButton?.className).toContain("bg-primary text-white");
  });

  it("changes the selected filter when a button is clicked", () => {
    // Mock state to simulate the parent component's state
    let selectedCategoryFilter = null;
    const handleFilterCategoryList = jest.fn((filterId) => {
      selectedCategoryFilter = filterId; // Update the state
    });

    const { rerender } = render(
      <CourseCategories
        filters={filters}
        selectedCategoryFilter={selectedCategoryFilter}
        handleFilterCategoryList={handleFilterCategoryList}
        isCategoriesLoading={false}
      />,
    );

    // Click on "Vocabulary" button
    const vocabularyButton = screen.getByText("Vocabulary")?.parentElement;
    if (vocabularyButton) {
      fireEvent.click(vocabularyButton);
    }

    // Re-render the component with the updated state
    rerender(
      <CourseCategories
        filters={filters}
        selectedCategoryFilter={selectedCategoryFilter}
        handleFilterCategoryList={handleFilterCategoryList}
        isCategoriesLoading={false}
      />,
    );

    // Check if the "Vocabulary" button is now selected
    expect(vocabularyButton?.className).toContain("bg-primary text-white");
    // Check if the "All" button is no longer selected
    expect(screen.getByText(/All/)?.parentElement?.className).toContain(
      "bg-white text-black",
    );
  });
});
