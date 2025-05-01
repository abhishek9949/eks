import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik, FieldProps } from "formik";
import { number, object, string } from "yup";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import CloseIcon from "@mui/icons-material/Close";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import { useAppSelector } from "@/redux/hooks";
import {
  ReportForumUIPropsType,
  SubmitReportFromType,
} from "@/types/ReportForumUI";
import { useReportReasonsList } from "@/hooks/useFetchReportReasons";
import { ReportReasonSingle } from "@/types/reducer";

const initialValues = { reasonId: 0, otherReason: "" };

export default function ReportForumUI({
  open,
  handleClose,
  handleReport,
  id,
}: Readonly<ReportForumUIPropsType>) {
  const { reportReasonsList } = useReportReasonsList();
  const { isOpenReport, isReportedLoading, isConfirmReport } = useAppSelector(
    (state) => state.reportComment,
  );

  const handleSubmit = (values: SubmitReportFromType) => {
    if (values.reasonId === 7) {
      const reasonPayloadWithOther = {
        reason_id: values?.reasonId,
        other_reason: values?.otherReason,
      };
      handleReport(id, reasonPayloadWithOther);
    } else {
      const reasonPayload = {
        reason_id: values?.reasonId,
      };
      handleReport(id, reasonPayload);
    }
  };

  return (
    <>
      {isConfirmReport && (
        <Dialog open={open} onClose={handleClose}>
          <Box>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className="!absolute !right-2 !top-2 text-gray-8"
            >
              <CloseIcon />
            </IconButton>
            <DialogContent className="min-w-120">
              <Box className="!mx-5 !py-10 text-center">
                <ReportOutlinedIcon className="!text-5xl text-red-3" />
                <Box className="text-2xl">
                  Thank you for reporting the content. We shall take necessary
                  actions.
                </Box>
              </Box>
            </DialogContent>
          </Box>
        </Dialog>
      )}
      {isOpenReport && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Box className="flex items-center gap-2">
              <ReportOutlinedIcon className="text-red-3" />
              <Box>Report Content</Box>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className="!absolute !right-2 !top-2 text-gray-8"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent className="min-w-120">
            <Formik
              initialValues={initialValues}
              validationSchema={object({
                reasonId: number().required(
                  CONSTANT_MESSAGE.REPORT_REASON_REQUIRED,
                ),
                otherReason: string().when("reasonId", {
                  is: 7,
                  then: (schema) =>
                    schema
                      .required("Please provide reason for 'Other'.")
                      .max(50, "Maximum 50 characters allowed."),
                }),
              })}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <FormControl component="fieldset">
                    <Field name="reasonId">
                      {({ field }: FieldProps<number>) => (
                        <RadioGroup
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const selectedReasonId = Number(e.target.value);
                            setFieldValue("reasonId", selectedReasonId);
                            if (selectedReasonId !== 7) {
                              setFieldValue("otherReason", "");
                            }
                          }}
                        >
                          {reportReasonsList?.map(
                            (reason: ReportReasonSingle) => (
                              <FormControlLabel
                                key={reason.reason_id}
                                value={reason.reason_id}
                                control={<Radio />}
                                label={reason.reason}
                              />
                            ),
                          )}
                        </RadioGroup>
                      )}
                    </Field>
                    {touched.reasonId && errors.reasonId && (
                      <div style={{ color: "red" }}>{errors.reasonId}</div>
                    )}
                  </FormControl>
                  {values.reasonId === 7 && (
                    <Field
                      name="otherReason"
                      as={TextField}
                      placeholder="Describe your problem here"
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      error={
                        Boolean(errors.otherReason) &&
                        Boolean(touched.otherReason)
                      }
                      helperText={touched.otherReason && errors.otherReason}
                      margin="normal"
                      FormHelperTextProps={{
                        classes: {
                          root: "!ml-0",
                        },
                      }}
                    />
                  )}
                  <Box className="flex justify-end gap-2">
                    <Button
                      variant="outlined"
                      color="secondary"
                      type="button"
                      size="large"
                      onClick={handleClose}
                      disableRipple
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isReportedLoading}
                      startIcon={
                        isReportedLoading && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                        )
                      }
                      sx={{
                        backgroundColor:"primary.main",
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
                      Report
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
