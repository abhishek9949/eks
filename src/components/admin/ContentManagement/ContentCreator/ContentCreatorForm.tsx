"use client";

import {
  Button,
  Grid2,
  TextField,
  Typography,
  Box,
  InputAdornment,
  SxProps,
  Theme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import LanguageIcon from "@mui/icons-material/Language";
import Image from "next/image";
import ProfileAvatar from "@/components/my-profile/ProfileAvatar";
import { ContentCreatorFormProps } from "@/types/contentCreatorProfile";
import { SmallTextEditor } from "./SmallTextEditor";
import ModalDialog from "@/components/common/ModalDialog";
import { useState } from "react";
import ContentCreatorFormReview from "./ContentCreatorFormReview";
import { countWords } from "@/utils/reusableFunctions";

const steps = ["Personal Information", "Social Media Links", "Review & Submit"];

const ContentCreatorForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
  contentCreatorData,
  handleDeleteContentCreatorProfile,
  isEditable,
}: ContentCreatorFormProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // NOSONAR
  // const handleOpenDeleteDialog = () => {
  //   setOpenDeleteDialog(true);
  // };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Define sx props with proper typing
  const disabledFormSx: SxProps<Theme> = {
    pointerEvents: "none",
    opacity: 0.7,
  };

  return (
    <>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={object({
            profile_picture: string().required("Profile picture is required."),
            creator_name: string().required("Name is required."),
            edu_experience: string().test(
              "word-count",
              "Educational Experience is required.",
              (value) => countWords(value ?? "") >= 1,
            ),
            current_job: string().test(
              "word-count",
              "This is required.",
              (value) => countWords(value ?? "") >= 1,
            ),
            social_media: object({
              instagram_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
              tiktok_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
              facebook_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
              x_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
              linkedIn_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
              other_link: string()
                .nullable()
                .notRequired()
                .url("Enter a valid URL"),
            }),
          })}
          onSubmit={(values, actions) => {
            // Mark all fields as touched before submission
            actions.setTouched({
              profile_picture: true,
              creator_name: true,
              edu_experience: true,
              current_job: true,
              social_media: {
                instagram_link: true,
                tiktok_link: true,
                facebook_link: true,
                x_link: true,
                linkedIn_link: true,
                other_link: true,
              },
            });
            // Then proceed with submission

            onSubmit(values, actions);
          }}
          validateOnBlur={true}
          validateOnChange={true}
          enableReinitialize
        >
          {({
            errors,
            touched,
            values,
            setFieldValue,
            setFieldTouched,
            validateForm,
          }) => (
            <Form>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                className=" mb-5 mt-15 sm:!mt-5"
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Grid2
                  container
                  spacing={2}
                  sx={
                    contentCreatorData?.username && isEditable === false
                      ? disabledFormSx
                      : undefined
                  }
                >
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">
                      Profile Picture*
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        border: `1px solid ${errors.profile_picture && touched.profile_picture ? "red" : "#C9CBCE"}`,
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      <Box>
                        <ProfileAvatar
                          name="profile_picture"
                          image={values.profile_picture as string}
                          onImageChange={(file) =>
                            setFieldValue("profile_picture", file)
                          }
                          customAvatarWidth={65}
                          customAvatarHeight={65}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          File size should not exceed 10MB
                        </Typography>
                        <Typography variant="body2">
                          JPG or PNG is allowed
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {errors.profile_picture && touched.profile_picture && (
                        <Typography variant="caption" color="error">
                          {errors.profile_picture}
                        </Typography>
                      )}
                    </Box>
                  </Grid2>
                  <Grid2
                    size={{ xs: 12, sm: 6 }}
                    sx={
                      contentCreatorData?.username ? disabledFormSx : undefined
                    }
                  >
                    <Typography variant="subtitle1">Name*</Typography>
                    <Field
                      name="creator_name"
                      as={TextField}
                      variant="outlined"
                      color="primary"
                      placeholder="Full name"
                      fullWidth
                      error={
                        Boolean(errors.creator_name) &&
                        Boolean(touched.creator_name)
                      }
                      helperText={touched.creator_name && errors.creator_name}
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, lg: 6 }}>
                    <Typography variant="subtitle1">
                      Educational Experience*
                    </Typography>
                    <SmallTextEditor
                      handleDescription={(desc: string) => {
                        setFieldValue("edu_experience", desc);
                        setFieldTouched("edu_experience", true, false);
                      }}
                      value={values.edu_experience}
                      validationError={
                        errors.edu_experience && touched.edu_experience
                          ? errors.edu_experience
                          : undefined
                      }
                      customPlaceholder="Educational experience"
                    />
                    <Box>
                      {errors.edu_experience && touched.edu_experience && (
                        <Typography variant="caption" color="error">
                          {errors.edu_experience}
                        </Typography>
                      )}
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, lg: 6 }}>
                    <Typography variant="subtitle1">
                      What are you doing right now? *
                    </Typography>
                    <SmallTextEditor
                      handleDescription={(desc: string) => {
                        setFieldValue("current_job", desc);
                        setFieldTouched("current_job", true, false);
                      }}
                      value={values.current_job}
                      validationError={
                        errors.current_job && touched.current_job
                          ? errors.current_job
                          : undefined
                      }
                      customPlaceholder="What are you doing right now?"
                    />
                    <Box>
                      {errors.current_job && touched.current_job && (
                        <Typography variant="caption" color="error">
                          {errors.current_job}
                        </Typography>
                      )}
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, lg: 6 }}>
                    <Typography variant="subtitle1">
                      What do you love about teaching?
                    </Typography>
                    <SmallTextEditor
                      handleDescription={(desc: string) => {
                        setFieldValue("teaching_reason", desc);
                      }}
                      value={values.teaching_reason}
                      customPlaceholder="Instructional coach, Third grade teacher, etc..."
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, lg: 6 }}>
                    <Typography variant="subtitle1">Anything else?</Typography>
                    <SmallTextEditor
                      handleDescription={(desc: string) => {
                        setFieldValue("anything_else", desc);
                      }}
                      value={values.anything_else}
                      customPlaceholder="Anything else?"
                    />
                  </Grid2>
                </Grid2>
              )}

              {activeStep === 1 && (
                <Grid2
                  container
                  spacing={2}
                  className="!mt-8"
                  sx={
                    contentCreatorData?.username && isEditable === false
                      ? disabledFormSx
                      : undefined
                  }
                >
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.instagram_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="Instagram Profile URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <InstagramIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.instagram_link) &&
                        Boolean(touched.social_media?.instagram_link)
                      }
                      helperText={
                        touched.social_media?.instagram_link &&
                        errors.social_media?.instagram_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.tiktok_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="TikTok Profile URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Image
                                src="/svg/tiktok.svg"
                                width={25}
                                height={25}
                                alt="comment"
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.tiktok_link) &&
                        Boolean(touched.social_media?.tiktok_link)
                      }
                      helperText={
                        touched.social_media?.tiktok_link &&
                        errors.social_media?.tiktok_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.facebook_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="Facebook Profile URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.facebook_link) &&
                        Boolean(touched.social_media?.facebook_link)
                      }
                      helperText={
                        touched.social_media?.facebook_link &&
                        errors.social_media?.facebook_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.x_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="X Profile URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <XIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.x_link) &&
                        Boolean(touched.social_media?.x_link)
                      }
                      helperText={
                        touched.social_media?.x_link &&
                        errors.social_media?.x_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.linkedIn_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="LinkedIn Profile URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkedInIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.linkedIn_link) &&
                        Boolean(touched.social_media?.linkedIn_link)
                      }
                      helperText={
                        touched.social_media?.linkedIn_link &&
                        errors.social_media?.linkedIn_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Field
                      name="social_media.other_link"
                      as={TextField}
                      variant="outlined"
                      placeholder="Other URL"
                      fullWidth
                      size="medium"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LanguageIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={
                        Boolean(errors.social_media?.other_link) &&
                        Boolean(touched.social_media?.other_link)
                      }
                      helperText={
                        touched.social_media?.other_link &&
                        errors.social_media?.other_link
                      }
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  </Grid2>
                </Grid2>
              )}

              {activeStep === 2 && <ContentCreatorFormReview values={values} />}

              <Box
                className="!mb-5 !mt-5 !flex !justify-between !gap-3"
                sx={
                  contentCreatorData?.username && isEditable === false
                    ? disabledFormSx
                    : undefined
                }
              >
                <div className="flex gap-3">
                  {activeStep === 0 ? (
                    <Link href={URL_CONSTANTS.ADMIN_CONTENT_LIST}>
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
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      onClick={handleBack}
                      disableRipple
                    >
                      Back
                    </Button>
                  )}

                  {activeStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      variant="contained"
                      size="large"
                      onClick={async (e) => {
                        e.preventDefault();
                        // Validate current step before proceeding
                        if (activeStep === 0) {
                          // Mark personal info fields as touched
                          setFieldTouched("profile_picture", true, false);
                          setFieldTouched("creator_name", true, false);
                          setFieldTouched("edu_experience", true, false);
                          setFieldTouched("current_job", true, false);

                          const errors = await validateForm();
                          const requiredFields = [
                            "profile_picture",
                            "creator_name",
                            "edu_experience",
                            "current_job",
                          ];
                          const hasErrors = requiredFields.some(
                            (field) => errors[field as keyof typeof errors],
                          );

                          if (!hasErrors) {
                            handleNext();
                          }
                        } else if (activeStep === 1) {
                          // Mark all social media fields as touched
                          Object.keys(values.social_media).forEach((field) => {
                            setFieldTouched(
                              `social_media.${field}`,
                              true,
                              false,
                            );
                          });

                          const errors = await validateForm();

                          // Check if any social media field has an error
                          const hasSocialMediaErrors = Object.keys(
                            values.social_media,
                          ).some(
                            (field) =>
                              errors.social_media?.[
                                field as keyof typeof errors.social_media
                              ],
                          );

                          if (!hasSocialMediaErrors) {
                            handleNext();
                          }
                        } else {
                          handleNext();
                        }
                      }}
                      sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                      disableRipple
                    >
                      Next
                    </Button>
                  ) : (
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
                  )}
                </div>
                {/* {contentCreatorData?.username && (
                  <div>
                    <Button
                      variant="outlined"
                      disableRipple
                      onClick={handleOpenDeleteDialog}
                      color="error"
                      size="large"
                    >
                      Delete Profile
                    </Button>
                  </div>
                )} */}
              </Box>
            </Form>
          )}
        </Formik>
        <ModalDialog
          dialogTitle="Delete content creator profile"
          dialogDescription="Are you sure you want to delete your profile, after deleting you won't able to view or upload content?"
          openDialog={openDeleteDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={() => {
            handleDeleteContentCreatorProfile();
          }}
        />
      </Box>
    </>
  );
};

export default ContentCreatorForm;
