import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import Grid2 from "@mui/material/Grid2";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface DeleteProps {
  deleteAccountSubmit: (value: string) => void;
}

const DeleteAccount: React.FC<DeleteProps> = ({ deleteAccountSubmit }) => {
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [otherReason, setOtherReason] = React.useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedReason("");
    setOtherReason("");
  };

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleDeleteClick = () => setConfirmOpen(true);

  const handleSubmit = () => {
    const finalReason: string =
      selectedReason === "other" ? otherReason : selectedReason;
    deleteAccountSubmit(finalReason);
    handleConfirmClose();
    handleClose();
  };

  return (
    <Grid2 container spacing={1} size="grow">
      <Grid2
        size={12}
        sx={{ mb: 2.5, display: "flex", justifyContent: "right" }}
      >
        <Button color="error" onClick={handleClickOpen}>
          Delete Account
        </Button>
      </Grid2>
      <BootstrapDialog
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
        >
          <DeleteOutlinedIcon color="error" />
          Tell us why you want to delete your account
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FormControl fullWidth>
            <RadioGroup
              aria-labelledby="delete-reason-group"
              name="delete-reason-group"
              value={selectedReason}
              onChange={(event) => setSelectedReason(event.target.value)}
            >
              {[
                "I no longer need this account",
                "My organization no longer uses this service",
                "I am switching to a different platform",
                "Privacy or data security concerns",
                "Unsatisfactory experience with the platform",
                "School/institution no longer uses this platform",
                "other",
              ].map((reason) => (
                <FormControlLabel
                  key={reason}
                  value={reason}
                  control={<Radio />}
                  label={reason === "other" ? "Other" : reason}
                />
              ))}
            </RadioGroup>
            {selectedReason === "other" && (
              <TextField
                fullWidth
                placeholder="Describe your problem here"
                multiline
                minRows={3}
                sx={{ mt: 2 }}
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Grid2 size={12} sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={handleDeleteClick}
              disabled={
                !selectedReason ||
                (selectedReason === "other" && !otherReason.trim())
              }
              sx={{ display: "flex", justifyContent: "right", ml: 2 }}
            >
              Delete
            </Button>
          </Grid2>
        </DialogActions>
      </BootstrapDialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setConfirmOpen(false)}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default DeleteAccount;
