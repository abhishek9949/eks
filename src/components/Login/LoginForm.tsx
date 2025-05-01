import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { LoginFormProps } from "@/types/loginType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { validateEmail } from "@/utils/validationData";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isLoginPath,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        email: string()
          .required(CONSTANT_MESSAGE.EMAIL_REQUIRED)
          .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
          .matches(validateEmail, CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED),
        password: string().required(CONSTANT_MESSAGE.Login_PASSWORD_REQUIRED),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid2 container spacing={1.37} className="mb-2">
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography
                className="!text-lg !text-gray-900"
                variant="subtitle1"
              >
                {CONSTANT_MESSAGE.LOGIN_EMAIL_LABEL}
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
                {CONSTANT_MESSAGE.LOGIN_PASSWORD_LABEL}
              </Typography>
              <Field
                name="password"
                as={TextField}
                variant="outlined"
                color="primary"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                fullWidth
                data-testid="password-input"
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
          </Grid2>
          <Typography className="!mb-5 flex justify-end !text-sm !font-normal !text-gray-900 underline">
            {isLoginPath && (
              <Link href={URL_CONSTANTS.FORGOT_PASSWORD}>
                {CONSTANT_MESSAGE.LOGIN_FORGOT_YOUR_PASSWORD_LABEL}
              </Link>
            )}
          </Typography>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="!mb-5 !text-lg"
              data-testid="login-button"
              disabled={isLoading}
              sx={{
                p: 1.533,
                backgroundColor: "primary.main",
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
                isLoading && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                )
              }
              disableRipple
            >
              {CONSTANT_MESSAGE.LOGIN_BTN_LABEL}
            </Button>
          </Grid2>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
