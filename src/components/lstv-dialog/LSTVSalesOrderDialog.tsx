import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormElement } from "@/models";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  Checkbox,
  Container,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAuthStore } from "@/store/useStore";
import { use_SystemParam } from "../hooks/lstvSysparam";
import { useHandles } from "@/store/useCallbackStore";
import {
  Android12Switch,
  AntSwitch,
  IOSSwitch,
  MaterialUISwitch,
} from "../lstv-style/LSTVSwitchStyle";
import LSTVDetails from "./LSTVDetails";

interface LSTVDialogFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formElements: FormElement[];
  dialogContent: string;
  dialogTitle: string;
  addCallback?: (event: React.FormEvent<HTMLFormElement>) => void;
  editCallback?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const LSTVSalesOrderDialog = ({
  open,
  setOpen,
  formElements,
  dialogContent,
  dialogTitle,
  addCallback,
  editCallback,
}: LSTVDialogFormProps) => {
  const [docnum, setDocnum] = React.useState("");
  const { user } = useAuthStore();
  const { data, refetch } = use_SystemParam();
  const { selectedData, dialogType } = useHandles();

  const [changeAddVal, setChangeAddVal] = React.useState<string>("");
  const [changeShipVal, setChangeShipVal] = React.useState<any[]>([]);
  const [selectedShip, setSelectedShip] = React.useState<string>("");

  React.useEffect(() => {
    setDocnum(data?.data?.payload[0]?.sodocnum);
  }, [data, refetch]);

  React.useEffect(() => {
    if (changeShipVal.length > 0) {
      setSelectedShip(changeShipVal[0].id);
    }
  }, [changeShipVal]);

  React.useEffect(() => {
    const defaultSelectedId = selectedData?.[formElements?.[1].id] || "";
    handleOptionChange(defaultSelectedId);
  }, [selectedData, formElements]);

  //Select Change customer description
  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedId = e.target.value as string;
    handleOptionChange(selectedId);
  };

  //Option change of address and shipto
  const handleOptionChange = (selectedId: string) => {
    const selectedOption = formElements?.[1]?.selectOpt?.find(
      (opt: any) => opt.id === selectedId
    );
    const add1 = selectedOption?.address;
    const add2 = selectedOption?.address2;
    setChangeAddVal(add1);
    setChangeShipVal([
      {
        id: add1,
        name: add1,
      },
      {
        id: add2,
        name: add2,
      },
    ]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const csProps = {
    disabled: dialogType === "View" ? true : false,
    defaultChecked: selectedData?.[formElements?.[12].id] === 1,
  };

  // #region Dialog Static Map
  const dialogStaticMap = () => {
    return (
      <>
        <Grid container direction="row" alignItems="flex-start" xs={12}>
          <Grid container direction="column" alignItems="left" xs={4}>
            <TextField
              autoFocus
              required={formElements?.[0].required}
              margin="dense"
              id={formElements?.[0].id}
              name={formElements?.[0].name}
              label={formElements?.[0].label}
              type={formElements?.[0].type}
              variant="outlined"
              value={
                dialogType === "Add"
                  ? formElements?.[0].disabled
                    ? docnum
                    : selectedData?.[formElements?.[0].id]
                  : selectedData?.[formElements?.[0].id]
              }
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              sx={{
                display: formElements?.[0].hidden ? "none" : "block",
                width: "75%",
              }}
            />
            <br />
            <br />
            <TextField
              autoFocus
              required
              disabled={formElements?.[1].disabled}
              margin="dense"
              id={formElements?.[1].id}
              name={formElements?.[1].name}
              label={formElements?.[1].label}
              select
              defaultValue={selectedData?.[formElements?.[1].id] || ""}
              variant="outlined"
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              SelectProps={{
                sx: { width: "100%" }, // Ensure the select itself is 100% width
              }}
              sx={{
                width: "75%",
                marginTop: "20px",
                display: formElements?.[1].hidden ? "none" : "block",
              }}
              onChange={handleSelectChange}
            >
              <MenuItem key="" value="" sx={{ color: "gray" }}>
                (please select option)
              </MenuItem>
              {formElements?.[1]?.selectOpt?.map((option: any) => (
                <MenuItem key={option?.id} value={option?.id}>
                  {option?.name}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <TextField
              autoFocus
              required={formElements?.[2].required}
              disabled={formElements?.[2].disabled}
              placeholder="Please Select Customer Description"
              margin="dense"
              multiline
              rows={6.5} // Sets the maximum number of rows
              id={formElements?.[2].id}
              name={formElements?.[2].name}
              label={formElements?.[2].label}
              type={formElements?.[2].type}
              variant="outlined"
              value={changeAddVal || selectedData?.["cusadd1"] || ""}
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              sx={{
                display: formElements?.[2].hidden ? "none" : "block",
                width: "75%",
              }}
            />
            <br />
            <TextField
              autoFocus
              required
              disabled={formElements?.[3].disabled}
              margin="dense"
              id={formElements?.[3].id}
              name={formElements?.[3].name}
              label={formElements?.[3].label}
              select
              defaultValue={selectedData?.[formElements?.[3].id] || ""}
              variant="outlined"
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              SelectProps={{
                sx: { width: "100%" },
              }}
              sx={{
                width: "75%",
                marginTop: "20px",
                display: formElements?.[3].hidden ? "none" : "block",
              }}
            >
              <MenuItem key="" value="" sx={{ color: "gray" }}>
                (please select option)
              </MenuItem>
              {changeShipVal?.map((option: any) => (
                <MenuItem key={option?.id} value={option?.id}>
                  {option?.name}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <TextField
              autoFocus
              disabled={formElements?.[4].disabled}
              required={formElements?.[4].required}
              margin="dense"
              id={formElements?.[4].id}
              name={formElements?.[4].name}
              label={formElements?.[4].label}
              type={formElements?.[4].type}
              variant="outlined"
              defaultValue={
                dialogType === "Add"
                  ? "Angel"
                  : selectedData?.[formElements?.[4].id] || ""
              }
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              sx={{
                display: formElements?.[4].hidden ? "none" : "block",
                width: "75%",
                marginTop: "30px",
              }}
            />
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="left"
            alignContent="center"
            xs={8}
          >
            <Grid direction="column" xs={6}>
              <DatePicker
                slotProps={{
                  textField: {
                    variant: "outlined",
                    id: formElements?.[5].id,
                    name: formElements?.[5].name,
                    label: formElements?.[5].label,
                    inputProps: {
                      readOnly: dialogType === "View",
                    },
                    required: formElements?.[5].required,
                  },
                }}
                sx={{ marginTop: "8px", width: "80%" }}
                defaultValue={dayjs(selectedData?.[formElements?.[5].id])}
              />
              <TextField
                autoFocus
                disabled={formElements?.[6].disabled}
                required={formElements?.[6].required}
                margin="dense"
                id={formElements?.[6].id}
                name={formElements?.[6].name}
                label={formElements?.[6].label}
                type={formElements?.[6].type}
                variant="outlined"
                defaultValue={selectedData?.[formElements?.[6].id] || ""}
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                sx={{
                  display: formElements?.[6].hidden ? "none" : "block",
                  width: "80%",
                }}
              />
              <br />
              <TextField
                autoFocus
                required
                disabled={formElements?.[7].disabled}
                margin="dense"
                id={formElements?.[7].id}
                name={formElements?.[7].name}
                label={formElements?.[7].label}
                select
                defaultValue={selectedData?.[formElements?.[7].id] || ""}
                variant="outlined"
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                SelectProps={{
                  sx: { width: "100%" }, // Ensure the select itself is 100% width
                }}
                sx={{
                  width: "80%",
                  display: formElements?.[7].hidden ? "none" : "block",
                }}
              >
                <MenuItem key="" value="" sx={{ color: "gray" }}>
                  (please select option)
                </MenuItem>
                {formElements?.[7]?.selectOpt?.map((option: any) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                required
                disabled={formElements?.[8].disabled}
                margin="dense"
                id={formElements?.[8].id}
                name={formElements?.[8].name}
                label={formElements?.[8].label}
                select
                defaultValue={selectedData?.[formElements?.[8].id] || ""}
                variant="outlined"
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                SelectProps={{
                  sx: { width: "100%" }, // Ensure the select itself is 100% width
                }}
                sx={{
                  width: "80%",
                  display: formElements?.[8].hidden ? "none" : "block",
                }}
              >
                <MenuItem key="" value="" sx={{ color: "gray" }}>
                  (please select option)
                </MenuItem>
                {formElements?.[8]?.selectOpt?.map((option: any) => (
                  <MenuItem value={option?.id} key={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid direction="column" xs={6}>
              <TextField
                autoFocus
                disabled={formElements?.[9].disabled}
                required={formElements?.[9].required}
                margin="dense"
                id={formElements?.[9].id}
                name={formElements?.[9].name}
                label={formElements?.[9].label}
                type={formElements?.[9].type}
                variant="outlined"
                value={user?.usrcde}
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                sx={{
                  display: formElements?.[9].hidden ? "none" : "block",
                  width: "80%",
                }}
              />
              <br />
              <br />
              <TextField
                autoFocus
                required
                disabled={formElements?.[10].disabled}
                id={formElements?.[10].id}
                name={formElements?.[10].name}
                label={formElements?.[10].label}
                select
                defaultValue={selectedData?.[formElements?.[10].id] || ""}
                variant="outlined"
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                SelectProps={{
                  sx: { width: "100%" },
                }}
                sx={{
                  width: "80%",
                  marginTop: "12px",
                  display: formElements?.[10].hidden ? "none" : "block",
                }}
              >
                <MenuItem key="" value="" sx={{ color: "gray" }}>
                  (please select option)
                </MenuItem>
                {formElements?.[10]?.selectOpt?.map((option: any) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                required
                disabled={formElements?.[11].disabled}
                id={formElements?.[11].id}
                name={formElements?.[11].name}
                label={formElements?.[11].label}
                select
                defaultValue={selectedData?.[formElements?.[11].id] || ""}
                variant="outlined"
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                SelectProps={{
                  sx: { width: "100%" }, // Ensure the select itself is 100% width
                }}
                sx={{
                  width: "80%",
                  marginTop: "7px",
                  display: formElements?.[11].hidden ? "none" : "block",
                }}
              >
                <MenuItem key="" value="" sx={{ color: "gray" }}>
                  (please select option)
                </MenuItem>
                {formElements?.[11]?.selectOpt?.map((option: any) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <FormControlLabel
                id={formElements?.[12].id}
                name={formElements?.[12].name}
                label={formElements?.[12].label}
                sx={
                  formElements?.[12].switchStyle === "IOS"
                    ? { marginTop: 1, marginBottom: 1, marginLeft: -0.2 }
                    : undefined
                }
                control={
                  formElements?.[12].type === "switch" ? (
                    formElements?.[12].switchStyle === "MUI" ? (
                      <MaterialUISwitch {...csProps} />
                    ) : formElements?.[12].switchStyle === "Android" ? (
                      <Android12Switch {...csProps} />
                    ) : formElements?.[12].switchStyle === "IOS" ? (
                      <IOSSwitch {...csProps} />
                    ) : formElements?.[12].switchStyle === "Ant" ? (
                      <AntSwitch {...csProps} />
                    ) : (
                      <Switch {...csProps} />
                    )
                  ) : (
                    <Checkbox {...csProps} />
                  )
                }
              />
              <br />
            </Grid>
            <TextField
              autoFocus
              required={formElements?.[13].required}
              margin="dense"
              multiline
              rows={3} // Sets the maximum number of rows
              id={formElements?.[13].id}
              name={formElements?.[13].name}
              label={formElements?.[13].label}
              type={formElements?.[13].type}
              variant="outlined"
              defaultValue={selectedData?.[formElements?.[13].id] || ""}
              InputProps={{
                readOnly: dialogType === "View",
                sx: { width: "100%" },
              }}
              sx={{
                display: formElements?.[13].hidden ? "none" : "block",
                width: "90%",
                marginTop: "42px",
              }}
            />
            <Grid direction="column" xs={6}>
              <TextField
                autoFocus
                disabled={formElements?.[14].disabled}
                required={formElements?.[14].required}
                margin="dense"
                id={formElements?.[14].id}
                name={formElements?.[14].name}
                label={formElements?.[14].label}
                type={formElements?.[14].type}
                variant="outlined"
                defaultValue={
                  dialogType === "Add"
                    ? "SJ"
                    : selectedData?.[formElements?.[14].id] || ""
                }
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                sx={{
                  display: formElements?.[14].hidden ? "none" : "block",
                  width: "80%",
                }}
              />
            </Grid>
            <Grid direction="column" textAlign="right" xs={6}>
              <TextField
                autoFocus
                disabled={formElements?.[15].disabled}
                required={formElements?.[15].required}
                margin="dense"
                id={formElements?.[15].id}
                name={formElements?.[15].name}
                label={formElements?.[15].label}
                type={formElements?.[15].type}
                variant="outlined"
                defaultValue={
                  dialogType === "Add"
                    ? "Regine"
                    : selectedData?.[formElements?.[15].id] || ""
                }
                InputProps={{
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                sx={{
                  display: formElements?.[15].hidden ? "none" : "block",
                  width: "80%",
                }}
              />
              <br />
              <TextField
                autoFocus
                required={formElements?.[16].required}
                margin="dense"
                id={formElements?.[16].id}
                name={formElements?.[16].name}
                label={formElements?.[16].label}
                type={formElements?.[16].type}
                variant="outlined"
                defaultValue={
                  selectedData?.[formElements?.[16].id] === undefined
                    ? 0.0
                    : parseFloat(selectedData?.[formElements?.[16].id]).toFixed(
                        2
                      ) || 0.0
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                  inputProps: {
                    pattern: "^[0-9]*.?[0-9]{0,5}$",
                  },
                  readOnly: dialogType === "View",
                  sx: { width: "100%" },
                }}
                sx={{
                  display: formElements?.[16].hidden ? "none" : "block",
                  width: "80%",
                  marginTop: "20px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  // #endregion

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
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
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <DialogContent>{dialogStaticMap()}</DialogContent>
          {/* <DialogContent>
            <Typography
              variant="h5"
              style={{ textAlign: "right", marginRight: "7%" }}
            >
              Grand Total: ₱{"0.00"}
            </Typography>
          </DialogContent> */}
        </Container>

        <>
          <LSTVDetails />
        </>
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
