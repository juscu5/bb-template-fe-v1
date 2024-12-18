import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthStore, useAccountStore } from "@/store/useStore";
import { useMutation } from "react-query";
import { changePass, loginUser } from "@/services/api/userApi";
import CloseIcon from "@mui/icons-material/Close";

export default function SetPassword2() {
  const [showPassword1, setShowPassword1] = React.useState<boolean>(false);
  const [showPassword2, setShowPassword2] = React.useState<boolean>(false);
  const [showPassword3, setShowPassword3] = React.useState<boolean>(false);

  const [pass1, setPass1] = React.useState<boolean>(false);
  const [pass2, setPass2] = React.useState<boolean>(false);
  const [pass3, setPass3] = React.useState<boolean>(false);

  const [errMess1, setErrMess1] = React.useState<string>("");
  const [errMess2, setErrMess2] = React.useState<string>("");
  const [errMess3, setErrMess3] = React.useState<string>("");

  //snackbar
  const [open, setOpen] = React.useState<boolean>(false);

  const { user } = useAuthStore();

  // initial value
  const [iniVal, setIniVal] = React.useState({
    oldPass: "",
    newPass: "",
    reNewPass: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation(changePass, {
    onSuccess: (data) => {
      setPass1(false);
      console.log(data);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
      setIniVal({
        oldPass: "",
        newPass: "",
        reNewPass: "",
      });
    },
    onError: (err) => {
      setErrMess1("Incorrect Password");
      setPass1(true);
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const usrcde = user?.usrcde;
    const usrpwd = data.get("oldpass") as string;
    const newpass = data.get("newpass") as string;
    const reNewpass = data.get("reNewpass") as string;

    if (newpass !== reNewpass) {
      setErrMess2("Password Mismatch");
      setErrMess3("Password Mismatch");
      setPass2(true);
      setPass3(true);
    } else if (usrpwd === newpass) {
      setErrMess1("Don't use old Password");
      setErrMess2("Don't use old Password");
      setErrMess3("Don't use old Password");
      setPass1(true);
      setPass2(true);
      setPass3(true);
    } else {
      setPass1(false);
      setPass2(false);
      setPass3(false);
      mutation.mutate({ usrcde, usrpwd, newpass });
    }
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const SnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        message="Password Successfully Changed!"
        action={action}
      />
    );
  };

  return (
    <LSTVPageRootStyle style={{ alignItems: "center", marginTop: "-150px" }}>
      <Paper
        variant="elevation"
        component="form"
        onSubmit={onSubmit}
        sx={{ paddingTop: "20px", paddingBottom: "20px" }}
        elevation={5}
      >
        <DialogTitle>
          <Typography variant="h5">Set Password</Typography>
        </DialogTitle>

        <DialogContent>
          <TextField
            error={pass1}
            helperText={pass1 ? errMess1 : ""}
            autoFocus
            required
            margin="dense"
            id="oldpass"
            name="oldpass"
            label="Old Password"
            type={showPassword1 ? "text" : "password"}
            value={iniVal.oldPass}
            fullWidth
            variant="standard"
            onChange={(e) =>
              setIniVal((prev) => ({
                ...prev!,
                oldPass: e.target.value,
              }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword1(false)}
                    onMouseDown={() => setShowPassword1(true)}
                    edge="end"
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={pass2}
            helperText={pass2 ? errMess2 : ""}
            autoFocus
            required
            margin="dense"
            id="newpass"
            name="newpass"
            label="New Password"
            type={showPassword2 ? "text" : "password"}
            value={iniVal.newPass}
            fullWidth
            variant="standard"
            onChange={(e) =>
              setIniVal((prev) => ({
                ...prev!,
                newPass: e.target.value,
              }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword2(false)}
                    onMouseDown={() => setShowPassword2(true)}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={pass3}
            helperText={pass3 ? errMess3 : ""}
            autoFocus
            required
            margin="dense"
            id="reNewpass"
            name="reNewpass"
            label="Re-type Password"
            type={showPassword3 ? "text" : "password"}
            fullWidth
            variant="standard"
            value={iniVal.reNewPass}
            onChange={(e) =>
              setIniVal((prev) => ({
                ...prev!,
                reNewPass: e.target.value,
              }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword3(false)}
                    onMouseDown={() => setShowPassword3(true)}
                    edge="end"
                  >
                    {showPassword3 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button type="submit" variant="contained" color="success">
            Save Password
          </Button>
        </DialogActions>
      </Paper>
      <SnackBar />
    </LSTVPageRootStyle>
  );
}
