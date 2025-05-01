import React from "react";
import { render, screen } from "@testing-library/react";
import ImageComponent from "./ImageComponent";
import CardType from "./CardType";
import { IndividualContentCardProps } from "@/types/content";
import StoreProvider from "@/redux/StoreProvider";

jest.mock("next/image", () => {
  const MockNextImage = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  MockNextImage.displayName = "MockNextImage"; // Add display name
  return MockNextImage;
});

jest.mock("./CardType", () => jest.fn(() => <div>CardType</div>)); // Mock CardType

describe("ImageComponent", () => {
  const courseMock = {
    _id: "123",
    author_name: "John Doe",
    categories: [],
    comment_count: 0,
    comments_enabled: true,
    content_type: "article",
    description: "Sample course description",
    file: {
      url: "/files/sample.pdf",
      duration: 120, // Assuming a sample duration in seconds
      format: "pdf",
      size: 1048576, // Assuming size in bytes (1MB)
    },
    is_featured: false,
    labels: ["new"],
    tags: ["education"],
    thumbnail_url: "/images/sample-thumbnail.jpg",
    title: "Sample Course",
    watch_duration: 1200,
  } satisfies IndividualContentCardProps;

  it("should render the course image with default height", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} />
      </StoreProvider>
    );
    const element = screen.getByAltText('Course Image');
    expect(element).not.toBeNull();
  });

  it("should pass the correct props to the CardType component", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} cardTypeBg="light" />
      </StoreProvider>
    );
    expect(CardType).toHaveBeenCalledWith(
      expect.objectContaining({
        course: courseMock,
        cardTypeBg: "light",
      }),
      {}
    );
  });

  it("should render the course image with a custom height", () => {
    const customHeight = "20vh";
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} height={customHeight} />
      </StoreProvider>
    );
    const imageContainer = screen.getByAltText("Course Image").parentElement;
    const styles = window.getComputedStyle(imageContainer as HTMLElement);
    expect(styles.minHeight).toBe(customHeight);
  });

  it("should render the bin image with the correct source when cardTypeBg is light", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} cardTypeBg="light" />
      </StoreProvider>
    );
    const binImage = screen.getByAltText("Bin Image");
    expect(binImage.getAttribute("src")).toBe("/svg/AddToBinDark.svg");
  });

  it("should render the bin image with the correct source when cardTypeBg is dark", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} cardTypeBg="dark" />
      </StoreProvider>
    );
    const binImage = screen.getByAltText("Bin Image");
    expect(binImage.getAttribute("src")).toBe("/svg/AddToBinLight.svg");
  });

  it("should apply the correct classes for light background", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} cardTypeBg="light" />
      </StoreProvider>
    );
    const binContainer = screen.getByAltText("Bin Image").parentElement;
    expect(binContainer).not.toBeNull();
    expect(binContainer?.classList.contains("bg-white")).toBe(true);
  });

  it("should apply the correct classes for dark background", () => {
    render(
      <StoreProvider>
        <ImageComponent course={courseMock} cardTypeBg="dark" />
      </StoreProvider>
    );
    const binContainer = screen.getByAltText("Bin Image").parentElement;
    expect(binContainer).not.toBeNull(); // Ensure the element exists
    expect(binContainer?.classList.contains("bg-gray-6")).toBe(true);
  });
});
