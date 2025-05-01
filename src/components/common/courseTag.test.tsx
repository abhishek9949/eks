import React from "react";
import { render, screen } from "@testing-library/react";
import CourseTag from "./CourseTag";

const tags = [
  { name: "Tag1", color: "green" },
  { name: "Tag2", color: "red" },
];

describe("CourseTag Component", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<CourseTag tags={tags} />);
    expect(container).toMatchSnapshot();
  });

  it("renders the correct number of tags", () => {
    render(<CourseTag tags={tags} />);

    // Assert that the correct number of tag elements are rendered
    const tagDivs = screen.getAllByText(/Tag/);
    expect(tagDivs).toHaveLength(tags.length);
  });

  it("renders each tag with the correct name", () => {
    render(<CourseTag tags={tags} />);

    // Use a regular expression to match the text including #
    tags.forEach((tag) => {
      expect(screen.getByText(new RegExp(`#${tag.name}`, "i"))).toBeInTheDocument();
    });
  });
});
