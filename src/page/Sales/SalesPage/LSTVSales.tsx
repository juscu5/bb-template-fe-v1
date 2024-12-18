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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Grid1 from "@mui/material/Grid";
import { useAuthStore } from "@/store/useStore";
import { use_SystemParam } from "../../../components/hooks/lstvSysparam";
import { useHandles } from "@/store/useCallbackStore";
import {
  Android12Switch,
  AntSwitch,
  IOSSwitch,
  MaterialUISwitch,
} from "../../../components/lstv-style/LSTVSwitchStyle";
import LSTVDetails from "./LSTVDetails";
import LSTVPageTitle from "@/components/lstv-layout/title/LSTVPageTitle2";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface LSTVDialogFormProps {
  setOpen: (open: boolean) => void;
  formElements: FormElement[];
  dialogContent: string;
  addCallback?: (
    event: React.FormEvent<HTMLFormElement>,
    salesItem: any[]
  ) => void;
  editCallback?: (
    event: React.FormEvent<HTMLFormElement>,
    salesItem: any[],
    removedItem: any[]
  ) => void;
}

export const LSTVSales = ({
  setOpen,
  formElements,
  dialogContent,
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

  const [grandTotal, setGrandTotal] = React.useState<number | null>();
  const [salesItem, setSalesItem] = React.useState<any>();
  const [removedItem, setRemoved] = React.useState<any[]>([]);
  const [initializeItem, setInitializeItem] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    setDocnum(data?.data?.payload[0]?.saldocnum);
  }, [data, refetch]);

  React.useEffect(() => {
    if (changeShipVal.length > 0) {
      setSelectedShip(changeShipVal[0].id);
    }
  }, [changeShipVal]);

  React.useEffect(() => {
    const defaultSelectedId = selectedData?.[formElements?.[1].id] || "";
    setInitializeItem(true);
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

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCallback?.(event, salesItem!);
    setInitializeItem(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editCallback?.(event, salesItem!, removedItem!);
    setInitializeItem(false);
  };

  const csProps = {
    disabled: dialogType === "View" ? true : false,
    defaultChecked: selectedData?.[formElements?.[12].id] === 1,
  };

  const docNum =
    dialogType === "Add"
      ? formElements?.[0].disabled
        ? docnum
        : selectedData?.[formElements?.[0].id]
      : selectedData?.[formElements?.[0].id];

  // #region Dialog Static Map
  const dialogStaticMap = () => {
    return (
      <>
        <Grid1 container spacing={1} columns={5}>
          <Grid1 item xs={6} md={4}>
            <Box>
              <Accordion
                defaultExpanded
                variant="outlined"
                sx={{ border: "none" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    flexDirection: "row-reverse",
                    "&:not(.Mui-expanded)": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Typography variant="h6">
                    &nbsp;&nbsp;&nbsp;Sales Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pl: 5, pr: 5 }}>
                  <Grid1 container spacing={1} columns={5}>
                    <Grid1 item xs={6} md={1}>
                      <TextField
                        autoFocus
                        size="small"
                        required={formElements?.[0].required}
                        margin="dense"
                        id={formElements?.[0].id}
                        name={formElements?.[0].name}
                        label={formElements?.[0].label}
                        type={formElements?.[0].type}
                        variant="outlined"
                        value={docNum}
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "100%" },
                        }}
                        sx={{
                          display: formElements?.[0].hidden ? "none" : "block",
                          width: "80%",
                        }}
                      />
                      <TextField
                        autoFocus
                        size="small"
                        disabled={formElements?.[6].disabled}
                        required={formElements?.[6].required}
                        margin="dense"
                        id={formElements?.[6].id}
                        name={formElements?.[6].name}
                        label={formElements?.[6].label}
                        type={formElements?.[6].type}
                        variant="outlined"
                        defaultValue={
                          selectedData?.[formElements?.[6].id] || ""
                        }
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "100%" },
                        }}
                        sx={{
                          display: formElements?.[6].hidden ? "none" : "block",
                          width: "80%",
                        }}
                      />
                    </Grid1>
                    <Grid1 item xs={6} md={1}>
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
                            InputProps: {
                              size: "small",
                            },
                            required: formElements?.[5].required,
                          },
                        }}
                        sx={{ marginTop: "8px", width: "80%" }}
                        defaultValue={dayjs(
                          selectedData?.[formElements?.[5].id]
                        )}
                      />
                      <TextField
                        autoFocus
                        required
                        size="small"
                        disabled={formElements?.[10].disabled}
                        id={formElements?.[10].id}
                        name={formElements?.[10].name}
                        label={formElements?.[10].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[10].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
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
                    </Grid1>
                    <Grid1 item xs={6} md={1}>
                      <TextField
                        autoFocus
                        required
                        size="small"
                        disabled={formElements?.[7].disabled}
                        margin="dense"
                        id={formElements?.[7].id}
                        name={formElements?.[7].name}
                        label={formElements?.[7].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[7].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
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
                        size="small"
                        disabled={formElements?.[8].disabled}
                        margin="dense"
                        id={formElements?.[8].id}
                        name={formElements?.[8].name}
                        label={formElements?.[8].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[8].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
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
                    </Grid1>
                    <Grid1 item xs={6} md={1}>
                      <TextField
                        autoFocus
                        size="small"
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

                      <TextField
                        autoFocus
                        required
                        size="small"
                        disabled={formElements?.[11].disabled}
                        id={formElements?.[11].id}
                        name={formElements?.[11].name}
                        label={formElements?.[11].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[11].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
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
                    </Grid1>
                    <Grid1 item xs={6} md={1}>
                      <FormControlLabel
                        id={formElements?.[12].id}
                        name={formElements?.[12].name}
                        label={formElements?.[12].label}
                        sx={
                          formElements?.[12].switchStyle === "IOS"
                            ? {
                                marginTop: 1,
                                marginBottom: 1,
                                marginLeft: -0.2,
                              }
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
                    </Grid1>
                  </Grid1>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box>
              <Accordion variant="outlined" sx={{ border: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    flexDirection: "row-reverse",
                    "&.Mui-expanded": {
                      borderTop: "1px solid rgb(231, 231, 231)",
                    },
                  }}
                >
                  <Typography variant="h6">
                    &nbsp;&nbsp;&nbsp;Customer Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pl: 5, pr: 5 }}>
                  <Grid1 container spacing={1} columns={3}>
                    <Grid1 item xs={6} md={1}>
                      <TextField
                        autoFocus
                        required
                        size="small"
                        disabled={formElements?.[1].disabled}
                        margin="dense"
                        id={formElements?.[1].id}
                        name={formElements?.[1].name}
                        label={formElements?.[1].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[1].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
                        }}
                        SelectProps={{
                          sx: { width: "100%" }, // Ensure the select itself is 100% width
                        }}
                        sx={{
                          width: "80%",
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
                      <TextField
                        autoFocus
                        required
                        size="small"
                        disabled={formElements?.[3].disabled}
                        margin="dense"
                        id={formElements?.[3].id}
                        name={formElements?.[3].name}
                        label={formElements?.[3].label}
                        select
                        defaultValue={
                          selectedData?.[formElements?.[3].id] || ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "80%" },
                        }}
                        SelectProps={{
                          sx: { width: "100%" },
                        }}
                        sx={{
                          width: "80%",
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
                    </Grid1>
                    <Grid1 item xs={6} md={2}>
                      <TextField
                        autoFocus
                        size="small"
                        required={formElements?.[2].required}
                        disabled={formElements?.[2].disabled}
                        placeholder="Please Select Customer Description"
                        margin="dense"
                        multiline
                        rows={3} // Sets the maximum number of rows
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
                          width: "80%",
                        }}
                      />
                    </Grid1>
                  </Grid1>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box>
              <Accordion
                variant="outlined"
                sx={{
                  border: "none",
                  "&:not(.Mui-expanded)": {
                    borderBottom: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    flexDirection: "row-reverse",
                    "&.Mui-expanded": {
                      borderTop: "1px solid rgb(231, 231, 231)",
                    },
                  }}
                >
                  <Typography variant="h6">
                    &nbsp;&nbsp;&nbsp;Additional Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pl: 5, pr: 5 }}>
                  <Grid1 container spacing={1} columns={3}>
                    <Grid1 item xs={6} md={1}>
                      <TextField
                        autoFocus
                        size="small"
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
                          width: "80%",
                        }}
                      />
                      <TextField
                        autoFocus
                        size="small"
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
                      <TextField
                        autoFocus
                        size="small"
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
                    </Grid1>
                    <Grid1 item xs={6} md={2}>
                      <TextField
                        autoFocus
                        size="small"
                        required={formElements?.[13].required}
                        margin="dense"
                        multiline
                        rows={5} // Sets the maximum number of rows
                        id={formElements?.[13].id}
                        name={formElements?.[13].name}
                        label={formElements?.[13].label}
                        type={formElements?.[13].type}
                        variant="outlined"
                        defaultValue={
                          selectedData?.[formElements?.[13].id] || ""
                        }
                        InputProps={{
                          readOnly: dialogType === "View",
                          sx: { width: "100%" },
                        }}
                        sx={{
                          display: formElements?.[13].hidden ? "none" : "block",
                          width: "80%",
                        }}
                      />
                    </Grid1>
                  </Grid1>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid1>
          <Grid1
            item
            xs={6}
            md={1}
            borderLeft="1px solid rgb(231, 231, 231)"
            alignContent="center"
          >
            <DialogContent sx={{ textAlign: "right", alignContent: "right" }}>
              <TextField
                autoFocus
                required={formElements?.[16].required}
                margin="dense"
                id={formElements?.[16].id}
                name={formElements?.[16].name}
                label={formElements?.[16].label}
                type={formElements?.[16].type}
                variant="outlined"
                value={grandTotal}
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
                  // display: formElements?.[16].hidden ? "none" : "block",
                  width: "15%",
                  height: "0px",
                  mt: -3,
                  visibility: formElements?.[16].hidden ? "hidden" : "visible",
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  mr: 3,
                  mt: -5,
                }}
              >
                Grand Total <br /> ₱{grandTotal}
              </Typography>
            </DialogContent>
          </Grid1>
        </Grid1>
      </>
    );
  };

  // #endregion

  const element = (
    <>
      {dialogType === "View" ? (
        <></>
      ) : (
        <Button variant="outlined" type="submit">
          {dialogType === "Edit" ? "Save" + dialogContent : dialogType}
        </Button>
      )}
      <Button sx={{ mr: 1 }} variant="outlined" onClick={handleClose}>
        Cancel
      </Button>
    </>
  );

  console.log(docNum);

  return (
    <>
      <Box
        component="form"
        onSubmit={
          dialogType === "Add"
            ? handleAdd
            : dialogType === "Edit"
            ? handleSave
            : (e) => e.preventDefault()
        }
      >
        <DialogTitle>
          <Grid1 container columns={24}>
            <Grid1 item xs={6} md={1} alignContent="center">
              <Button
                color="inherit"
                title="Back To Sales"
                size="large"
                sx={{
                  ml: -1,
                  mt: -1.5,
                  color: "gray",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onClick={handleClose}
              >
                <KeyboardBackspaceIcon fontSize="large" />
                <Typography fontSize={10}>back to sales</Typography>
              </Button>
            </Grid1>
            <Grid1 item xs={6} md={22.2} ml={3}>
              <LSTVPageTitle
                title={
                  dialogType === "Edit"
                    ? `Sales Doc No#: ${docNum}`
                    : dialogType! + " " + dialogContent
                }
                element={element}
              />
            </Grid1>
          </Grid1>
        </DialogTitle>

        <Divider sx={{ ml: 6, mr: 6 }} />

        <DialogContent sx={{ ml: 3, mr: 3 }}>{dialogStaticMap()}</DialogContent>

        <Divider sx={{ ml: 6, mr: 6 }} />
      </Box>
      <DialogContent>
        <LSTVDetails
          dialogType={dialogType!}
          setGrandTotal={setGrandTotal}
          setSalesItem={setSalesItem}
          docNum={docNum}
          setRemovedItem={setRemoved}
          initializeItem={initializeItem!}
          setInitializeItem={setInitializeItem}
        />
      </DialogContent>
      <br />
      <br />
      <br />
    </>
  );
};
