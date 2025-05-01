import { FormikHelpers } from "formik";

export interface SignupInitialValue {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupFormProps = {
  initialValues: SignupInitialValue;
  onSubmit: (
    values: SignupInitialValue,
    formikHelpers: FormikHelpers<SignupInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};

export interface CreateUserType {
  message: string;
  user: {
    email_id: string;
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface CreateUserError {
  data: {
    error: string;
  };
}

export interface Answer {
  [key: number]: (number | string)[];
}

export interface OtherInputs {
  [key: number]: string;
}
