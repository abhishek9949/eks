import React from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AdvanceSearchFormFieldsProps } from "@/types/advanceSearch";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";

const AdvanceSearchFormFields = ({
  type,
  id,
  label,
  name,
  value,
  options = [],
  onChange,
  customClassName = "",
  size = "small",
  multiple,
}: AdvanceSearchFormFieldsProps) => {
  const handleSelectChange = (
    event: SelectChangeEvent<string | number | string[] | number[]>,
  ) => {
    onChange({
      target: {
        name,
        value: event.target.value,
      },
    } as React.ChangeEvent<any>);
  };

  if (type === "text") {
    return (
      <TextField
        id={id}
        label={label}
        size={size}
        value={value}
        onChange={onChange}
        name={name}
        className={customClassName}
      />
    );
  }

  if (type === "select") {
    if (multiple) {
      return (
        <Box className="!w-75">
          <MultiSelectDropdown
            id={id}
            value={
              Array.isArray(value)
                ? value
                    .map((v) => options.find((o) => o.value === v))
                    .filter(
                      (opt): opt is { value: string | number; label: string } =>
                        !!opt,
                    ) // Ensures no undefined values
                    .map((opt) => ({ id: opt.value, label: opt.label })) // Converts to expected format
                : []
            }
            options={options.map((opt) => ({
              id: opt.value,
              label: opt.label,
            }))} // Ensures options match expected format
            onChange={(newValue) => {
              const selectedValues = newValue.map((opt) => opt.id); // Extracts only the IDs
              onChange({
                target: {
                  name,
                  value: selectedValues,
                },
              } as React.ChangeEvent<any>);
            }}
            placeholder={label}
            size={size}
            label={label}
          />
        </Box>
      );
    }

    return (
      <FormControl
        className={`!min-w-42.5 ${customClassName || ""}`}
        size={size}
      >
        <InputLabel id={`${id}_label`}>{label}</InputLabel>
        <Select
          labelId={`${id}_label`}
          id={id}
          value={value}
          onChange={handleSelectChange}
          name={name}
          fullWidth
          label={label}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return null;
};

export default AdvanceSearchFormFields;
