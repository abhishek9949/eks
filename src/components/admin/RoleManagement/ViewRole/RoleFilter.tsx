"use client";
import React, { useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import { useFormik } from "formik";
import useDebounce from "@/hooks/useDebounce";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoleFilters } from "@/redux/slices/filterSlice";

const RoleFilter = () => {
  const filters = useAppSelector((state) => state?.filterSlice?.roleFilters);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: filters,
    onSubmit: () => {},
  });

  const debouncedRoleName = useDebounce(formik?.values?.roleName, 500);
  const debouncedRoleDescription = useDebounce(
    formik?.values?.roleDescription,
    500,
  );
  const debouncedCreatedAt = useDebounce(formik?.values?.createdAt, 500);

  useEffect(() => {
    dispatch(setRoleFilters(formik?.values));
  }, [debouncedRoleName, debouncedRoleDescription, debouncedCreatedAt]);

  const resetFilter = () => {
    formik?.resetForm();
  };

  const fields = [
    {
      id: "role_name_search",
      label: "Role name",
      name: "roleName",
      type: "text",
    },
    {
      id: "role_description_search",
      label: "Role Description",
      name: "roleDescription",
      type: "text",
    },
    {
      id: "created_on_search",
      label: "Created on",
      name: "createdAt",
      type: "text",
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
            />
          ))}
          <AdvanceSearchButttonComponent handleReset={resetFilter} />
        </Grid2>
      </form>
    </Box>
  );
};

export default RoleFilter;
