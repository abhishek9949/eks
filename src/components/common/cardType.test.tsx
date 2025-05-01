import React from "react";
import { render, screen } from "@testing-library/react";
import CardType from './CardType';

const course = {
  _id: "123",
  author_name: "Super Admin",
  categories: [{ category_id: 1, name: 'Fluency', color: 'red' }],
  comment_count: 0,
  comments_enabled: false,
  content_type: 'article',
  description: 'This is a test content',
  file: { duration: 30, format: 'jpeg', size: 100, url: ''},
  is_featured: false,
  labels: [],
  tags: ['article'],
  thumbnail_url: '',
  title: 'Test',
  watch_duration: 0
}

describe("Card type", () => {
  it("should render", () => {
    const rendered = render(
      <CardType course={course} cardTypeBg="light" />
    );
    expect(rendered.container).toMatchSnapshot();
  })

  it("should render div with course type text", () => {
    render(
      <CardType course={course} cardTypeBg="light" />
    );
    const element = screen.queryByText('article');
    expect(element).not.toBeNull();
  })

  it("should have white background when cardTypeBg is 'light'", () => {
    render(
      <CardType course={course} cardTypeBg="light" />
    );
    const container = screen.getByText('article').closest('div');
    expect(container).not.toBeNull();
    expect(container?.className).toContain('bg-white');
  });
})