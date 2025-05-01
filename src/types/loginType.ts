import { FormikHelpers } from "formik";

export interface LoginInitialValue {
  email: string;
  password: string;
}

export type LoginFormProps = {
  initialValues: LoginInitialValue;
  onSubmit: (
    values: LoginInitialValue,
    formikHelpers: FormikHelpers<LoginInitialValue>,
  ) => void | Promise<void>;
  isLoading: boolean;
  isLoginPath: boolean;
};
