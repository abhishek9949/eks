import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { ContentTypeNames } from "@/constants/contentTypets";
import { useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { CloseOutlined } from "@mui/icons-material";

export default function CustomizedInputBase() {
  const searchParams = useSearchParams();
  const urlSearchValue = searchParams.get("search") ?? "";
  const contentTypeSearchValue = searchParams.get("contentType");

  // If no contentType is in URL, select all types but don't update the URL
  const defaultSelectedOptions: string[] = contentTypeSearchValue
    ? JSON.parse(contentTypeSearchValue)
    : [...ContentTypeNames];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    ...ContentTypeNames,
  ]);
  const [searchValue, setSearchValue] = useState<string>(urlSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { updateSearchParams } = useUpdateSearchParams();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    const selectedValues = typeof value === "string" ? value.split(",") : value;

    let newOptions: string[];

    if (selectedValues.includes("All")) {
      newOptions = [...ContentTypeNames];
    } else {
      newOptions = selectedValues;
    }

    setSelectedOptions(newOptions);
    updateSearchParams({
      contentType:
        newOptions.length === ContentTypeNames.length ? null : newOptions,
    });
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      updateSearchParams({ search: debouncedSearchValue });
    } else {
      updateSearchParams({ search: null });
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (searchParams) {
      setSearchValue(urlSearchValue);
      setSelectedOptions(defaultSelectedOptions);
    }
  }, [searchParams]);

  const handleClearSearch = () => {
    setSearchValue("");
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: { sm: "100%",  md: "60%", lg: 574},
        height: 45,
        boxShadow: "none",
        border: "1px solid",
        margin: { xs: ".5rem auto", sm: ".5rem auto", lg: "auto 5rem " },
      }}
      className="!border-r !border-gray-1"
    >
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        displayEmpty
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === ContentTypeNames.length) {
            return "All";
          }
          return selected.length > 0 ? `${selected.length} selected` : "All";
        }}
        sx={{
          border: "none",
          "& fieldset": { border: "none" }, // Removes default border from MUI Select
          "&:hover": { border: "none" }, // Ensures no border on hover
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" }, // Prevents border on focus
        }}
      >
        <MenuItem key="all" value="All" sx={{ p: 0 }}>
          <Checkbox
            checked={selectedOptions.length === ContentTypeNames.length}
          />
          <ListItemText primary="All" />
        </MenuItem>
        {ContentTypeNames.map((name) => (
          <MenuItem
            key={name}
            value={name}
            sx={{
              p: "0 2px",
              backgroundColor: "white !important",
              "&.Mui-selected": { backgroundColor: "transparent !important" },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04) !important",
              },
            }}
          >
            <Checkbox checked={selectedOptions.includes(name)} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
      <Divider orientation="vertical" />

      <SearchIcon sx={{ m: "10px", color: "!gray-1" }} />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        inputProps={{ "aria-label": "search" }}
        value={searchValue}
        onChange={(e) => setSearchValue(e?.target?.value)}
      />
      {searchValue && (
        <CloseOutlined
          fontSize="medium"
          className="cursor-pointer pr-2 text-black"
          onClick={handleClearSearch}
        />
      )}
    </Paper>
  );
}
