import { FormikHelpers } from "formik";
export interface ResetPasswordInitialValue {
  newResetPassword: string;
  confirmNewResetPassword: string;
}

export type ResetPasswordFormProps = {
  initialValues: ResetPasswordInitialValue;
  onSubmit: (
    values: ResetPasswordInitialValue,
    formikHelpers: FormikHelpers<ResetPasswordInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};
