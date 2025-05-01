import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Forbidden from "@/components/Forbidden";
import { useRouter } from "next/navigation";

// Mock `useRouter`
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Forbidden Component", () => {
  it("renders the 403 Forbidden message", () => {
    render(<Forbidden />);
    
    expect(screen.getByText("403")).toBeInTheDocument();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText("You don’t have permission to access this page.")).toBeInTheDocument();
  });

  it("renders the 'Go back' button and triggers router.back()", () => {
    const mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

    render(<Forbidden />);
    const backButton = screen.getByText("Go back");

    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
