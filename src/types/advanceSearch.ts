import { SelectChangeEvent } from "@mui/material";

export interface AdvanceSearchButtonComponentProps {
  handleReset: () => void,
}

export interface AdvanceSearchFormFieldsProps {
  type: string;
  id: string;
  label: string;
  name: string;
  value: string | number | string[] | number[];
  options?: { value: string | number; label: string }[];
  onChange: (event: React.ChangeEvent<any> | SelectChangeEvent<string | number>) => void;
  customClassName?: string;
  size?: "small" | "medium";
  multiple?: boolean
}
