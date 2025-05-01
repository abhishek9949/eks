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
import { ResetPasswordFormProps } from "@/types/resetPasswordType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: ResetPasswordFormProps) => {
  const [showNewResetPassword, setShowNewResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        newResetPassword: string()
          .required(CONSTANT_MESSAGE.RESET_PASSWORD_NEW_PASSWORD_REQUIRED)
          .min(8, CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORD_MIN_LENGTH)
          .matches(
            /[A-Z]/,
            CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORD_UPPERCASE_REQUIRED,
          )
          .matches(
            /[a-z]/,
            CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORD_LOWERCASE_REQUIRED,
          )
          .matches(
            /\d/,
            CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORD_NUMBER_REQUIRED,
          )
          .matches(
            /[@$!%*?&#]/,
            CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORD_SPECIAL_CHAR_REQUIRED,
          ),
        confirmNewResetPassword: string()
          .required(CONSTANT_MESSAGE.RESET_PASSWORD_CONFIRM_PASSWORD_REQUIRED)
          .oneOf(
            [ref("newResetPassword")],
            CONSTANT_MESSAGE.RESET_PASSWORD_PASSWORDS_MUST_MATCH,
          ),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid2 container spacing={2} className="!mb-5">
            <Grid2 size={{ xs: 12, md: 12 }}>
              <label htmlFor="newResetPassword">
                <Typography className="text-black" variant="subtitle1">
                  {CONSTANT_MESSAGE.RESET_PASSWORD_NEW_PASSWORD_LABEL}
                </Typography>
              </label>
              <Field
                data-testid="reset-password-new-password-field"
                name="newResetPassword"
                as={TextField}
                variant="outlined"
                color="primary"
                type={showNewResetPassword ? "text" : "password"}
                placeholder="Enter new password"
                fullWidth
                error={
                  Boolean(errors.newResetPassword) &&
                  Boolean(touched.newResetPassword)
                }
                helperText={touched.newResetPassword && errors.newResetPassword}
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
                        onClick={() =>
                          setShowNewResetPassword(!showNewResetPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewResetPassword ? (
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
            <Grid2 size={{ xs: 12, md: 12 }}>
              <label htmlFor="confirmNewResetPassword">
                <Typography className="text-black" variant="subtitle1">
                  {CONSTANT_MESSAGE.RESET_PASSWORD_CONFIRM_PASSWORD_LABEL}
                </Typography>
              </label>
              <Field
                data-testid="reset-password-confirm-password-field"
                name="confirmNewResetPassword"
                as={TextField}
                variant="outlined"
                color="primary"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter confirm password"
                fullWidth
                error={
                  Boolean(errors.confirmNewResetPassword) &&
                  Boolean(touched.confirmNewResetPassword)
                }
                helperText={
                  touched.confirmNewResetPassword &&
                  errors.confirmNewResetPassword
                }
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
          <Button
            data-testid="reset-password-submit"
            type="submit"
            variant="contained"
            size="large"
            className="w-full !bg-primary !p-3"
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
            {CONSTANT_MESSAGE.RESET_PASSWORD_SUBMIT_BTN_LABEL}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
