"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const steps = ["Organization Info", "Subscription", "Address Details"];

const validationSchemas = [
  Yup.object({
    orgName: Yup.string().required("Required"),
    orgType: Yup.string().oneOf(["District", "School"]).required("Required"),
    contactName: Yup.string().required("Required"),
    contactEmail: Yup.string().email("Invalid email").required("Required"),
    contactPhone: Yup.string().required("Required"),
  }),
  Yup.object({
    planName: Yup.string().oneOf(["Bronze","Gold", "Silver"]).required("Required"),
    licenses: Yup.number().min(1).required("Required"),
    schools: Yup.number().when("orgType", {
      is: "District",
      then: (schema) => schema.required("Required").min(1),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  Yup.object({
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    postalCode: Yup.string().required("Required"),
  }),
];

const initialValues = {
  orgName: "",
  orgType: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  planName: "",
  discount: "",
  licenses: "",
  schools: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export default function CreateOrganizationWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = (values: typeof initialValues) => {
    if (isLastStep) {
      console.log("Submitted values:", values);
      // You can submit to API here
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Organization
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          handleNext(values);
        }}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Organization Name<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="orgName"
                      value={values.orgName}
                      onChange={handleChange}
                      error={touched.orgName && Boolean(errors.orgName)}
                      helperText={touched.orgName && errors.orgName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Organization Type<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="orgType"
                      value={values.orgType}
                      onChange={handleChange}
                      error={touched.orgType && Boolean(errors.orgType)}
                      helperText={touched.orgType && errors.orgType}
                    >
                      <MenuItem value="District">District</MenuItem>
                      <MenuItem value="School">School</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Contact Name<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="contactName"
                      value={values.contactName}
                      onChange={handleChange}
                      error={touched.contactName && Boolean(errors.contactName)}
                      helperText={touched.contactName && errors.contactName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Contact Email<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      name="contactEmail"
                      value={values.contactEmail}
                      onChange={handleChange}
                      error={
                        touched.contactEmail && Boolean(errors.contactEmail)
                      }
                      helperText={touched.contactEmail && errors.contactEmail}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Contact Phone<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="tel"
                      name="contactPhone"
                      value={values.contactPhone}
                      onChange={handleChange}
                      error={
                        touched.contactPhone && Boolean(errors.contactPhone)
                      }
                      helperText={touched.contactPhone && errors.contactPhone}
                    />
                  </Grid>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Plan Name<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="planName"
                      value={values.planName}
                      onChange={handleChange}
                      error={touched.planName && Boolean(errors.planName)}
                      helperText={touched.planName && errors.planName}
                    >
                      <MenuItem value="Bronze">Bronze</MenuItem>
                      <MenuItem value="Silver">Silver</MenuItem>
                      <MenuItem value="Gold">Gold</MenuItem>
                    </TextField>
                  </Grid>
                  {values.orgType === "District" && (
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Typography variant="subtitle1" className="mb-1 block">
                        Number of Schools<span className="!text-red">*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        name="schools"
                        value={values.schools}
                        onChange={handleChange}
                        error={touched.schools && Boolean(errors.schools)}
                        helperText={touched.schools && errors.schools}
                      />
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Number of Licenses<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="licenses"
                      value={values.licenses}
                      onChange={handleChange}
                      error={touched.licenses && Boolean(errors.licenses)}
                      helperText={touched.licenses && errors.licenses}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Discount
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="discount"
                      value={values.discount}
                      onChange={handleChange}
                      error={touched.discount && Boolean(errors.discount)}
                      helperText={touched.discount && errors.discount}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Annual price
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="aprice"
                      value={values.discount}
                      onChange={handleChange}
                      error={touched.discount && Boolean(errors.discount)}
                      helperText={touched.discount && errors.discount}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Total price
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="tprice"
                      value={values.discount}
                      onChange={handleChange}
                      error={touched.discount && Boolean(errors.discount)}
                      helperText={touched.discount && errors.discount}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Commitment
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="Commitment"
                      value={values.discount}
                      onChange={handleChange}
                      error={touched.discount && Boolean(errors.discount)}
                      helperText={touched.discount && errors.discount}
                    />
                  </Grid>
                  
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Street<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="street"
                      value={values.street}
                      onChange={handleChange}
                      error={touched.street && Boolean(errors.street)}
                      helperText={touched.street && errors.street}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      City<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      State<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Country<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Typography variant="subtitle1" className="mb-1 block">
                      Postal Code<span className="!text-red">*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="postalCode"
                      value={values.postalCode}
                      onChange={handleChange}
                      error={touched.postalCode && Boolean(errors.postalCode)}
                      helperText={touched.postalCode && errors.postalCode}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ mt: 4, display: "flex" }}>
              {activeStep > 0 && (
                <Button variant="outlined" sx={{ mr: 2 }} onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                {isLastStep ? "Save" : "Next"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
