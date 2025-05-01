"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import {
  Card,
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  TextField,
  Stack,
} from "@mui/material";
import ProfileAvatar from "./ProfileAvatar";
import { UserProfile as UserProfileProps } from "@/types/personalInfo";
import PhoneInputField from "@/components/common/PhoneInputFieldWithCountryCode";
import { GLOBAL_CONSTANTS } from "@/constants/index";

interface ProfileProps {
  updateProfileData: (data: UserProfileProps) => void;
  initialValues: UserProfileProps;
  isEditButton?: boolean;
}

const ProfileComponent: React.FC<ProfileProps> = ({
  initialValues = {},
  updateProfileData,
  isEditButton = true,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | File | null>(
    initialValues.profile_picture ?? null,
  );
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handleImageChange = (newImage: File) => {
    setProfileImage(newImage);
    updateProfileData({
      profile_picture: newImage,
    });
  };

  return (
    <Card sx={{ display: "flex", p: 2.5, mb: 2.5 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography variant="h6">Personal Info</Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex", justifyContent: "right" }}>
            {isEditButton && (
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
            )}
          </Grid>

          {!isEditing ? (
            <Grid
              size={12}
              sx={{ display: { xs: "block", sm: "flex", md: "flex" } }}
            >
              <Grid
                size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}
                sx={{
                  p: 0,
                  display: "flex",
                  justifyContent: { xs: "center", md: "left" },
                }}
              >
                <ProfileAvatar
                  name={initialValues.name ?? ""}
                  image={profileImage as string}
                  onImageChange={handleImageChange}
                  isEditButton={isEditButton}
                />
              </Grid>
              <Grid
                size={{ xs: 12, sm: 12, md: 4, lg: 8, xl: 8 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: { xs: "center", md: "left" },
                  mx: 1,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Stack direction="column">
                    <Typography
                      component="div"
                      variant="body1"
                      className="!font-normal"
                    >
                      {initialValues.name}
                    </Typography>
                  </Stack>
                  <Stack direction="column">
                    <Typography
                      component="div"
                      variant="body1"
                      className="!font-light"
                    >
                      {initialValues?.roles?.join(" | ") ?? ""}
                    </Typography>
                  </Stack>
                  <Stack direction="column">
                    <Typography
                      variant="body1"
                      className="!font-light !leading-[1.54] !text-gray-13"
                    >
                      {initialValues?.bio}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="column"
                    className="!font-light !leading-[1.54] !text-gray-13"
                  >
                    {initialValues?.country_code && initialValues?.phone
                      ? `${initialValues.country_code} ${initialValues.phone}`
                      : (initialValues?.phone ?? "")}
                  </Stack>
                  <Stack
                    direction="column"
                    className="!font-light !leading-[1.54] !text-gray-13"
                  >
                    {initialValues?.email}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                if (isPhoneValid) {
                  updateProfileData({
                    ...values,
                    profile_picture: profileImage ?? values.profile_picture,
                  });
                  setIsEditing(false);
                }
              }}
            >
              {({ values, handleChange, setFieldValue }) => (
                <Form style={{ display: "contents" }}>
                  <Grid size={12} sx={{ display: { xs: "block", md: "flex" } }}>
                    <Grid
                      size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}
                      sx={{
                        display: { xs: "block", md: "flex" },
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        className="!font-normal !leading-[1.54] !text-gray-13"
                      >
                        Avatar
                      </Typography>
                    </Grid>
                    <Grid
                      size={{ xs: 10, md: 3, lg: 2, xl: 2 }}
                      sx={{
                        display: { xs: "block", md: "flex" },
                        justifyContent: "left",
                      }}
                    >
                      <ProfileAvatar
                        name={values.name ?? ""}
                        image={profileImage as string}
                        onImageChange={(newImage: File) => {
                          setProfileImage(newImage);
                          setFieldValue("profile_picture", newImage); // Store File in Formik
                        }}
                        isEditButton={isEditButton}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 10, md: 4, lg: 3, xl: 3 }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: {
                          xs: "center",
                          md: "left",
                          lg: "baseline",
                        },
                        pt: { xs: 2 },
                        ml: { lg: 2 },
                      }}
                    >
                      <Button variant="outlined" sx={{ width: 115, mb: 1 }}>
                        Upload Photo
                      </Button>
                      <Typography color="gray.600">
                        File size should not exceed 10MB
                      </Typography>
                      <Typography color="gray.600">
                        JPG or PNG is allowed
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}
                    sx={{
                      display: { xs: "block", md: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      className="!font-normal !leading-[1.54] !text-gray-13"
                    >
                      Name
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 10, lg: 10 }}>
                    <TextField
                      sx={{ width: { xs: "100%", md: "60%" } }}
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}
                    sx={{
                      display: { xs: "block", md: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      className="!font-normal !leading-[1.54] !text-gray-13"
                    >
                      Add a short Bio
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 10, lg: 10 }}>
                    <TextField
                      sx={{ width: { xs: "100%", md: "60%" } }}
                      name="bio"
                      value={values.bio}
                      onChange={handleChange}
                      multiline
                      minRows={2}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}
                    sx={{
                      display: { xs: "block", md: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      className="!font-normal !leading-[1.54] !text-gray-13"
                    >
                      Phone
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 10, lg: 10 }}>
                    <PhoneInputField
                      value={{
                        phone: values.phone ?? "",
                        countryCode:
                          values.country_code ??
                          GLOBAL_CONSTANTS.DEFAULT_COUNTRY_CODE,
                      }}
                      defaultCountryCode={
                        values.country_code ??
                        GLOBAL_CONSTANTS.DEFAULT_COUNTRY_CODE
                      }
                      sx={{ width: { xs: "100%", md: "60%" } }}
                      onChange={(phoneNumber, countryCode, isValid) => {
                        setFieldValue("phone", phoneNumber);
                        setFieldValue("country_code", countryCode);
                        setIsPhoneValid(isValid);
                      }}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 12, lg: 12 }}
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-end" },
                    }}
                  >
                    <Grid
                      size={{ xs: 4, md: 1.5, lg: 1 }}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                        disableRipple
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid
                      size={{ xs: 4, md: 1.5, lg: 1 }}
                      sx={{ display: "flex", justifyContent: "right" }}
                    >
                      <Button variant="contained" type="submit">
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

export default ProfileComponent;
