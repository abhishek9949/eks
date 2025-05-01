import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { object, string, ref } from "yup";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SignupFormProps } from "@/types/signupType";
import Link from "next/link";
import { validateEmail } from "@/utils/validationData";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const SignupForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="text-3xl font-bold text-gray-900">
        {CONSTANT_MESSAGE.SIGNUP_TITLE}
      </div>
      <div className="mb-2 text-lg text-gray-breadcrumb xl:mb-5">
        {CONSTANT_MESSAGE.SIGNUP_DESCRIPTION}
      </div>
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
          password: string()
            .required(CONSTANT_MESSAGE.SIGNUP_PASSWORD_REQUIRED)
            .min(8, CONSTANT_MESSAGE.SIGNUP_PASSWORD_MIN_LENGTH)
            .matches(
              /[A-Z]/,
              CONSTANT_MESSAGE.SIGNUP_PASSWORD_UPPERCASE_REQUIRED,
            )
            .matches(
              /[a-z]/,
              CONSTANT_MESSAGE.SIGNUP_PASSWORD_LOWERCASE_REQUIRED,
            )
            .matches(/\d/, CONSTANT_MESSAGE.SIGNUP_PASSWORD_NUMBER_REQUIRED)
            .matches(
              /[@$!%*?&#]/,
              CONSTANT_MESSAGE.SIGNUP_PASSWORD_SPECIAL_CHAR_REQUIRED,
            ),
          confirmPassword: string()
            .required(CONSTANT_MESSAGE.SIGNUP_CONFIRM_PASSWORD_REQUIRED)
            .oneOf(
              [ref("password")],
              CONSTANT_MESSAGE.SIGNUP_PASSWORDS_MUST_MATCH,
            ),
        })}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Grid2 container spacing={2} className="!mb-5">
              <Grid2 size={{ xs: 6, md: 6 }}>
                <Typography
                  className="!text-lg !text-gray-900"
                  variant="subtitle1"
                >
                  {CONSTANT_MESSAGE.SIGNUP_FIRST_NAME_LABEL}
                </Typography>
                <Field
                  name="first_name"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Enter first name"
                  fullWidth
                  data-testid="signup-first-name-input"
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
              <Grid2 size={{ xs: 6, md: 6 }}>
                <Typography
                  className="!text-lg !text-gray-900"
                  variant="subtitle1"
                >
                  {CONSTANT_MESSAGE.SIGNUP_LAST_NAME_LABEL}
                </Typography>
                <Field
                  name="last_name"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Enter last name"
                  fullWidth
                  data-testid="signup-last-name-input"
                  error={
                    Boolean(errors.last_name) && Boolean(touched.last_name)
                  }
                  helperText={touched.last_name && errors.last_name}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 12 }}>
                <Typography
                  className="!text-lg !text-gray-900"
                  variant="subtitle1"
                >
                  {CONSTANT_MESSAGE.SIGNUP_EMAIL_LABEL}
                </Typography>
                <Field
                  name="email"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Enter email address"
                  fullWidth
                  data-testid="email-input"
                  error={Boolean(errors.email) && Boolean(touched.email)}
                  helperText={touched.email && errors.email}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 12 }}>
                <Typography
                  className="!text-lg !text-gray-900"
                  variant="subtitle1"
                >
                  {CONSTANT_MESSAGE.SIGNUP_PASSWORD_LABEL}
                </Typography>
                <Field
                  name="password"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  fullWidth
                  data-testid="signup-password-input"
                  error={Boolean(errors.password) && Boolean(touched.password)}
                  helperText={touched.password && errors.password}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 12 }}>
                <Typography
                  className="!text-lg !text-gray-900"
                  variant="subtitle1"
                >
                  {CONSTANT_MESSAGE.SIGNUP_CONFIRM_PASSWORD_LABEL}
                </Typography>
                <Field
                  data-testid="signup-confirm-password-field"
                  name="confirmPassword"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter confirm password"
                  fullWidth
                  error={
                    Boolean(errors.confirmPassword) &&
                    Boolean(touched.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                className="!mb-5 !bg-primary !text-lg"
                data-testid="register-button"
                disabled={isFormSubmitted}
                sx={{
                  p: 1.533,
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
                {CONSTANT_MESSAGE.SIGNUP_REGISTER_BTN_LABEL}
              </Button>
            </Grid2>
          </Form>
        )}
      </Formik>
      <div className="mt-4 flex justify-center">
        <div>
          <span className="text-base text-gray-breadcrumb">
            {CONSTANT_MESSAGE.SIGNUP_ALREADY_HAVE_ACCOUNT_LABEL}
          </span>{" "}
          <Link href={URL_CONSTANTS.LOGIN} className="text-primary">
            {CONSTANT_MESSAGE.SIGNUP_LOGIN_LABEL}
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
