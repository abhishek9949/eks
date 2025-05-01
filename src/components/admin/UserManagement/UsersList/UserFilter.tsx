"use client";
import React, { useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import { useFormik } from "formik";
import useDebounce from "@/hooks/useDebounce";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUsersFilters } from "@/redux/slices/filterSlice";

const UserFilter = () => {
  const filters = useAppSelector((state) => state?.filterSlice?.usersFilters);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: filters,
    onSubmit: () => {},
  });

  const debouncedFirstName = useDebounce(formik?.values?.searchFirstName, 500);
  const debouncedLastName = useDebounce(formik?.values?.searchLastName, 500);
  const debouncedEmail = useDebounce(formik?.values?.searchByEmail, 500);

  useEffect(() => {
    dispatch(setUsersFilters({ ...formik?.values, page: 1 }));
  }, [debouncedFirstName, debouncedLastName, debouncedEmail]);

  const resetFilter = () => {
    formik?.resetForm();
  };

  const fields = [
    {
      id: "user_first_name_search",
      label: "First name",
      name: "searchFirstName",
      type: "text",
    },
    {
      id: "user_last_search",
      label: "Last Name",
      name: "searchLastName",
      type: "text",
    },
    {
      id: "user_email_search",
      label: "Email",
      name: "searchByEmail",
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

export default UserFilter;
