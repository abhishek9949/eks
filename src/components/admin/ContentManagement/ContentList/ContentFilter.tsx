'use client';
import React, { useEffect } from "react";
import { ContentFilterProps } from "@/types/content";
import { Box, Grid2 } from "@mui/material";
import { ContentTypeArray } from "@/constants/contentTypets";
import { useFormik } from "formik";
import useDebounce from "@/hooks/useDebounce";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setContentFilters } from "@/redux/slices/filterSlice";

const ContentFilter = ({
  categoryList,
}: ContentFilterProps) => {
  const filters = useAppSelector(
      (state) => state?.filterSlice?.contentFilters,
    );
  const dispatch = useAppDispatch();

  const formik = useFormik({
     initialValues: filters,
     onSubmit: () => {},
   });

  const debouncedContentTags = useDebounce(formik?.values?.contentTags, 500);
  const debouncedCreatedAt = useDebounce(formik?.values?.createdAt, 500);
  const debouncedCreatedBy = useDebounce(formik?.values?.createdBy, 500);
  const contentType = formik?.values?.contentType;
  const contentStatus = formik?.values?.contentStatus;
  const contentCategory = formik?.values?.contentCategory;

  useEffect(() => {
    dispatch(setContentFilters(formik.values));
  }, [debouncedContentTags, debouncedCreatedAt, debouncedCreatedBy, contentType, contentStatus, contentCategory]);

  const resetFilter = () => {
    formik?.resetForm();
  };


  const fields = [
    {type: "text", id: "created_on_search", label: "Created on", name: "createdAt"},
    {type: "text", id: "created_by_search", label: "Created by", name: "createdBy"},
    { type: "text", id: "content_tags_search", label: "Tags", name: "contentTags"},
    {
      type: "select",
      id: "content_type_search",
      label: "Content Type",
      name: "contentType",
      options: ContentTypeArray?.slice(1)?.map((contentType) => ({
        value: contentType?.name?.toLowerCase(),
        label: contentType?.name,
      }))
    },
    {
      type: "select",
      id: "content_status_search",
      label: "Status",
      name: "contentStatus",
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "inactive", label: "Inactive" }
      ],
    },
    {
      type: "select",
      id: "content_category_search",
      label: "Category",
      name: "contentCategory",
      options: categoryList?.map((category) => ({
        value: category?.category_id,
        label: category?.name,
      })),
      multiple: true
    },   
  ];

  return (
    <Box>
      <form>
        <Grid2 container spacing={4} className="mb-4">
          {fields.map((field) => (
            <AdvanceSearchFormFields
              key={field.id}
              type={field.type}
              id={field.id}
              label={field.label}
              name={field.name}
              value={formik.values[field.name as keyof typeof formik.values]  || (field.type === 'select' && Array.isArray(field.options) ? [] : '')}
              onChange={formik.handleChange}
              options={field.options}
              multiple={field?.multiple || false}
            />
          ))}
           <AdvanceSearchButttonComponent
          handleReset={resetFilter}
        />
        </Grid2>
       
      </form>
    </Box>
  );
};

export default ContentFilter;