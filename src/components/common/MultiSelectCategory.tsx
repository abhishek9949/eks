import React from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Box,
  useTheme,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface MultiSelectDropdownProps<
  T extends { id: string | number; label: string },
> {
  id: string;
  value: T[];
  options: T[];
  onChange: (newValue: T[]) => void;
  placeholder?: string;
  size?: "small" | "medium";
  displayCount?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  renderTags?: (selectedOptions: T[]) => React.ReactNode;
  label?: string
}

const MultiSelectDropdown = <T extends { id: string | number; label: string }>({
  id,
  value = [],
  onChange,
  options,
  placeholder,
  size = "medium",
  displayCount = 1,
  disabled = false,
  fullWidth = true,
  renderTags,
  label= ""
}: MultiSelectDropdownProps<T>) => {
  const theme = useTheme();

  return (
    <Autocomplete
      multiple
      id={id}
      value={value}
      onChange={(_, newValue: T[]) => onChange(newValue)}
      size={size}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) =>
        String(option.id) === String(value.id)
      }
      disabled={disabled}
      fullWidth={fullWidth}
      disableCloseOnSelect
      renderTags={(selectedOptions = []) => {
        if (!selectedOptions.length) return null;

        const displayedLabels = selectedOptions
          .slice(0, displayCount)
          .map((option) => option.label)
          .join(", ");
        const remainingCount = selectedOptions.length - displayCount;

        const defaultRender = (
          <Box component="span" sx={{ display: "flex", alignItems: "center", px: 2 }}>
            {displayedLabels}
            {remainingCount > 0 && (
              <>
                {displayCount > 0 && " , "}
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    borderRadius: "16px",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "12px",
                    fontWeight: "bold",
                    ml: 1,
                  }}
                >
                  +{remainingCount}
                </Box>
              </>
            )}
          </Box>
        );

        return renderTags ? (
          <>
            {defaultRender}
            {renderTags(selectedOptions)}
          </>
        ) : (
          defaultRender
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder ?? `Select (${value.length})`}
          variant="outlined"
          fullWidth
          label={label ?? ""}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
            sx={{ mr: 1 }}
            checked={selected}
          />
          {option.label}
        </li>
      )}
    />
  );
};

export default MultiSelectDropdown;
