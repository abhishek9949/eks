"use client";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Box, Grid2 } from "@mui/material";
import { useFormik } from "formik";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCommunityFilters } from "@/redux/slices/filterSlice";

const CommunityFilter = () => {
  const filters = useAppSelector(
    (state) => state?.filterSlice?.communityFilters,
  );
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: filters,
    onSubmit: () => {},
  });
  const debouncedCommunityTitle = useDebounce(
    formik?.values?.communityTitle,
    500,
  );
  const debouncedCreatedAt = useDebounce(formik?.values?.createdAt, 500);
  const isActive = formik?.values?.isActive;

  useEffect(() => {
    dispatch(setCommunityFilters({ ...formik?.values, page: 1 }));
  }, [debouncedCommunityTitle, debouncedCreatedAt, isActive]);

  const resetFilter = () => {
    formik?.resetForm();
  };

  const fields = [
    {
      type: "text",
      id: "community_title_search",
      label: "Community Title",
      name: "communityTitle",
    },
    {
      type: "text",
      id: "created_at_search",
      label: "Created on",
      name: "createdAt",
    },
    {
      type: "select",
      id: "active_status_search",
      label: "Status",
      name: "isActive",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
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
              value={formik.values[field.name as keyof typeof formik.values]}
              onChange={formik.handleChange}
              options={field.options}
            />
          ))}
          <AdvanceSearchButttonComponent handleReset={resetFilter} />
        </Grid2>
      </form>
    </Box>
  );
};

export default CommunityFilter;
