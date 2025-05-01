import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatFilter from "./ChatFilter";
import { FilterConstants } from "@/constants/chats";

const mockHandleCloseFilter = jest.fn();

const renderComponent = () => {
  render(<ChatFilter handleCloseFilter={mockHandleCloseFilter} />);
}
describe("ChatFilter Component", () => {
  it("should render the component", () => {
    renderComponent();
    expect(screen.getByText("All activity")).toBeInTheDocument();
  });

  it("should display all filter options", () => {
    renderComponent();
    FilterConstants.allActivity.forEach((filter) => {
      expect(screen.getByText(filter.title)).toBeInTheDocument();
    });
  });

  it("should select a filter option when clicked", async() => {
    renderComponent();
    const firstFilterOption = screen.getByText(FilterConstants.allActivity[0].title);
    
    act(() =>fireEvent.click(firstFilterOption));
    
    await waitFor(() => expect(screen.getByRole("radio", { name: FilterConstants.allActivity[0].title })).toBeChecked());
  });

  it("should call handleCloseFilter when clicking Cancel", async () => {
    renderComponent();
    act(() => fireEvent.click(screen.getByText("Cancel")));
    await waitFor(() => expect(mockHandleCloseFilter).toHaveBeenCalledTimes(1));
  });

  it("should apply filter when clicking Apply", () => {
    renderComponent();
    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);
    // Add any additional assertions based on expected behavior
  });
});
