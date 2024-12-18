import { useTokenExpiredDialog } from "@/store/useStore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React from "react";

export const LSTVTokenDialog = () => {
  const { tokenDialog, setTokenDialog } = useTokenExpiredDialog();

  if (tokenDialog === true) {
    enqueueSnackbar(`Session Token is Expired. Please Re-login Thank you!`, {
      preventDuplicate: true,
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  }

  const handleOk = () => {
    setTokenDialog(false);
    window.location.reload();
  };

  return (
    <React.Fragment>
      <Dialog open={tokenDialog} fullWidth maxWidth="sm">
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Session Token is Expired. Please Re-login. Thank you!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
