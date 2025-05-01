import { FormikHelpers } from "formik";

export interface ForgotPasswordInitialValue {
  email: string;
}

export type ForgotPasswordFormProps = {
  initialValues: ForgotPasswordInitialValue;
  onSubmit: (
    values: ForgotPasswordInitialValue,
    formikHelpers: FormikHelpers<ForgotPasswordInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};
