'use client';
import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Grid2, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup'
import { CreateSubscriptionPlanProps, SUBSCRIPTION_FORM_FIELDS, SubscriptionPlanSubmitProps } from "@/types/subscription";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Link from "next/link";

const planTypes = [
  { id: 1, name: 'Individual Educators' },
  { id: 2, name: 'Business Users' }
]

const CreateSubscriptionPlan = ({
  handleSubscriptionPlanSubmit,
  handleGetOrganisationList,
  organisationList,
  subscriptionDetails,
  isFormSubmitted
}: CreateSubscriptionPlanProps) => {
  const [showSelectOrganisationDropdown, setShowSelectOrganisationDropdown] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState('');

  const getSelectedPlanType = (plan: string) => {
    let planType = '';
    if (plan === 'Business') {
      planType = 'Business Users'
    } else {
      planType = 'Individual Educators'
    }
    return planType
  }

  const initialValues: SubscriptionPlanSubmitProps = {
    [SUBSCRIPTION_FORM_FIELDS.PLAN_NAME]: subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.PLAN_NAME] ?? '',
    [SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]: subscriptionDetails ? getSelectedPlanType(subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]) : '',
    [SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE]: subscriptionDetails ? subscriptionDetails[SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE] : null,
    [SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE]: subscriptionDetails ? subscriptionDetails[SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE] : null,
    [SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]: subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES] ?? null,
    [SUBSCRIPTION_FORM_FIELDS.ORGANISATION]: subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.ORGANISATION] ?? null
  };

  const validationSchema = Yup.object({
    [SUBSCRIPTION_FORM_FIELDS.PLAN_NAME]: Yup.string().trim().required('Plan Name is required'),
    [SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]: Yup.string().required('Plan type is required'),
    [SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE]: Yup.number()
      .typeError("Monthly price must be a number.")
      .min(0, "Monthly price must be 0 or a positive number.")
      .required("Monthly price is required."),
    [SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE]: Yup.number()
      .typeError("Annual price must be a number.")
      .min(0, "Annual price must be 0 or a positive number.")
      .required("Annual price is required."),
    [SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]: Yup.number()
      .typeError("No of licenses must be a number.")
      .min(0, "No of licenses must be 0 or a positive number.")
      .integer("No of licenses must be an integer.").
      required('No of licenses is required'),
    [SUBSCRIPTION_FORM_FIELDS.ORGANISATION]: Yup.number().when(SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE, {
      is: (planType: string) => planType?.includes("Business"),
      then: (schema) => schema.required("Organisation is required"),
      otherwise: (schema) => schema.notRequired()
    }),
  })

  const handleSubmit = (values: SubscriptionPlanSubmitProps) => {
    const payload = { 
      ...values, 
      [SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]: selectedPlanType 
    };
  
    // Conditionally remove ORGANISATION based on selectedPlanType
    if (selectedPlanType === "Individual") {
      delete payload[SUBSCRIPTION_FORM_FIELDS.ORGANISATION];
    }
    handleSubscriptionPlanSubmit(payload);
  };

  const handlePlanSelect = (plan: string) => {
    if (plan?.includes('Business')) {
      handleGetOrganisationList();
      setSelectedPlanType('Business');
      setShowSelectOrganisationDropdown(true);
    } else {
      setSelectedPlanType('Individual');
      setShowSelectOrganisationDropdown(false);
    }
  }
  
  useEffect(() => {
    if (subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]) {
      const planType = subscriptionDetails?.[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE];
      setSelectedPlanType(planType);
      handlePlanSelect(planType);
    }
  }, [subscriptionDetails]);

  return (
    <Box>
      <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid2 spacing={2} container className="mb-5">
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" id="plan-name">Plan Name*</Typography>
                <Field
                  name={SUBSCRIPTION_FORM_FIELDS.PLAN_NAME}
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Plan Name"
                  fullWidth
                  id="plan-name"
                  aria-label="plan-name"
                  error={
                    Boolean(errors?.[SUBSCRIPTION_FORM_FIELDS.PLAN_NAME]) && Boolean(touched?.[SUBSCRIPTION_FORM_FIELDS.PLAN_NAME])
                  }
                  helperText={touched?.[SUBSCRIPTION_FORM_FIELDS.PLAN_NAME] && errors?.[SUBSCRIPTION_FORM_FIELDS.PLAN_NAME]}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" id="monthly-price">Monthly Price*</Typography>
                <Field
                  name={SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE}
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Monthly Price"
                  fullWidth
                  id="monthly-price"
                  aria-labelledby="monthly-price"
                  error={
                    Boolean(errors?.[SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE]) && Boolean(touched?.[SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE])
                  }
                  helperText={touched?.[SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE] && errors?.[SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE]}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" id="annual-price">Annual Price*</Typography>
                <Field
                  name={SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE}
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Annual Price"
                  fullWidth
                  id="annual-price"
                  aria-labelledby="annual-price"
                  error={
                    Boolean(errors?.[SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE]) && Boolean(touched?.[SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE])
                  }
                  helperText={touched?.[SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE] && errors?.[SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE]}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">No of Licenses*</Typography>
                <Field
                  name={SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES}
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="No of Licenses"
                  fullWidth
                  error={
                    Boolean(errors?.[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]) && Boolean(touched?.[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES])
                  }
                  helperText={touched?.[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES] && errors?.[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Plan Type*</Typography>
                <Autocomplete
                  options={planTypes}
                  getOptionLabel={(option) => option.name}
                  value={planTypes.find((plan) => plan.name === values[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]) || null}
                  onChange={(_, newValue) => {
                    setFieldValue(SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE, newValue ? newValue.name : '');
                    handlePlanSelect(newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Plan Type"
                      error={Boolean(errors[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]) && Boolean(touched[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE])}
                      helperText={touched[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE] && errors[SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]}
                      slotProps={{
                        formHelperText: {
                          className: "!ml-0",
                        },
                        htmlInput:{
                          ...params.inputProps,
                          'aria-label': 'Plan Type', // Ensure this matches the name in the test
                        }
                      }}
                    />
                  )}
                />
              </Grid2>
              {showSelectOrganisationDropdown && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Organization*</Typography>
                  <Autocomplete
                    options={organisationList?.results || []}
                    getOptionLabel={(option) => option.organisation_name}
                    value={organisationList?.results.find((org) => org.organisation_id === values[SUBSCRIPTION_FORM_FIELDS.ORGANISATION]) || null}
                    onChange={(_, newValue) => setFieldValue(SUBSCRIPTION_FORM_FIELDS.ORGANISATION, newValue ? newValue.organisation_id : '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select an Organization"
                        error={Boolean(errors[SUBSCRIPTION_FORM_FIELDS.ORGANISATION]) && Boolean(touched[SUBSCRIPTION_FORM_FIELDS.ORGANISATION])}
                        helperText={touched[SUBSCRIPTION_FORM_FIELDS.ORGANISATION] && errors[SUBSCRIPTION_FORM_FIELDS.ORGANISATION]}
                        slotProps={{
                          formHelperText: {
                            className: "!ml-0",
                          },
                          htmlInput:{
                            ...params.inputProps,
                            'aria-label': 'Organization', // Ensure this matches the name in the test
                          }
                        }}
                      />
                    )}
                  />
                </Grid2>
              )}
            </Grid2>
            <div className="flex gap-3">
              <Link
                href={URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW}
                data-testid="subscription-cancel"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  disableRipple
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                data-testid="subscription-save"
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
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  )
};

export default CreateSubscriptionPlan;