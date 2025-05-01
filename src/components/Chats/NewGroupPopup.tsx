"use client";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";
import { CloseOutlined, Groups2Outlined } from "@mui/icons-material";
import { NewGroupPopupProps } from "@/types/chats";
import { Form, Formik } from "formik";
import { useGlobalUsersList } from "@/hooks/useGlobalUsersList";
import * as Yup from "yup";

const NewGroupPopup = ({
  openNewGroupPopup,
  handleCloseNewGroupPopup,
  handleCreateGroup,
}: NewGroupPopupProps) => {
  const { globalUsersList } = useGlobalUsersList();

  const validationSchema = Yup.object({
    groupName: Yup.string().trim().required("Group Name is required"),
  });

  return (
    <Dialog
      open={openNewGroupPopup}
      onClose={handleCloseNewGroupPopup}
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
          <Groups2Outlined />
          <p className="text-base font-medium">Create a group</p>
        </Box>
        <CloseOutlined
          className="cursor-pointer"
          onClick={handleCloseNewGroupPopup}
        />
      </DialogTitle>
      <Formik
        initialValues={{
          groupName: "",
          peopleSelected: [],
          accessSettings: "Private",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleCreateGroup(values)}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form>
            <DialogContent>
              <Box className="relative flex flex-col gap-4">
                <Box className="grid grid-cols-12 gap-2">
                  <Box className="col-span-12">
                    <TextField
                      name="groupName"
                      fullWidth
                      placeholder="Group name"
                      variant="outlined"
                      value={values?.groupName}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
                <Box className="flex flex-col gap-2">
                  <p className="!text-base !font-normal !leading-tight !text-neutral-700">
                    Add people to group
                  </p>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="peopleSelected"
                    value={values?.peopleSelected || []}
                    onChange={(_, newValue) => {
                      setFieldValue("peopleSelected", newValue);
                    }}
                    options={globalUsersList}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
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
                        placeholder={
                          values?.peopleSelected?.length
                            ? ""
                            : "Search for people"
                        }
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions className="h-17 gap-2 pr-6 shadow-newgroupbutton">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseNewGroupPopup}
                disableRipple
                className="text-base font-medium text-gray-29"
                data-testid="new-group-cancel-button"
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
                disabled={!values?.groupName}
                data-testid="new-group-create-button"
              >
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default NewGroupPopup;
