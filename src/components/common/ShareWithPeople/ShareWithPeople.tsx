import React, { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Popper, { PopperProps } from "@mui/material/Popper";
import DialogTitle from "@mui/material/DialogTitle";
import { stringToColor } from "@/utils/reusableFunctions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ShareWithPeopleProps } from "@/types/shareWithPeople";

const icon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedIcon = <CheckCircleIcon fontSize="small" />;

const CustomPopper = (props: PopperProps) => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef}>
      <Popper
        {...props}
        container={containerRef.current}
        className="z-10 w-full min-w-[100%]"
      />
    </div>
  );
};

export default function ShareWithPeople({
  usersData,
  open,
  handleClose,
  handleChangeSelectUser,
  handleShare,
}: Readonly<ShareWithPeopleProps>) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-share-title"
      aria-describedby="alert-dialog-share-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="!sticky !top-0 !z-99 !mb-5 !border-b !border-gray-300 !bg-white !text-base">
        Select people/groups to share
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="!absolute !right-2 !top-2 !text-gray-600"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="!min-h-100 !overflow-y-auto">
        <div className="flex items-center gap-2">
          <Autocomplete
            multiple
            id="share-autocomplete"
            options={usersData}
            disableCloseOnSelect
            disablePortal // Render options within the DialogContent
            slots={{ popper: CustomPopper }}
            open // Keep the options always open
            getOptionLabel={(option) => `${option.name} (${option.email})`} // Searchable by both name and email
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeSelectUser}
            renderTags={(selected, getTagProps) => {
              const displayedTags = selected.slice(0, 2); // Show only the first 2 selected users
              const additionalCount = selected.length - 2; // Calculate the remaining count

              return (
                <>
                  {displayedTags.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });

                    return (
                      <span
                        key={key ?? option.id ?? index} // Use key from getTagProps first
                        {...tagProps}
                        className="mr-2 rounded bg-blue-200 px-2 py-1 text-primary"
                      >
                        {option.name}
                      </span>
                    );
                  })}
                  {additionalCount > 0 && (
                    <span className="rounded bg-gray-100 px-2 py-1 text-gray-6">
                      +{additionalCount}
                    </span>
                  )}
                </>
              );
            }}
            renderOption={(props, option, { selected }) => (
              <li
                {...props}
                className={`flex items-center justify-between px-6 py-2.5 hover:bg-gray-9 ${
                  props["aria-selected"] ? "bg-blue-light-7" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    style={{ backgroundColor: stringToColor(option.name) }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid text-white`}
                  >
                    {option?.name[0]}
                  </div>

                  <div className="ml-3">
                    <div>{option.name}</div>
                    <div className="text-sm text-gray-8">{option.email}</div>
                  </div>
                </div>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  className="ml-1"
                  checked={selected}
                />
              </li>
            )}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} placeholder="Search users..." />
            )}
            sx={{
              "& .MuiAutocomplete-endAdornment": {
                display: "none", // Hide the end adornment
              },
            }}
            slotProps={{
              listbox: {
                className:
                  "!p-5 !m-0 !border-none !overflow-visible !max-h-full",
              },
            }}
          />

          <div>
            <Button
              className="!px-8 !py-3.5 !text-base"
              variant="contained"
              color="primary"
              onClick={handleShare}
              disableRipple
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
