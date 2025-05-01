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
import { JoinInvitationFormProps } from "@/types/joinInvitationType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const JoinInvitationForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: JoinInvitationFormProps) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        email: string(),
        newPassword: string()
          .required(CONSTANT_MESSAGE.JOIN_INVITATION_NEW_PASSWORD_REQUIRED)
          .min(8, CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORD_MIN_LENGTH)
          .matches(
            /[A-Z]/,
            CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORD_UPPERCASE_REQUIRED,
          )
          .matches(
            /[a-z]/,
            CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORD_LOWERCASE_REQUIRED,
          )
          .matches(
            /\d/,
            CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORD_NUMBER_REQUIRED,
          )
          .matches(
            /[@$!%*?&#]/,
            CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORD_SPECIAL_CHAR_REQUIRED,
          ),
        confirmNewPassword: string()
          .required(CONSTANT_MESSAGE.JOIN_INVITATION_CONFIRM_PASSWORD_REQUIRED)
          .oneOf(
            [ref("newPassword")],
            CONSTANT_MESSAGE.JOIN_INVITATION_PASSWORDS_MUST_MATCH,
          ),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid2 container spacing={2} className="!mb-5">
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.JOIN_INVITATION_EMAIL_LABEL}
              </Typography>
              <Field
                data-testid="join-invitation-email-field"
                name="email"
                as={TextField}
                variant="outlined"
                color="primary"
                type="text"
                placeholder="Email"
                fullWidth
                disabled
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
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.JOIN_INVITATION_NEW_PASSWORD_LABEL}
              </Typography>
              <Field
                data-testid="join-invitation-newpassword-field"
                name="newPassword"
                as={TextField}
                variant="outlined"
                color="primary"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                fullWidth
                error={
                  Boolean(errors.newPassword) && Boolean(touched.newPassword)
                }
                helperText={touched.newPassword && errors.newPassword}
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
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography className="text-black" variant="subtitle1">
                {CONSTANT_MESSAGE.JOIN_INVITATION_CONFIRM_PASSWORD_LABEL}
              </Typography>
              <Field
                data-testid="join-invitation-confirm-password-field"
                name="confirmNewPassword"
                as={TextField}
                variant="outlined"
                color="primary"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter confirm password"
                fullWidth
                error={
                  Boolean(errors.confirmNewPassword) &&
                  Boolean(touched.confirmNewPassword)
                }
                helperText={
                  touched.confirmNewPassword && errors.confirmNewPassword
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
            data-testid="join-invitation-submit"
            type="submit"
            variant="contained"
            size="large"
            className="w-full !p-3 !bg-primary"
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
            {CONSTANT_MESSAGE.JOIN_INVITATION_SUBMIT_BTN_LABEL}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default JoinInvitationForm;
