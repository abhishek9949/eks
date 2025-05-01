"use client";

import {
  Button,
  Grid2,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import Link from "next/link";
import { CreateChannelFormPropType } from "@/types/chatAdminTypes";

const CreateChannelForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: CreateChannelFormPropType) => {
  // NOSONAR
  // Dont remove this code block
  // const accessSettingOptions = [
  //   { label: "Private", is_public: false },
  //   { label: "Public", is_public: true },
  // ];
  return (
    <Box className="mt-10">
      <Formik
        initialValues={initialValues}
        validationSchema={object({
          channel_name: string().required("Channel name is required"),
          channel_description: string().required(
            "Channel description is required",
          ),
        })}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Grid2 container spacing={2} className="!mb-5">
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">Channel name*</Typography>
                <Field
                  name="channel_name"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Channel name"
                  fullWidth
                  error={
                    Boolean(errors.channel_name) &&
                    Boolean(touched.channel_name)
                  }
                  helperText={touched.channel_name && errors.channel_name}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">
                  Channel description*
                </Typography>
                <Field
                  name="channel_description"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Channel description"
                  fullWidth
                  multiline
                  rows={3}
                  error={
                    Boolean(errors.channel_description) &&
                    Boolean(touched.channel_description)
                  }
                  helperText={
                    touched.channel_description && errors.channel_description
                  }
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>
              {/* {Dont remove this code block} */}
              {/* <Grid2 size={{ xs: 12, sm: 3 }}>
                <Typography variant="subtitle1">Access settings</Typography>
                <FormControl
                  fullWidth
                  error={Boolean(errors.is_public) && Boolean(touched.is_public)}
                >
                  <Autocomplete
                    options={accessSettingOptions || []}
                    getOptionLabel={(option) => option.label}
                    value={
                      accessSettingOptions?.find(
                        (role) => role.is_public === values.is_public,
                      ) || null
                    } // Set initial value
                    onChange={(_, value) =>
                      setFieldValue(
                        "is_public",
                        value ? value.is_public : false,
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Access settings"
                        slotProps={{
                          formHelperText: {
                            className: "!ml-0",
                          },
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid2> */}
            </Grid2>

            <div className="flex gap-3">
              <Link href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_CHANNEL}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  type="button"
                  disableRipple
                >
                  {CONSTANT_MESSAGE.CREATE_USER_CANCEL_BTN_LABEL}
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isFormSubmitted}
                sx={{
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
                  isFormSubmitted && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                  )
                }
                disableRipple
              >
                {CONSTANT_MESSAGE.CREATE_USER_SAVE_BTN_LABEL}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateChannelForm;
