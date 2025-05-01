import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  TextField,
  Button,
  Box,
  Grid2,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import BlockIcon from "@mui/icons-material/Block";
import { useLazyGetSingleBinQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { CreateBinFormPropType, GetBinsData } from "@/types/bins/binsType";
import { binColors, DEFAULT_BIN_COLOR } from "@/constants/binColors";

export default function CreateBin(props: Readonly<CreateBinFormPropType>) {
  const {
    openCreateBinDialog,
    handleCloseCreateBin,
    handleCreateBin,
    binId,
    handleUpdateBin,
  } = props;
  const dispatch = useAppDispatch();
  const [getSingleBin] = useLazyGetSingleBinQuery();
  const [createBinStep, setCreateBinStep] = useState(1);
  const [singleBinData, setSingleBinData] = useState<GetBinsData | null>(null);
  const [isLoadingBinInfo, setIsLoadingBinInfo] = useState<boolean>(false);

  const initialValues = singleBinData
    ? { binName: singleBinData?.bin_name, binColor: singleBinData?.bin_color }
    : { binName: "", binColor: "" };

  const handleGetSingleBin = () => {
    setIsLoadingBinInfo(true);
    getSingleBin({
      endpoint: `${API_CONSTANTS.GET_SINGLE_BIN}/${binId}`,
    })
      .unwrap()
      .then((singleBinRes) => {
        setIsLoadingBinInfo(false);
        setSingleBinData(singleBinRes?.data);
      })
      .catch((error) => {
        setIsLoadingBinInfo(false);
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleSubmit = (values: { binName: string; binColor: string }) => {
    const payload = {
      bin_name: values?.binName,
      bin_color: values?.binColor,
    };
    if (binId) {
      // Check if handleUpdateBin is defined before calling it
      if (handleUpdateBin) {
        handleUpdateBin(binId, payload);
      }
    } else if (handleCreateBin) {
      // Check if handleCreateBin is defined before calling it
      handleCreateBin(payload);
    }
    handleCloseCreateBin();
    setCreateBinStep(1);
  };

  useEffect(() => {
    if (binId && openCreateBinDialog) {
      handleGetSingleBin();
    }
  }, [openCreateBinDialog, binId]);

  return (
    <Dialog
      open={openCreateBinDialog}
      onClose={() => {
        handleCloseCreateBin();
        setCreateBinStep(1);
      }}
      aria-labelledby="create-bin-alert-dialog-title"
      aria-describedby="create-bin-alert-dialog-description"
    >
      <DialogTitle className="">
        {binId ? "Rename Bin" : "Create New Bin"}
      </DialogTitle>
      <DialogContent className="w-75 sm:w-100">
        <Formik
          initialValues={initialValues}
          validationSchema={object({
            binName: string().required("Bin name is required"),
            binColor: string().required("Bin color is required"),
          })}
          onSubmit={handleSubmit}
          enableReinitialize // This allows Formik to reinitialize when initialValues change
        >
          {({
            errors,
            touched,
            values,
            setFieldValue,
            validateField,
            setTouched,
          }) => (
            <Form>
              {createBinStep === 1 && (
                <>
                  {isLoadingBinInfo ? (
                    <div className="mt-5 flex justify-center">
                      <div className="h-13 w-13 animate-spin justify-center rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <Field
                      name="binName"
                      as={TextField}
                      placeholder="Enter the Bin label"
                      fullWidth
                      variant="outlined"
                      error={
                        Boolean(errors.binName) && Boolean(touched.binName)
                      }
                      helperText={touched.binName && errors.binName}
                      margin="normal"
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  )}
                  <Box className="flex justify-center gap-2 pt-5">
                    <Button
                      variant="outlined"
                      color="secondary"
                      type="button"
                      size="large"
                      onClick={handleCloseCreateBin}
                      className="!w-22"
                      disableRipple
                    >
                      Cancel
                    </Button>
                    <Button
                      type={binId ? "submit" : "button"}
                      variant="contained"
                      size="large"
                      onClick={async () => {
                        if (!binId) {
                          await validateField("binName"); // Trigger validation for binName
                          setTouched({ binName: true }); // Manually set touched state for binName
                          if (values.binName && !errors.binName) {
                            setCreateBinStep(2);
                          }
                        }
                      }}
                      className="!w-22"
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
                      {binId ? "Rename" : "Next"}
                    </Button>
                  </Box>
                </>
              )}
              {!binId && createBinStep === 2 && (
                <>
                  <Grid2 container spacing={2} className="mt-4">
                    <Grid2>
                      <BlockIcon
                        onClick={() =>
                          setFieldValue("binColor", DEFAULT_BIN_COLOR)
                        }
                        sx={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          border:
                            values.binColor === DEFAULT_BIN_COLOR
                              ? "2px solid #000"
                              : "none",
                        }}
                      />
                    </Grid2>
                    {binColors?.map((color) => (
                      <Grid2 key={color}>
                        <Box
                          sx={{
                            bgcolor: color,
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border:
                              values.binColor === color
                                ? "2px solid #000"
                                : "none",
                          }}
                          onClick={() => setFieldValue("binColor", color)}
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                  <Box className="flex justify-center gap-2 pt-5">
                    <Button
                      variant="outlined"
                      color="secondary"
                      type="button"
                      size="large"
                      onClick={() => setCreateBinStep(1)}
                      className="!w-22"
                      disableRipple
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!values.binColor} // Disable if no color is selected
                      className="!w-22"
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
                      Create
                    </Button>
                  </Box>
                </>
              )}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
