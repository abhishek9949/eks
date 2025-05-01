"use client";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Box, Grid2 } from "@mui/material";
import { useFormik } from "formik";
import { OrganisationTypes } from "@/constants/organisationTypes";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOrganisationFilters } from "@/redux/slices/filterSlice";

const OrganisationFilter = () => {
  const filters = useAppSelector(
    (state) => state?.filterSlice?.organisationFilters,
  );
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: filters,
    onSubmit: () => {},
  });
  const debouncedOrganisationName = useDebounce(
    formik?.values?.organisationName,
    500,
  );
  const debouncedCreatedAt = useDebounce(formik?.values?.createdAt, 500);
  const organisationType = formik?.values?.organisationType;
  const isActive = formik?.values?.isActive;

  useEffect(() => {
    dispatch(setOrganisationFilters(formik.values));
  }, [
    debouncedOrganisationName,
    organisationType,
    debouncedCreatedAt,
    isActive,
  ]);

  const resetFilter = () => {
    formik?.resetForm();
  };

  const fields = [
    {
      type: "text",
      id: "organisation_name_search",
      label: "Organisation name",
      name: "organisationName",
    },
    {
      type: "select",
      id: "organisation_type_search",
      label: "Organisation Type",
      name: "organisationType",
      options: OrganisationTypes?.map((organisation) => ({
        value: organisation?.value,
        label: organisation?.name,
      })),
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
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
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

export default OrganisationFilter;
