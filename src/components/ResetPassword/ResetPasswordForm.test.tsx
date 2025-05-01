import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordForm from "@/components/ResetPassword/ResetPasswordForm";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";

const mockOnSubmit = jest.fn();

interface ResetPasswordValues {
    newResetPassword: string;
    confirmNewResetPassword: string;
  }
  
  describe("ResetPasswordForm", () => {
    let initialValues: ResetPasswordValues;
  
    beforeEach(() => {
      initialValues = {
        newResetPassword: "",
        confirmNewResetPassword: "",
      };
    });

    test("renders form correctly", () => {
        render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={false} />);
        expect(screen.getByTestId("reset-password-new-password-field")).toBeInTheDocument();
        expect(screen.getByTestId("reset-password-confirm-password-field")).toBeInTheDocument();
        expect(screen.getByTestId("reset-password-submit")).toBeInTheDocument();
      });

  test("validates required fields", async () => {
    render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={false} />);

    fireEvent.click(screen.getByTestId("reset-password-submit"));

    await waitFor(() => {
      expect(screen.getByText(CONSTANT_MESSAGE.RESET_PASSWORD_NEW_PASSWORD_REQUIRED)).toBeInTheDocument();
      expect(screen.getByText(CONSTANT_MESSAGE.RESET_PASSWORD_CONFIRM_PASSWORD_REQUIRED)).toBeInTheDocument();
    });
  });

  test("validates password match", async () => {
    const initialValues = { newResetPassword: "", confirmNewResetPassword: "" };
    const mockOnSubmit = jest.fn();
  
    render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={false} />);
  
    const newPasswordInput = screen.getByTestId("reset-password-new-password-field").querySelector("input");
    const confirmPasswordInput = screen.getByTestId("reset-password-confirm-password-field").querySelector("input");
    const submitButton = screen.getByTestId("reset-password-submit");
  
    if (newPasswordInput && confirmPasswordInput) {
      fireEvent.change(newPasswordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Different123!" } });
    }
  
    fireEvent.click(submitButton);
  
    // Wait for error message to appear
    expect(await screen.findByText(CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORDS_MUST_MATCH)).toBeInTheDocument();
  });

  test("submits form when valid", async () => {
    render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={false} />);

    fireEvent.change(screen.getByTestId("reset-password-new-password-field").querySelector("input")!, {
        target: { value: "Test@1234" }
      });
      fireEvent.change(screen.getByTestId("reset-password-confirm-password-field").querySelector("input")!, {
        target: { value: "Test@1234" }
      });

    fireEvent.click(screen.getByTestId("reset-password-submit"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test("disables submit button when isFormSubmitted is true", () => {
    render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={true} />);

    expect(screen.getByTestId("reset-password-submit")).toBeDisabled();
  });

  test("toggles password visibility", async () => {
    render(<ResetPasswordForm initialValues={initialValues} onSubmit={mockOnSubmit} isFormSubmitted={false} />);
  
    // Get input element inside the Field component
    const passwordInput = screen.getByPlaceholderText("Enter new password");
            
    expect(passwordInput).toHaveAttribute("type", "password");
  
    // Toggle visibility
    const toggleButton = screen.getAllByRole("button", { name: /toggle password visibility/i })[0];
    fireEvent.click(toggleButton);
  
    expect(passwordInput).toHaveAttribute("type", "text");
  });
  
});
