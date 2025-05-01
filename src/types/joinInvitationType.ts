import { FormikHelpers } from "formik";

export interface JoinInvitationInitialValue {
  email: string | null;
  newPassword: string;
  confirmNewPassword: string;
}

export type JoinInvitationFormProps = {
  initialValues: JoinInvitationInitialValue;
  onSubmit: (
    values: JoinInvitationInitialValue,
    formikHelpers: FormikHelpers<JoinInvitationInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};
