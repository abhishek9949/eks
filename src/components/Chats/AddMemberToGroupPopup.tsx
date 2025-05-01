import React, { useState } from "react";
import { useGlobalUsersList } from "@/hooks/useGlobalUsersList";
import {
  AddMembersToGroupDataProps,
  AddMemberToGroupPopupProps,
} from "@/types/chats";
import { CloseOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { GlobalUsersList } from "@/types/user";

const AddMemberToGroupPopup = ({
  isAddMemberPopupOpen,
  handleCloseAddMemberPopup,
  handleAddMembersToGroup
}: AddMemberToGroupPopupProps) => {
  const [membersSelected, setMembersSelected] = useState<GlobalUsersList[]>([]);
  const { globalUsersList } = useGlobalUsersList();

  const handleOnClickClosePopup = () => {
    setMembersSelected([]);
    handleCloseAddMemberPopup();
  };

  const hanldeAddMembers = () => {
    const memberIds = membersSelected?.map(
      (member: GlobalUsersList) => member?.user_id,
    );
    const data: AddMembersToGroupDataProps = {
      add_members: memberIds,
    };
    handleAddMembersToGroup("POST", data);
    handleCloseAddMemberPopup();
  };

  return (
    <Dialog
      open={isAddMemberPopupOpen}
      onClose={handleOnClickClosePopup}
      aria-labelledby="new-group-dialog-title"
      aria-describedby="new-group-dialog-description"
      slotProps={{
        paper: {
          sx: { width: "490px" },
        },
      }}
    >
      <DialogTitle id="new-group-dialog-title" className="flex justify-between">
        <Box className="flex gap-2 text-gray-31">
          <p className="text-base font-medium">Add members to group</p>
        </Box>
        <CloseOutlined
          className="cursor-pointer"
          onClick={handleOnClickClosePopup}
        />
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          limitTags={2}
          id="peopleSelected"
          value={membersSelected || []}
          onChange={(_, newValue) => {
            setMembersSelected(newValue);
          }}
          options={globalUsersList}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });

              return (
                <Chip
                  key={key}
                  label={option.name}
                  sx={{
                    backgroundColor: "#eff6ff",
                    borderRadius: "6.25rem",
                  }}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={membersSelected?.length ? "" : "Search for people"}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions className="h-17 gap-2 pr-6">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOnClickClosePopup}
          disableRipple
          className="text-base font-medium text-gray-29"
          data-testid="add-member-cancel-button"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          disableRipple
          className="text-base font-medium text-white"
          type="submit"
          onClick={hanldeAddMembers}
          data-testid="add-member-add-button"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberToGroupPopup;
