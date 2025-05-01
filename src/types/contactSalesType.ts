import { FormikHelpers } from "formik";

export interface ContactSalesPayload {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  company: string;
  country: string;
  message: string;
}

export interface ContactSalesInitialValue {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  company_name: string;
  country: string;
  contact_reason: string;
}

export type ContactSalesFormProps = {
  initialValues: ContactSalesInitialValue;
  onSubmit: (
    values: ContactSalesInitialValue,
    formikHelpers: FormikHelpers<ContactSalesInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};
