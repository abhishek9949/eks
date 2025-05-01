"use client";
import React, { useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import { useFormik } from "formik";
import useDebounce from "@/hooks/useDebounce";
import AdvanceSearchButttonComponent from "@/components/common/AdvanceSearchButtonComponent";
import AdvanceSearchFormFields from "@/components/common/AdvanceSearchFormFields";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSubscriptionFilters,
} from "@/redux/slices/filterSlice";

const SubscriptionFilter = () => {
  const filters = useAppSelector(
    (state) => state?.filterSlice?.subscriptionFilters,
  );
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: filters,
    onSubmit: () => {},
  });

  const debouncedPlanNameText = useDebounce(formik?.values?.planName, 500);
  const debouncedCreatedAtText = useDebounce(formik?.values?.createdAt, 500);
  const planType = formik?.values?.planType;
  const planStatus = formik?.values?.planStatus;

  useEffect(() => {
    dispatch(setSubscriptionFilters(formik?.values));
  }, [debouncedPlanNameText, debouncedCreatedAtText, planType, planStatus]);

  const resetFilter = () => {
    formik?.resetForm();
  };

  const fields = [
    {
      type: "text",
      id: "plan_name_search",
      label: "Plan name",
      name: "planName",
    },
    {
      type: "select",
      id: "plan_type_search",
      label: "Plan Type",
      name: "planType",
      options: [
        { value: "Individual", label: "Individual" },
        { value: "Business", label: "Business" },
      ],
    },
    {
      type: "select",
      id: "plan_status_search",
      label: "Plan Status",
      name: "planStatus",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
    {
      type: "text",
      id: "created_on_search",
      label: "Created on",
      name: "createdAt",
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

export default SubscriptionFilter;
