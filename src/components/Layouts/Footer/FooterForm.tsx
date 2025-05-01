import React from "react";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { Grid2, IconButton, InputAdornment, TextField } from "@mui/material";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { validateEmail } from "@/utils/validationData";
import EastIcon from "@mui/icons-material/East";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { FooterFormProps } from "@/types/footerType";

const FooterForm = ({ initialValues, onSubmit }: FooterFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        email: string()
          .required(CONSTANT_MESSAGE.EMAIL_REQUIRED)
          .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
          .matches(validateEmail, CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED),
      })}
      onSubmit={async (values, formikHelpers) => {
        await onSubmit(values, formikHelpers);
        formikHelpers.resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid2 container>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Field
                data-testid="footer-email-field"
                name="email"
                as={TextField}
                variant="outlined"
                color="primary"
                size="small"
                placeholder="Enter your email"
                fullWidth
                slotProps={{
                  input: {
                    className: "bg-white",
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="submit"
                          edge="end"
                          data-testid="footer-email-submit"
                        >
                          <EastIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                error={Boolean(errors.email) && Boolean(touched.email)}
                helperText={touched.email && errors.email}
                FormHelperTextProps={{
                  classes: {
                    root: "!m-0 !bg-blue-light-7",
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </Form>
      )}
    </Formik>
  );
};

export default FooterForm;
