import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ModalDialogProps } from "@/types/modalDialog";

const ModalDialog = ({
  openDialog,
  handleCloseDialog,
  handleConfirm,
  dialogTitle,
  dialogDescription,
  cancelBtnLabel,
  submitBtnLabel,
  actionButtonClass,
  buttonSize = "medium",
}: ModalDialogProps) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      {dialogTitle && (
        <DialogTitle id="delete-dialog-title" className="!text-2xl">{dialogTitle}</DialogTitle>
      )}
      <DialogContent>
        {dialogDescription && (
          <DialogContentText id="delete-dialog-description">
            <div dangerouslySetInnerHTML={{ __html: dialogDescription }} />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions className={actionButtonClass}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCloseDialog}
          disableRipple
          size={buttonSize}
        >
          {cancelBtnLabel ?? "No"}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          autoFocus
          disableRipple
          sx={{ backgroundColor: "primary.main" }}
          size={buttonSize}
        >
          {submitBtnLabel ?? "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialog;
