import React from "react";
import { render, screen } from "@testing-library/react";
import CustomAvatar from "@/components/common/CustomAvatar";
import PersonIcon from "@mui/icons-material/Person";


describe("CustomAvatar Component", () => {
  test("renders initials when no image is provided", () => {
    render(<CustomAvatar name="John Doe" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  test("applies correct background color when bgColor prop is provided", () => {
    render(<CustomAvatar name="Alice" bgColor="red" />);
    expect(screen.getByTestId("custom-avatar")).toHaveStyle("background-color: red");
  });

  test("generates a consistent background color for a given name when randomColor is true", () => {
    render(<CustomAvatar name="Alice" randomColor />);
    const avatar = screen.getByTestId("custom-avatar");

    // Check that background color is correctly applied
    const bgColor = window.getComputedStyle(avatar).backgroundColor;
    expect(bgColor).toMatch(/^(rgb|hsl)\(/); // Should be in RGB or HSL format
  });

  test("displays an icon if provided", () => {
    render(<CustomAvatar icon={<PersonIcon data-testid="avatar-icon" />} />);
    expect(screen.getByTestId("avatar-icon")).toBeInTheDocument();
  });

  test("renders an image if src is provided", () => {
    render(<CustomAvatar src="/path/to/image.jpg" />);

    // Look for an `img` element instead of using `data-testid`
    const avatarImage = screen.getByRole("img");

    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("src", "/path/to/image.jpg");
  });
});
