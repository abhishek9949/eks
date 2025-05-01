import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateChannelForm from "@/components/admin/ChatsAdminComponents/Channel/Create/CreateChannelForm";
import StoreProvider from "@/redux/StoreProvider";

describe("CreateChannelForm", () => {
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    initialValues: {
      channel_name: "",
      channel_description: "",
      is_public: true,
    },
    onSubmit: mockOnSubmit,
    isFormSubmitted: false,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders the form fields", () => {
    render(
      <StoreProvider>
        <CreateChannelForm {...defaultProps} />
      </StoreProvider>
    );

    expect(screen.getByPlaceholderText("Channel name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Channel description")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("validates form fields", async () => {
    render(
      <StoreProvider>
        <CreateChannelForm {...defaultProps} />
      </StoreProvider>
    );

    const submitButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Channel name is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Channel description is required")
    ).toBeInTheDocument();
  });

  it("submits form when valid values are provided", async () => {
    render(
      <StoreProvider>
        <CreateChannelForm {...defaultProps} />
      </StoreProvider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText("Channel name"), {
      target: { value: "General" },
    });

    fireEvent.change(screen.getByPlaceholderText("Channel description"), {
      target: { value: "General discussion channel" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    // Wait for Formik validation and submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          channel_name: "General",
          channel_description: "General discussion channel",
          is_public: true,
        },
        expect.anything()
      );
    });
  });
});
