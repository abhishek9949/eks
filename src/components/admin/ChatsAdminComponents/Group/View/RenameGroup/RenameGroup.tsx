import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { useLazyGetGroupDetailsByIdQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { GroupDetailsByIdData, GroupDetailsByIdResponse } from "@/types/chats";
import { RenameGroupTypes } from "@/types/chatAdminTypes";

function RenameGroup({
  openRenameGroupDialog,
  handleCloseRenameGroup,
  groupId,
  handleUpdateGroup,
}: Readonly<RenameGroupTypes>) {
  const dispatch = useAppDispatch();
  const [getGroupDetailsById] = useLazyGetGroupDetailsByIdQuery();
  const [singleGroupData, setSingleGroupData] =
    useState<GroupDetailsByIdData>();
  const [isLoadingGroupInfo, setIsLoadingGroupInfo] = useState<boolean>(false);

  const initialValues = {
    groupName: singleGroupData?.group_name ?? "",
  };

  const handleGetSingleGroup = () => {
    setIsLoadingGroupInfo(true);
    getGroupDetailsById({
      endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${groupId}`,
    })
      .unwrap()
      .then((result) => {
        setIsLoadingGroupInfo(false);
        const { data } = result as GroupDetailsByIdResponse;
        setSingleGroupData(data);
      })
      .catch((error) => {
        setIsLoadingGroupInfo(false);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  const handleSubmit = (values: { groupName: string }) => {
    const payload = {
      group_name: values?.groupName,
    };
    if (groupId) {
      handleUpdateGroup(groupId, payload);
    }
    handleCloseRenameGroup();
  };

  useEffect(() => {
    if (groupId && openRenameGroupDialog) {
      handleGetSingleGroup();
    }
  }, [openRenameGroupDialog, groupId]);

  return (
    <Dialog
      open={openRenameGroupDialog}
      onClose={() => {
        handleCloseRenameGroup();
      }}
      aria-labelledby="create-group-alert-dialog-title"
      aria-describedby="create-group-alert-dialog-description"
    >
      <DialogTitle className="">Rename Group</DialogTitle>
      <DialogContent className="w-75 sm:w-100">
        <Formik
          initialValues={initialValues}
          validationSchema={object({
            groupName: string().required("Group name is required"),
          })}
          onSubmit={handleSubmit}
          enableReinitialize // This allows Formik to reinitialize when initialValues change
        >
          {({ errors, touched }) => (
            <Form>
              <>
                {isLoadingGroupInfo ? (
                  <div className="mt-5 flex justify-center">
                    <div className="h-13 w-13 animate-spin justify-center rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <Field
                    name="groupName"
                    as={TextField}
                    placeholder="Enter the Group label"
                    fullWidth
                    variant="outlined"
                    error={
                      Boolean(errors.groupName) && Boolean(touched.groupName)
                    }
                    helperText={touched.groupName && errors.groupName}
                    margin="normal"
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                )}
                <Box className="flex justify-end gap-2 pt-5">
                  <Button
                    variant="outlined"
                    color="secondary"
                    type="button"
                    size="medium"
                    onClick={handleCloseRenameGroup}
                    disableRipple
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    sx={{
                      backgroundColor: "primary.main",
                      "&.Mui-disabled": {
                        backgroundColor: "primary.main",
                        color: "white",
                        cursor: "not-allowed",
                      },
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    disableRipple
                  >
                    Rename
                  </Button>
                </Box>
              </>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default RenameGroup;
