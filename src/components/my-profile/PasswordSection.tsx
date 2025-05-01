"use client";
import { useState } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ChangedPassword } from "@/types/personalInfo";

interface PasswordProps {
  updatePassword: (value: ChangedPassword) => void;
}

const PasswordSection: React.FC<PasswordProps> = ({ updatePassword }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validationSchema = Yup.object({
    current_password: Yup.string().required("Current password is required"),
    new_password: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <Card sx={{ display: "flex", p: 2.5, mb: 2.5 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography variant="h6">Password</Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              variant="outlined"
              startIcon={
                <img
                  src="/svg/edit_square.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                />
              }
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit
            </Button>
          </Grid>
          {!isEditing ? (
            <Grid size={12}>
              <Stack direction="column">
                <Typography>***************************</Typography>
              </Stack>
            </Grid>
          ) : (
            <Formik
              initialValues={{
                current_password: "",
                new_password: "",
                confirm_password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                updatePassword(values as ChangedPassword);
              }}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form style={{ width: "100%" }}>
                  <Grid size={12}>
                    <Typography variant="subtitle1">
                      Current Password
                    </Typography>
                    <Field
                      as={TextField}
                      sx={{ width: "40%" }}
                      type={showPasswords.old ? "text" : "password"}
                      name="current_password"
                      value={values.current_password}
                      placeholder="Current Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.current_password &&
                        Boolean(errors.current_password)
                      }
                      helperText={
                        touched.current_password && errors.current_password
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility("old")}
                            >
                              {showPasswords.old ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="subtitle1">New Password</Typography>
                    <Field
                      as={TextField}
                      sx={{ width: "40%" }}
                      type={showPasswords.new ? "text" : "password"}
                      name="new_password"
                      placeholder="New Password"
                      value={values.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.new_password && Boolean(errors.new_password)
                      }
                      helperText={touched.new_password && errors.new_password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {showPasswords.new ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="subtitle1">
                      Confirm Password
                    </Typography>
                    <Field
                      as={TextField}
                      sx={{ width: "40%" }}
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.confirm_password &&
                        Boolean(errors.confirm_password)
                      }
                      helperText={
                        touched.confirm_password && errors.confirm_password
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                            >
                              {showPasswords.confirm ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid
                    size={12}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <Grid
                      size={1}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid
                      size={1}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={
                          !values.new_password ||
                          values.new_password !== values.confirm_password
                        }
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </Grid>
      </Box>
    </Card>
  );
};

export default PasswordSection;
