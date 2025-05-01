"use client";
import React from "react";
import {
  CreateOrganisationProps,
  ORGANISATION_FORM_FIELDS,
  OrganisationFormSubmitProps,
  OrganisationFormValuesProps,
} from "@/types/organisation";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import {
  OrganisationTypes,
  createOrganisationValidationSchema,
} from "@/constants/organisationTypes";
import Link from "next/link";

const CreateOrganisation = ({
  hanldeOrganisationSubmit,
  organisationDetails,
  isFormSubmitted,
}: CreateOrganisationProps) => {
  const createOrganisationInitialValues: OrganisationFormValuesProps = {
    [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]:
      organisationDetails?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME] ?? "",
    [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]:
      organisationDetails?.[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE] ?? "",
    [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]:
      organisationDetails?.addresses[0]?.[
        ORGANISATION_FORM_FIELDS.STREET_ADDRESS
      ] ?? "",
    [ORGANISATION_FORM_FIELDS.CITY]:
      organisationDetails?.addresses[0]?.[ORGANISATION_FORM_FIELDS.CITY] ?? "",
    [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]:
      organisationDetails?.addresses[0]?.[
        ORGANISATION_FORM_FIELDS.STATE_PROVINCE
      ] ?? "",
    [ORGANISATION_FORM_FIELDS.POSTAL_CODE]:
      organisationDetails?.addresses[0]?.[
        ORGANISATION_FORM_FIELDS.POSTAL_CODE
      ] ?? "",
    [ORGANISATION_FORM_FIELDS.COUNTRY]:
      organisationDetails?.addresses[0]?.[ORGANISATION_FORM_FIELDS.COUNTRY] ??
      "",
    [ORGANISATION_FORM_FIELDS.CONTACT_NAME]:
      organisationDetails?.contact_details[0]?.[
        ORGANISATION_FORM_FIELDS.CONTACT_NAME
      ] ?? "",
    [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]:
      organisationDetails?.contact_details[0]?.[
        ORGANISATION_FORM_FIELDS.CONTACT_EMAIL
      ] ?? "",
    [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]:
      organisationDetails?.contact_details[0]?.[
        ORGANISATION_FORM_FIELDS.CONTACT_PHONE
      ] ?? "",
  };

  const handleSubmit = (values: OrganisationFormValuesProps) => {
    const data: OrganisationFormSubmitProps = {
      [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]:
        values?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME],
      [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]:
        values?.[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE],
      addresses: [
        {
          [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]:
            values?.[ORGANISATION_FORM_FIELDS.STREET_ADDRESS],
          [ORGANISATION_FORM_FIELDS.CITY]:
            values?.[ORGANISATION_FORM_FIELDS.CITY],
          [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]:
            values?.[ORGANISATION_FORM_FIELDS.STATE_PROVINCE],
          [ORGANISATION_FORM_FIELDS.POSTAL_CODE]:
            values?.[ORGANISATION_FORM_FIELDS.POSTAL_CODE],
          [ORGANISATION_FORM_FIELDS.COUNTRY]:
            values?.[ORGANISATION_FORM_FIELDS.COUNTRY],
        },
      ],
      contact_details: [
        {
          [ORGANISATION_FORM_FIELDS.CONTACT_NAME]:
            values?.[ORGANISATION_FORM_FIELDS.CONTACT_NAME],
          [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]:
            values?.[ORGANISATION_FORM_FIELDS.CONTACT_EMAIL],
          [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]:
            values?.[ORGANISATION_FORM_FIELDS.CONTACT_PHONE],
        },
      ],
    };
    hanldeOrganisationSubmit(data);
  };

  return (
    <Box>
      <Formik
        initialValues={createOrganisationInitialValues}
        validationSchema={createOrganisationValidationSchema}
        enableReinitialize
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Box className="!mb-10">
              <Typography variant="h6" className="!mb-3 !text-black">
                1. Organization & Contact Information
              </Typography>
              <Grid2 spacing={2} container className="mb-5">
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_NAME}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.ORGANISATION_NAME}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_NAME}
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME],
                      ) &&
                      Boolean(
                        touched?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME],
                      )
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME] &&
                      errors?.[ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_TYPE}*
                  </Typography>
                  <FormControl
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE],
                      ) &&
                      Boolean(
                        touched?.[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE],
                      )
                    }
                  >
                    <Autocomplete
                      options={OrganisationTypes || []}
                      getOptionLabel={(option) => option.name}
                      value={
                        OrganisationTypes.find(
                          (type) =>
                            type.name ===
                            values[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE],
                        ) || null
                      }
                      onChange={(_, value) =>
                        setFieldValue(
                          ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE,
                          value ? value.name : "",
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select organization type"
                          error={
                            Boolean(
                              errors?.[
                                ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE
                              ],
                            ) &&
                            Boolean(
                              touched?.[
                                ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE
                              ],
                            )
                          }
                          helperText={
                            touched?.[
                              ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE
                            ] &&
                            errors?.[ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]
                          }
                          slotProps={{
                            formHelperText: {
                              className: "!ml-0",
                            },
                            htmlInput:{
                              ...params.inputProps,
                              'aria-label': 'Organization Type', // Ensure this matches the name in the test
                            }
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.CONTACT_NAME}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={
                      CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME
                    }
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.CONTACT_NAME],
                      ) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.CONTACT_NAME])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.CONTACT_NAME] &&
                      errors?.[ORGANISATION_FORM_FIELDS.CONTACT_NAME]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.CONTACT_EMAIL}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={
                      CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL
                    }
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.CONTACT_EMAIL],
                      ) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.CONTACT_EMAIL])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.CONTACT_EMAIL] &&
                      errors?.[ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.CONTACT_PHONE}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={
                      CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE
                    }
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.CONTACT_PHONE],
                      ) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.CONTACT_PHONE])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.CONTACT_PHONE] &&
                      errors?.[ORGANISATION_FORM_FIELDS.CONTACT_PHONE]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
              </Grid2>
            </Box>
            <Box>
              <Typography variant="h6" className="!mb-3 !text-black">
                2. Address Details
              </Typography>
              <Grid2 spacing={2} container className="mb-5">
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.STREET_ADDRESS}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS}
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.STREET_ADDRESS],
                      ) &&
                      Boolean(
                        touched?.[ORGANISATION_FORM_FIELDS.STREET_ADDRESS],
                      )
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.STREET_ADDRESS] &&
                      errors?.[ORGANISATION_FORM_FIELDS.STREET_ADDRESS]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_CITY}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.CITY}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_CITY}
                    fullWidth
                    error={
                      Boolean(errors?.[ORGANISATION_FORM_FIELDS.CITY]) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.CITY])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.CITY] &&
                      errors?.[ORGANISATION_FORM_FIELDS.CITY]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.STATE_PROVINCE}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE}
                    fullWidth
                    error={
                      Boolean(
                        errors?.[ORGANISATION_FORM_FIELDS.STATE_PROVINCE],
                      ) &&
                      Boolean(
                        touched?.[ORGANISATION_FORM_FIELDS.STATE_PROVINCE],
                      )
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.STATE_PROVINCE] &&
                      errors?.[ORGANISATION_FORM_FIELDS.STATE_PROVINCE]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_COUNTRY}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.COUNTRY}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_COUNTRY}
                    fullWidth
                    error={
                      Boolean(errors?.[ORGANISATION_FORM_FIELDS.COUNTRY]) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.COUNTRY])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.COUNTRY] &&
                      errors?.[ORGANISATION_FORM_FIELDS.COUNTRY]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE}*
                  </Typography>
                  <Field
                    name={ORGANISATION_FORM_FIELDS.POSTAL_CODE}
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    placeholder={CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE}
                    fullWidth
                    error={
                      Boolean(errors?.[ORGANISATION_FORM_FIELDS.POSTAL_CODE]) &&
                      Boolean(touched?.[ORGANISATION_FORM_FIELDS.POSTAL_CODE])
                    }
                    helperText={
                      touched?.[ORGANISATION_FORM_FIELDS.POSTAL_CODE] &&
                      errors?.[ORGANISATION_FORM_FIELDS.POSTAL_CODE]
                    }
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </Grid2>
              </Grid2>
            </Box>
            <div className="flex gap-3">
              <Link
                href={URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW}
                data-testid="organization-cancel"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  disableRipple
                >
                  {CONSTANT_MESSAGE.ORGANISATION_CANCEL_BUTTON}
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
                {CONSTANT_MESSAGE.ORGANISATION_SAVE_BUTTON}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateOrganisation;
