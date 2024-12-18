import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormElement } from "@/models";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useHandles } from "@/store/useCallbackStore";
import {
  MaterialUISwitch,
  Android12Switch,
  IOSSwitch,
  AntSwitch,
} from "../lstv-style/LSTVSwitchStyle";

interface LSTVDialogFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formElements: FormElement[];
  dialogContent: string;
  dialogTitle: string;
  addCallback?: (event: React.FormEvent<HTMLFormElement>) => void;
  editCallback?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const LSTVDialogForm = ({
  open,
  setOpen,
  formElements,
  dialogContent,
  dialogTitle,
  addCallback,
  editCallback,
}: LSTVDialogFormProps) => {
  const { selectedData, setSelectedData, dialogType } = useHandles();
  const [showPassword, setShowPassword] = React.useState<
    Record<string, boolean>
  >(
    formElements.reduce((acc, curr) => {
      if (curr.type === "password") {
        acc[curr.id] = false;
      }
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleClickShowPassword = (id: string) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dialogFormMapping = () => {
    return formElements.map((data: FormElement) => {
      if (data.type === "text") {
        return (
          <TextField
            autoFocus
            required={data.required}
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            fullWidth
            variant="standard"
            defaultValue={selectedData?.[data.id]}
            onChange={(e) =>
              setSelectedData!((prev: any) => ({
                ...prev!,
                [data.id]: e.target.value,
              }))
            }
            InputProps={{
              readOnly: dialogType === "View",
            }}
            sx={{ display: data.hidden ? "none" : "block" }}
          />
        );
      } else if (data.type === "number") {
        return (
          <TextField
            autoFocus
            required={data.required}
            fullWidth
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            defaultValue={selectedData?.[data.id] ? selectedData?.[data.id] : 0}
            onChange={(e) =>
              setSelectedData!((prev: any) => ({
                ...prev!,
                [data.id]: parseFloat(e.target.value),
              }))
            }
            InputProps={{
              readOnly: dialogType === "View",
            }}
            variant="standard"
            autoComplete="off"
            sx={{ display: data.hidden ? "none" : "block" }}
          />
        );
      } else if (data.type === "monetary") {
        return (
          <TextField
            autoFocus
            fullWidth
            required={data.required}
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            margin="dense"
            variant="standard"
            defaultValue={selectedData?.[data.id]}
            onChange={(e) =>
              setSelectedData!((prev: any) => ({
                ...prev!,
                [data.id]: parseFloat(e.target.value),
              }))
            }
            InputProps={{
              // startAdornment: (
              //   <InputAdornment position="start">$</InputAdornment>
              // ),
              inputProps: {
                pattern: "^[0-9]*.?[0-9]{0,2}$",
              },
              readOnly: dialogType === "View",
            }}
            sx={{ display: data.hidden ? "none" : "block" }}
          />
        );
      } else if (data.type === "password" && dialogType !== "View") {
        return (
          <TextField
            autoFocus
            required={dialogType === "Add" ? data.required : false}
            margin="dense"
            id={data.id}
            name={data.name}
            label={
              dialogType === "Add"
                ? "Add " + data.label
                : "Change " + data.label
            }
            type={showPassword[data.id] ? "text" : "password"}
            fullWidth
            variant="standard"
            onChange={(e) => ({
              [data.id]: e.target.value,
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(data.id)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword[data.id] ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete={"new-password"}
            sx={{ display: data.hidden ? "none" : "block" }}
          />
        );
      } else if (data.type === "select") {
        return (
          <TextField
            autoFocus
            required
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            select
            fullWidth
            defaultValue={selectedData?.[data.id]}
            variant="standard"
            InputProps={{
              readOnly: dialogType === "View",
            }}
            sx={{ display: data.hidden ? "none" : "block" }}
          >
            <MenuItem key="" value="" sx={{ color: "gray" }}>
              (please select option)
            </MenuItem>
            {data?.selectOpt?.map((option: any) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name}
              </MenuItem>
            ))}
          </TextField>
        );
      } else if (data.type === "date") {
        return (
          <DatePicker
            readOnly={dialogType === "View"}
            slotProps={{
              textField: {
                variant: "standard",
                id: data.id,
                name: data.name,
                label: data.label,
                required: data.required,
              },
            }}
            sx={{ marginTop: "5px", width: "100%" }}
            defaultValue={dayjs(selectedData?.[data.id])}
            onChange={(date) => {
              if (date) {
                setSelectedData!((prev: any) => ({
                  ...prev,
                  [data.id]: dayjs(date).toDate(),
                }));
              }
            }}
          />
        );
      } else if (data.type === "check" || data.type === "switch") {
        const props = {
          disabled: dialogType === "View" ? true : false,
          defaultChecked: selectedData?.[data.id] === 1,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const isChecked = e.target.checked;
            setSelectedData!((prev: any) => ({
              ...prev,
              [data.id]: isChecked ? 1 : 0,
            }));
          },
        };

        return (
          <FormControlLabel
            id={data.id}
            name={data.name}
            label={data.label}
            sx={
              data.switchStyle === "IOS"
                ? { marginTop: 1, marginBottom: 1, marginLeft: -0.2 }
                : undefined
            }
            control={
              data.type === "switch" ? (
                data.switchStyle === "MUI" ? (
                  <MaterialUISwitch {...props} />
                ) : data.switchStyle === "Android" ? (
                  <Android12Switch {...props} />
                ) : data.switchStyle === "IOS" ? (
                  <IOSSwitch {...props} />
                ) : data.switchStyle === "Ant" ? (
                  <AntSwitch {...props} />
                ) : (
                  <Switch {...props} />
                )
              ) : (
                <Checkbox {...props} />
              )
            }
          />
        );
      }
    });
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit:
            dialogType === "Add"
              ? addCallback
              : dialogType === "Edit"
              ? editCallback
              : "",
        }}
      >
        <DialogTitle>
          {dialogType} {dialogContent}
        </DialogTitle>

        <DialogContent>{dialogFormMapping()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {dialogType === "View" ? (
            <></>
          ) : (
            <Button type="submit">
              {dialogType === "Edit" ? "Save " + dialogContent : dialogType}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

interface LSTVDialogFormDeleteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formElements: FormElement[];
  dialogTitle?: string;
  deleteCallback?: (event: React.FormEvent<HTMLFormElement>) => void;
  docnum?: string;
}

export const LSTVDialogDeleteForm = ({
  open,
  setOpen,
  formElements,
  deleteCallback,
  dialogTitle,
  docnum,
}: LSTVDialogFormDeleteProps) => {
  const { selectedData, setSelectedData, dialogType } = useHandles();
  const handleClose = () => {
    setOpen(false);
  };

  const dialogFormMapping = () => {
    return formElements.map((data: FormElement) => {
      if (data.type === "number") {
        return (
          <TextField
            autoFocus
            required
            fullWidth
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            defaultValue={selectedData?.[data.id]}
            onChange={(e) =>
              setSelectedData!((prev: any) => ({
                ...prev!,
                [data.id]: parseFloat(e.target.value),
              }))
            }
            InputProps={{
              readOnly: dialogType === "view",
            }}
            variant="standard"
            sx={{ display: data.hidden ? "none" : "none" }}
          />
        );
      } else if (data.type === "text") {
        return (
          <TextField
            autoFocus
            required={data.required}
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            fullWidth
            variant="standard"
            defaultValue={selectedData?.[data.id]}
            onChange={(e) =>
              setSelectedData!((prev: any) => ({
                ...prev!,
                [data.id]: e.target.value,
              }))
            }
            InputProps={{
              readOnly: dialogType === "View",
            }}
            sx={{ display: data.hidden ? "none" : "none" }}
          />
        );
      }
    });
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: deleteCallback,
        }}
      >
        <DialogTitle>
          {dialogTitle ? (
            <>
              {dialogType} {selectedData?.[docnum!]}
            </>
          ) : (
            <>
              {dialogType} {selectedData?.recid}
            </>
          )}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>Do you want to delete this?</DialogContentText>
          {dialogFormMapping()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button type="submit">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface LSTVGlobalDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  title: string;
  context: string;
  buttonText: any[];
}

export const LSTVGlobalDialog = ({
  dialogOpen,
  setDialogOpen,
  title,
  context,
  buttonText,
}: LSTVGlobalDialogProps) => {
  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{context}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {buttonText.map((data: any, idx: number) => {
            return (
              <Button key={idx} onClick={data.onClick} color={data.color}>
                {data.text}
              </Button>
            );
          })}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
