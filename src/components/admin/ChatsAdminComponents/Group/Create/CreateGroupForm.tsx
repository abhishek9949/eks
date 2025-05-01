"use client";
import React from "react";
import {
  Button,
  TextField,
  Autocomplete,
  Chip,
  Grid2,
  Typography,
  FormControl,
} from "@mui/material";
import { Form, Formik, Field } from "formik";
import { useGlobalUsersList } from "@/hooks/useGlobalUsersList";
import * as Yup from "yup";
import { CreateGroupFormProps } from "@/types/chatAdminTypes";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Link from "next/link";

const CreateGroupForm = ({
  handleCreateGroup,
  isFormSubmitted,
}: CreateGroupFormProps) => {
  const { globalUsersList } = useGlobalUsersList();

  const validationSchema = Yup.object({
    groupName: Yup.string().trim().required("Group Name is required"),
  });

  const accessSettingOptions = [
    { label: "Private", is_public: false },
    { label: "Public", is_public: true },
  ];

  return (
    <Formik
      initialValues={{
        groupName: "",
        peopleSelected: [],
        is_public: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleCreateGroup(values)}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <Grid2 container spacing={2} className="!mb-5">
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1">Group name</Typography>
              <Field
                name="groupName"
                as={TextField}
                variant="outlined"
                color="primary"
                placeholder="Group name"
                fullWidth
                error={Boolean(errors.groupName) && Boolean(touched.groupName)}
                helperText={touched.groupName && errors.groupName}
                FormHelperTextProps={{
                  classes: {
                    root: "!ml-0",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1">Add people to group</Typography>
              <Autocomplete
                multiple
                limitTags={2}
                id="peopleSelected"
                value={values?.peopleSelected || []}
                onChange={(_, newValue) => {
                  setFieldValue("peopleSelected", newValue);
                }}
                options={globalUsersList}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });

                    return (
                      <Chip
                        key={key}
                        label={option.name}
                        sx={{
                          backgroundColor: "#eff6ff",
                          borderRadius: "6.25rem",
                        }}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      values?.peopleSelected?.length ? "" : "Search for people"
                    }
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}>
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
                    setFieldValue("is_public", value ? value.is_public : false)
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
            </Grid2>
          </Grid2>
          <div className="flex gap-3">
            <Link href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_GROUP}>
              <Button
                variant="outlined"
                color="secondary"
                disableRipple
                className="text-base font-medium text-gray-900"
              >
                Cancel
              </Button>
            </Link>
            <Button
              color="primary"
              variant="contained"
              disabled={isFormSubmitted}
              autoFocus
              disableRipple
              className="text-base font-medium text-white"
              type="submit"
              startIcon={
                isFormSubmitted && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                )
              }
            >
              Create
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateGroupForm;
