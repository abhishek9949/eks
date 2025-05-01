"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  MenuItem,
  Select,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Card,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ContentFormProps, Category } from "@/types/content";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { ContentTypeArray } from "@/constants/contentTypets";
import ImageIcon from "@mui/icons-material/Image";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Loader from "@/components/common/Loader";
import { TextEditor } from "@/components/common/TextEditor/TextEditor";

const VisuallyHiddenInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>,
) => (
  <input
    {...props}
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  />
);

const ContentForm = ({
  initialValues,
  onSubmit,
  categoryList,
}: ContentFormProps) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentDescription, setContentDescription] = useState("");

  useEffect(() => {
    if (initialValues?.description) {
      setContentDescription(initialValues.description);
    }
  }, [initialValues?.description]);

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.array().min(1, "At least one category is required"),
    tags: Yup.string()
      .required("Tags are required")
      .matches(
        /^[a-zA-Z]+(?:\s[a-zA-Z]+)*(?:,\s*[a-zA-Z]+(?:\s[a-zA-Z]+)*)*$/,
        "Tags must be a comma-separated list (e.g., 'tag1, tag2')",
      ),
    content_type: Yup.string().required("Content type is required"),
    file: Yup.mixed()
      .required("File is required")
      .when("content_type", {
        is: (type: string) =>
          ["Article", "Printable Resource", "Research"].includes(type),
        then: (schema) =>
          schema.test(
            "fileType",
            "Only PDF files are allowed",
            (value) =>
              value instanceof File && value.type === "application/pdf",
          ),
      })
      .when("content_type", {
        is: (type: string) => ["Video", "Workshop"].includes(type),
        then: (schema) =>
          schema.test(
            "fileType",
            "Only video files (MP4, MKV) are allowed",
            (value) =>
              value instanceof File &&
              ["video/mp4", "video/mkv"].includes(value.type),
          ),
      })
      .when("content_type", {
        is: "Podcast",
        then: (schema) =>
          schema.test(
            "fileType",
            "Only audio files (MP3, WAV) are allowed",
            (value) =>
              value instanceof File &&
              ["audio/mpeg", "audio/wav", "audio/mp3"].includes(value.type),
          ),
      }),
  });

  // Form Submission Handler
  const handleFormSubmit = (values: any) => {
    setIsLoading(true);
    // Filtering array2 to match ids in array1
    const updatedCategory = categoryList.filter((item) =>
      values.category.some((filterItem: {id: number, label: string}) => filterItem.id === item.category_id),
    );
    onSubmit({
      ...values,
      isFileUploaded,
      isThumbnailUploaded,
      category: updatedCategory,
    });
    setContentDescription("");
  };

  const getCategoryErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    }
    if (Array.isArray(error)) {
      return error.join(", ");
    }
    return "";
  };

  const isCategory = (cat: Category | { id: number; label: string }): cat is Category => {
    return "category_id" in cat && "name" in cat;
  };
  
  const mapCategory = (
    category: (Category | { id: number; label: string })[]
  ): { id: number; label: string }[] => {
    return category.map((cat) => ({
      id: isCategory(cat) ? cat.category_id : cat.id,
      label: isCategory(cat) ? cat.name : cat.label,
    }));
  };
  

  return (
    <Box>
      {isLoading && <Loader />}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <Form>
            {/* Title and Content Type */}
            <Box className="mb-2 flex gap-2">
              {/* Title */}
              <Box className="flex-[2]">
                <Typography variant="subtitle1" className="mb-1 block">
                  Title<span className="!text-red">*</span>
                </Typography>
                <Field
                  as={TextField}
                  name="title"
                  fullWidth
                  placeholder="Content Title"
                />
                {touched.title && errors.title && (
                  <FormHelperText className="!ml-0 !text-red">
                    {typeof errors.title === "string" && touched.title
                      ? errors.title
                      : ""}
                  </FormHelperText>
                )}
              </Box>
            </Box>

            {/* Category and file */}
            <Box className="mb-2 flex gap-2">
              {/* Content Type*/}
              <Box className="flex-1">
                <FormControl fullWidth>
                  <Typography variant="subtitle1" className="mb-1">
                    Content Type<span className="!text-red">*</span>
                  </Typography>
                  <Select
                    id="content_type"
                    name="content_type"
                    fullWidth
                    displayEmpty
                    value={values.content_type || ""}
                    onChange={(e) =>
                      setFieldValue("content_type", e.target.value)
                    }
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <span className="!text-gray-16 ">
                            Choose Content Type
                          </span>
                        );
                      }
                      return selected;
                    }}
                  >
                    {ContentTypeArray.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.content_type && errors.content_type && (
                    <FormHelperText className="!ml-0 !text-red">
                      {typeof errors.content_type === "string" &&
                      touched.content_type
                        ? errors.content_type
                        : ""}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              {/* Category */}
              <Box className="flex flex-1 flex-col">
                <FormControl>
                  <Typography variant="subtitle1" className="mb-1 block">
                    Category<span className="!text-red">*</span>
                  </Typography>
                  <MultiSelectDropdown
                    id="category"
                    onChange={(newValue: { id: number; label: string }[]) => {
                      setFieldValue("category", newValue);
                    }}
                    value={mapCategory(values.category as Category[])}
                    options={categoryList.map((cat) => ({
                      label: cat.name,
                      id: cat.category_id,
                    }))}
                    placeholder="Choose categories"
                  />

                  {touched.category && errors.category && (
                    <FormHelperText className="!ml-0 !text-red">
                      {getCategoryErrorMessage(errors.category)}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Box>
            {/*  Tags */}
            <Box className="mb-2 flex w-1/2  gap-2">
              <Box className="flex flex-1 flex-col">
                <Typography variant="subtitle1" className="mb-1">
                  Tags<span className="!text-red">*</span>
                </Typography>
                <Field
                  as={TextField}
                  name="tags"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Tags"
                />
                {errors.tags && touched.tags && (
                  <FormHelperText className="!ml-0 !text-red">
                    {typeof errors.tags === "string" ? errors.tags : ""}
                  </FormHelperText>
                )}
              </Box>
            </Box>

            {/*  file and thumbail  */}
            <Box className="mb-2 flex flex-[1] gap-2">
              {/* file */}
              <Box className="mb-2 flex-1" sx={{ minWidth: 50 }}>
                <Typography variant="subtitle1" className="mb-1">
                  Media Files<span className="!text-red">*</span>
                </Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  fullWidth
                  startIcon={<CloudUploadOutlinedIcon />}
                  className="h-14 !justify-start !text-left"
                  disableRipple
                >
                  <Box>
                    <Box
                      component="span"
                      className="inherit block text-base font-bold"
                    >
                      Upload File
                    </Box>
                    <Box component="span" className="text-xs text-gray-16">
                      pdf, video, audio only accepected
                    </Box>
                  </Box>
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        setIsFileUploaded(true);
                        setFieldValue("file", files[0]); // Update Formik field with the selected file
                      }
                    }}
                  />
                </Button>
                {touched.file && errors.file && (
                  <FormHelperText className="!ml-0 !text-red">
                    {/* @ts-ignore */}
                    {errors.file}
                  </FormHelperText>
                )}
                {/* Uploaded Files card */}
                <Box className="mt-2 flex-[1] ">
                  {values.file && (
                    <>
                      <Typography variant="subtitle1" className="mb-1">
                        Media Uploaded
                      </Typography>

                      <Card key={values.file.name}>
                        <ListItem
                          className="h-14"
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => {
                                setIsFileUploaded(true);
                                setFieldValue("file", null);
                              }}
                            >
                              <CancelIcon color="error" />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <UploadFileIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            className="!overflow-hidden !truncate"
                            primary={values.file.name}
                            secondary={values.file.type}
                          />
                        </ListItem>
                      </Card>
                    </>
                  )}
                </Box>
              </Box>

              {/* Thumbnail */}
              <Box className="mb-2 flex-1 items-center gap-4">
                {/* Radio Group for Thumbnail Selection */}
                <FormControl component="fieldset" className="w-full flex-[1]">
                  <Box className="flex">
                    <Typography variant="subtitle1" className="mb-1">
                      Thumbnail Image
                    </Typography>
                  </Box>
                  {/* Conditional Input for Thumbnail */}
                  <Box className="flex-1">
                    <Button
                      component="label"
                      className="h-14"
                      variant="outlined"
                      fullWidth
                      disableRipple
                    >
                      Upload Thumbnail
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => {
                          const files = event.target.files;
                          if (files) {
                            setFieldValue("thumbnail_file", files[0]); // Update Formik field with the selected file
                            setIsThumbnailUploaded(true);
                          }
                        }}
                      />
                    </Button>
                  </Box>
                </FormControl>
                {/* Thumbnail card */}
                <Box className="mt-2 flex-[1]">
                  {values.thumbnail_file && (
                    <>
                      <Typography variant="subtitle1" className="mb-1">
                        Thumbnail Uploaded
                      </Typography>

                      <Card key={values.thumbnail_file.name}>
                        <ListItem
                          className="h-14"
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => {
                                setFieldValue("thumbnail_file", null);
                                setIsThumbnailUploaded(true);
                              }}
                            >
                              <CancelIcon color="error" />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <ImageIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            className="!overflow-hidden !truncate"
                            primary={values.thumbnail_file.name}
                            secondary={values.thumbnail_file.type}
                          />
                        </ListItem>
                      </Card>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Description */}
            <Box className="mb-2">
              <Typography variant="body1" gutterBottom>
                Description<span className="!text-red">*</span>
              </Typography>
              <TextEditor
                handleDescription={(desc: string) => {
                  setContentDescription(desc);
                  setFieldValue("description", desc);
                }}
                addHeadings={false}
                value={contentDescription}
              />

              {touched.description && errors.description && (
                <FormHelperText className="!ml-0 !text-red">
                  {typeof errors.description === "string" && touched.description
                    ? errors.description
                    : ""}
                </FormHelperText>
              )}
            </Box>

            {/* Buttons */}
            <Box className="mb-2 flex gap-3">
              <Link
                href={URL_CONSTANTS.ADMIN_CONTENT_LIST}
                passHref
                legacyBehavior
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => resetForm()}
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
                sx={{ backgroundColor: "primary.main" }}
                disableRipple
              >
                {CONSTANT_MESSAGE.CREATE_USER_SAVE_BTN_LABEL}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContentForm;
