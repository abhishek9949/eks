"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid2,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextEditor } from "@/components/common/TextEditor/TextEditor"; // Updated TextEditor import
import { CreateCommunityProps, ForumResponse } from "@/types/community";

import MultiSelectCategory from "@/components/common/MultiSelectCategory";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import styles from "@/components/CommunityTableDetails/CommunityTableDetails.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const FormCommuinty = ({
  initialValues,
  onSubmit,
  categoryList,
  isFormSubmitted,
}: CreateCommunityProps) => {
  const [description, setDescription] = useState("");
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  useEffect(() => {
    if (initialValues?.topic_description) {
      setDescription(initialValues.topic_description);
    }
  }, [initialValues?.topic_description]);

  const countWords = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const text = doc.body.textContent ?? "";
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const validationSchema = Yup.object({
    topic_title: Yup.string().required("Title is required"),
    category: Yup.array().min(1, "At least one category is required"),
    topic_description: Yup.string().test(
      "word-count",
      "Description must be at least 50 words",
      (value) => countWords(value ?? "") >= 50,
    ),
  });

  const handleFormSubmit = (
    values: ForumResponse,
    { resetForm }: FormikHelpers<ForumResponse>,
  ) => {
    const selectedCategoryIds = values.category.map(
      (selectedCategory) => selectedCategory.id,
    );
    onSubmit({
      ...values,
      topic_description: description, // Use updated description
      category: selectedCategoryIds, // Send IDs instead of titles
    });

    resetForm();
    setDescription(""); // Reset description state
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {/* Title and Category */}
            <Grid2 container spacing={2} className="!mb-5">
              <Grid2 size={{ xs: 12, sm: 6 }}>
                {/* Title */}
                <Box className="flex flex-1 flex-col">
                  <Typography variant="subtitle1">Title</Typography>
                  <Field
                    as={TextField}
                    name="topic_title"
                    fullWidth
                    error={false}
                    placeholder="Enter Title"
                  />
                  {touched.topic_title && errors.topic_title && (
                    <FormHelperText className="!ml-0 !text-red">
                      {errors.topic_title}
                    </FormHelperText>
                  )}
                </Box>
              </Grid2>

              {/* Category */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box className="flex flex-1 flex-col">
                  <FormControl>
                    <Typography variant="subtitle1">Category</Typography>
                    <MultiSelectCategory
                      size="medium"
                      id="category"
                      value={values.category}
                      onChange={(newValue: any[]) =>
                        setFieldValue("category", newValue)
                      }
                      options={categoryList.map((cat) => ({
                        label: cat.name,
                        id: cat.category_id,
                      }))}
                      placeholder="Choose categories..."
                    />
                    {touched.category && errors.category && (
                      <FormHelperText className="!ml-0 !text-red">
                        {Array.isArray(errors.category)
                          ? JSON.stringify(errors.category)
                          : errors.category}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid2>

              {/* Description */}
              <Grid2 size={{ xs: 12, sm: 12 }}>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Description
                  </Typography>
                  <TextEditor
                    handleDescription={(desc: string) => {
                      setDescription(desc);
                      setFieldValue("topic_description", desc);
                    }}
                    addHeadings={false}
                    value={description}
                  />
                  {touched.topic_description && (
                    <FormHelperText className="!ml-0 !text-red">
                      {errors?.topic_description}
                    </FormHelperText>
                  )}
                </Box>
              </Grid2>
            </Grid2>

            {/* Buttons */}
            <Box className="flex justify-between">
              <Box className="flex gap-3">
                <Link
                  href={URL_CONSTANTS.ADMIN_COMMUNITY_LIST}
                  passHref
                  legacyBehavior
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    disableRipple
                  >
                    {CONSTANT_MESSAGE.CREATE_USER_CANCEL_BTN_LABEL}
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
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
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  disableRipple
                  onClick={handleOpenPreview}
                  startIcon={<VisibilityOutlinedIcon className="text-balck" />}
                >
                  Preview
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={openPreview}
        onClose={handleClosePreview}
        slotProps={{
          paper: {
            className: "!absolute !top-0", // Forces the dialog to the top
          },
        }}
      >
        <DialogTitle>
          <Box className="flex items-center gap-2">
            <VisibilityOutlinedIcon className="text-black" />
            <Box>Preview Community</Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            className="!absolute !right-2 !top-2 text-gray-8"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div
            className={styles.descStyle}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FormCommuinty;
