import { FormikHelpers } from "formik";

export interface FooterInitialValue {
  email: string;
}

export type FooterFormProps = {
  initialValues: FooterInitialValue;
  onSubmit: (
    values: FooterInitialValue,
    formikHelpers: FormikHelpers<FooterInitialValue>,
  ) => void | Promise<void>;
};
