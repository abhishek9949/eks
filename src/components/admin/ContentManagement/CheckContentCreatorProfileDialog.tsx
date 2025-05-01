import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const CheckContentCreatorProfileDialog = ({
  openDialog,
}: {
  openDialog: boolean;
}) => {
  const router = useRouter();
  return (
    <Dialog open={openDialog} disableEscapeKeyDown>
      <DialogTitle>{"Profile Setup Required"}</DialogTitle>
      <DialogContent>
        You need to complete your Content Creator Profile to access the Content
        List.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            router.push(URL_CONSTANTS.ADMIN_CONTENT_CREATOR_PROFILE);
          }}
          variant="contained"
          color="primary"
          disableRipple
        >
          Complete Content Creator Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckContentCreatorProfileDialog;
