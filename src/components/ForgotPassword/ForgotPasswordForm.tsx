import React from "react";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { Button, Grid2, TextField, Typography, Box } from "@mui/material";
import { ForgotPasswordFormProps } from "@/types/forgotPasswordType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { validateEmail } from "@/utils/validationData";

const ForgotPasswordForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: ForgotPasswordFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        email: string()
          .required(CONSTANT_MESSAGE.EMAIL_REQUIRED)
          .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
          .matches(validateEmail, CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid2 container spacing={2} className="!mb-5">
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography className="!text-gray-900 !text-lg" variant="subtitle1">
                {CONSTANT_MESSAGE.FORGOT_PASSWORD_EMAIL_LABEL}
              </Typography>
              <Field
                data-testid="forgot-password-email-field"
                name="email"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Enter email address"
                fullWidth
                error={Boolean(errors.email) && Boolean(touched.email)}
                helperText={touched.email && errors.email}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            data-testid="forgot-password-submit"
            type="submit"
            variant="contained"
            size="large"
            className="w-full !text-lg !mb-5"
            disabled={isFormSubmitted}
            sx={{
              p: 1.533,
              backgroundColor:"primary.main",
              "&.Mui-disabled": {
                backgroundColor: "primary.main",
                color: "white",
                cursor: "not-allowed",
              },
              "&:hover": {
                cursor: "pointer",
              },
            }}
            startIcon={
              isFormSubmitted && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
              )
            }
            disableRipple
          >
            {CONSTANT_MESSAGE.FORGOT_PASSWORD_SUBMIT_BTN_LABEL}
          </Button>
          <Box className="mt-4 flex justify-center">
            <Box>
              <Box component="span" className="!text-base !text-gray-breadcrumb">
                {CONSTANT_MESSAGE.FORGOT_PASSWORD_DIDNT_RECEIVE_EMAIL_LABEL}
              </Box>{" "}
              <button disabled={isFormSubmitted} className="text-primary">
                {CONSTANT_MESSAGE.FORGOT_PASSWORD_RESEND_LABEL}
              </button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
