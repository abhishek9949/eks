import React from "react";
import ChatIconComponent from "./ChatIconComponent";
import { render, screen, waitFor } from "@testing-library/react";

describe("chat icon component", () => {
  it ("renders group accordion icon when type is group and it is in accordion", async () => {
    render(
      <ChatIconComponent type="group" width={24} isAccordion />
    )

    await waitFor(() => {
      expect(screen.getByTestId("group-accordion-icon")).toBeInTheDocument();
    })
  })

  it ("renders group icon when type is group and it is not in accordion", async () => {
    render(
      <ChatIconComponent type="group" width={24} />
    )

    await waitFor(() => {
      expect(screen.getByTestId("group-icon")).toBeInTheDocument();
    })
  })

  it ("renders private icon when type is private", async () => {
    render(
      <ChatIconComponent type="private" width={24} />
    )

    await waitFor(() => {
      expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
    })
  })

  it ("renders '#'when type is channel and it is in accordion", async () => {
    render(
      <ChatIconComponent type="channel" width={24} isAccordion />
    )

    await waitFor(() => {
      expect(screen.getByText("#")).toBeInTheDocument();
    })
  })

  it ("renders channel icon when type is channel and it is not in accordion", async () => {
    render(
      <ChatIconComponent type="channel" width={24} />
    )

    await waitFor(() => {
      expect(screen.getByTestId("channel-icon")).toBeInTheDocument();
    })
  })
})