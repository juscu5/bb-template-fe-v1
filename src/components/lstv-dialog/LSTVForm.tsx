import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { FormElement } from "@/models";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LSTVFormProps<T> {
  title: string;
  formElements: FormElement[];
}

const LSTVForm = <T extends any[]>({
  title,
  formElements,
}: LSTVFormProps<T>): JSX.Element => {
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

  const dialogFormMapping = () => {
    return formElements.map((data: FormElement) => {
      if (data.type === "text") {
        return (
          <TextField
            autoFocus
            required
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            fullWidth
            variant="standard"
            onChange={(e) => ({
              [data.id]: e.target.value,
            })}
          />
        );
      } else if (data.type === "password") {
        return (
          <TextField
            error={data.validation ? true : false}
            helperText={data.validationText}
            autoFocus
            required
            margin="dense"
            id={data.id}
            name={data.name}
            label={data.label}
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
          />
        );
      } else if (data.type === "number") {
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
            onChange={(e) => ({
              [data.id]: parseFloat(e.target.value),
            })}
            variant="standard"
          />
        );
      } else if (data.type === "monetary") {
        return (
          <TextField
            autoFocus
            fullWidth
            required
            id={data.id}
            name={data.name}
            label={data.label}
            type={data.type}
            margin="dense"
            variant="standard"
            onChange={(e) => ({
              [data.id]: parseFloat(e.target.value),
            })}
            InputProps={{
              inputProps: {
                pattern: "[0-9]*",
              },
            }}
          />
        );
      } else if (data.type === "date") {
        const [formData, setFormData] = React.useState({
          [data.id]: dayjs(new Date()).toDate(),
        });
        return (
          <DatePicker
            slotProps={{
              textField: {
                variant: "standard",
                id: data.id,
                name: data.name,
                label: data.label,
              },
            }}
            sx={{ marginTop: "5px", width: "100%" }}
            value={dayjs(data.id)}
            onChange={(date) => {
              if (date) {
                ({
                  [data.id]: dayjs(date).toDate(),
                });
              }
            }}
          />
        );
      }
    });
  };

  const verifiedPassword = () => {};

  return (
    <Paper
      variant="elevation"
      component="form"
      sx={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      <DialogTitle>
        <Typography variant="h5">{title}</Typography>
      </DialogTitle>

      <DialogContent>{dialogFormMapping()}</DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button type="submit" variant="contained" color="success">
          Save Password
        </Button>
      </DialogActions>
    </Paper>
  );
};

export default LSTVForm;
