import React from "react";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { Button, Grid2, TextField, Typography } from "@mui/material";
import { validateEmail } from "@/utils/validationData";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { ContactSalesFormProps } from "@/types/contactSalesType";
import PhoneInputField from "@/components/common/PhoneInputFieldWithCountryCode";
import { GLOBAL_CONSTANTS } from "@/constants/index";

const ContactSalesForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: ContactSalesFormProps) => {
  const validatePhoneNumber = (phoneNumber: string): string | undefined => {
    if (!phoneNumber) {
      return "Phone number is required";
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return "Phone number must be 10 digits";
    }
    return undefined;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        first_name: string().required(
          CONSTANT_MESSAGE.SIGNUP_FIRST_NAME_REQUIRED,
        ),
        last_name: string().required(
          CONSTANT_MESSAGE.SIGNUP_LAST_NAME_REQUIRED,
        ),
        email: string()
          .required(CONSTANT_MESSAGE.EMAIL_REQUIRED)
          .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
          .matches(validateEmail, CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED),
        country_code: string(),
        phone_number: string()
          .required("Phone number is required")
          .matches(/^\d{10}$/, "Phone number must be 10 digits"),
        company_name: string(),
        country: string(),
        contact_reason: string(),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
        <Form>
          <Grid2 container spacing={2} className="!mb-5">
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.SIGNUP_FIRST_NAME_LABEL}*
              </Typography>
              <Field
                name="first_name"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="First name"
                fullWidth
                data-testid="contact-sales-first-name-input"
                error={
                  Boolean(errors.first_name) && Boolean(touched.first_name)
                }
                helperText={touched.first_name && errors.first_name}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.SIGNUP_LAST_NAME_LABEL}*
              </Typography>
              <Field
                name="last_name"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Last name"
                fullWidth
                data-testid="contact-sales-name-input"
                error={Boolean(errors.last_name) && Boolean(touched.last_name)}
                helperText={touched.last_name && errors.last_name}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.SIGNUP_EMAIL_LABEL}*
              </Typography>
              <Field
                name="email"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Email address"
                fullWidth
                data-testid="contact-sales-email-input"
                error={Boolean(errors.email) && Boolean(touched.email)}
                helperText={touched.email && errors.email}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography variant="subtitle1">
                {CONSTANT_MESSAGE.CONTACT_SALES_PHONE_NUMBER_LABEL}*
              </Typography>
              <PhoneInputField
                value={{
                  phone: values.phone_number ?? "",
                  countryCode:
                    values.country_code ??
                    GLOBAL_CONSTANTS.DEFAULT_COUNTRY_CODE,
                }}
                defaultCountryCode={
                  values.country_code ?? GLOBAL_CONSTANTS.DEFAULT_COUNTRY_CODE
                }
                width="100%"
                onChange={(phoneNumber, countryCode) => {
                  setFieldValue("phone_number", phoneNumber);
                  setFieldValue("country_code", countryCode);
                  // Validate immediately when the value changes
                  const error = validatePhoneNumber(phoneNumber);
                  setFieldValue("phone_number_error", error);
                }}
                onBlur={() => setFieldTouched("phone_number", true)}
                error={
                  (Boolean(errors.phone_number) &&
                    Boolean(touched.phone_number)) ||
                  (values.phone_number?.length > 0 &&
                    values.phone_number?.length !== 10)
                }
                helperText={
                  (touched.phone_number && errors.phone_number) ||
                  (values.phone_number?.length > 0 &&
                  values.phone_number?.length !== 10
                    ? "Phone number must be 10 digits"
                    : "")
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.CONTACT_SALES_COMPANY_LABEL}
              </Typography>
              <Field
                name="company_name"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Company name"
                fullWidth
                data-testid="contact-sales-company-name-input"
                error={
                  Boolean(errors.company_name) && Boolean(touched.company_name)
                }
                helperText={touched.company_name && errors.company_name}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.CONTACT_SALES_COUNTRY_LABEL}
              </Typography>
              <Field
                name="country"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Country name"
                fullWidth
                data-testid="contact-sales-country-input"
                error={Boolean(errors.country) && Boolean(touched.country)}
                helperText={touched.country && errors.country}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.CONTACT_SALES_REASON_LABEL}
              </Typography>
              <Field
                name="contact_reason"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Tell us about your enterprise needs"
                fullWidth
                multiline
                rows={2}
                data-testid="contact-sales-contact-reason"
                error={
                  Boolean(errors.contact_reason) &&
                  Boolean(touched.contact_reason)
                }
                helperText={touched.contact_reason && errors.contact_reason}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="!w-full !bg-primary !p-3"
            data-testid="contact-sales-button"
            disabled={isFormSubmitted}
            sx={{
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
            {CONSTANT_MESSAGE.CONTACT_SALES_SUBMIT_BUTTON_LABEL}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactSalesForm;
