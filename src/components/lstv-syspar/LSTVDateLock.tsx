import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import { useCreateLog } from "@/store/useStore";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const LSTVDateLock = (): JSX.Element => {
  const { account } = useAccountStore();
  const { createLogs } = useCreateLog();

  // disable
  const [dis, setDis] = React.useState<boolean>(false);
  const [saveNotif, setSaveNotif] = useState<boolean>(false);

  //change value
  const [selectedDateFrom, setSelectedDateFrom] =
    React.useState<dayjs.Dayjs | null>(null);
  const [selectedDateTo, setSelectedDateTo] =
    React.useState<dayjs.Dayjs | null>(null);

  // error toggle
  const [errorFrom, setErrorFrom] = useState(false);
  const [errorTo, setErrorTo] = useState(false);
  const [errorTextFrom, setErrorTextFrom] = useState<string>("");
  const [errorTextTo, setErrorTextTo] = useState<string>("");

  // handle change func
  const handleDateChangeFrom = (newValue: dayjs.Dayjs | null) => {
    setSelectedDateFrom(newValue);
    setErrorFrom(false);
    setErrorTextFrom("");
    setTimeout(() => {
      setSaveNotif(false);
    }, 5000);
  };
  const handleDateChangeTo = (newValue: dayjs.Dayjs | null) => {
    setSelectedDateTo(newValue);
    setErrorTo(false);
    setErrorTextTo("");
    setTimeout(() => {
      setSaveNotif(false);
    }, 5000);
  };
  const handleEditChange = () => {
    if (dis) {
      setDis(false);
    } else {
      setDis(true);
    }
  };

  // Api connection
  const { data, refetch } = useQuery<any>(
    "syspar",
    async () =>
      await ApiService.get("syspar", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );
  const apiConEdit = async (gldatelock1: any, gldatelock2: any) => {
    console.log(gldatelock1, gldatelock2);

    const dataDL = {
      gldatelock1: gldatelock1,
      gldatelock2: gldatelock2,
    };

    const module = "Date Lock";
    const activity = "Edit Date Lock";

    const gldatelock1Server = dayjs(data?.data.payload[0].gldatelock1).format(
      "MM/DD/YYYY"
    );
    const gldatelock2Server = dayjs(data?.data.payload[0].gldatelock2).format(
      "MM/DD/YYYY"
    );

    if (
      gldatelock1 === gldatelock1Server &&
      gldatelock2 === gldatelock2Server
    ) {
      setSaveNotif(false);
    } else {
      try {
        const res = await ApiService.put(`syspar`, dataDL, {
          headers: { Authorization: `Bearer ${account}` },
        });
        if (res.status === 200) {
          const remarks = "Datelock Successfully Updated";
          createLogs(module, activity, remarks);
          setSaveNotif(true);
          refetch();
          setTimeout(() => {
            setSaveNotif(false);
          }, 5000);
        } else {
          const remarks = "Datelock Edit Unsuccessfully";
          createLogs(module, activity, remarks);
        }
      } catch (e) {
        createLogs(module, activity, "error connection");
      }
    }
  };

  // on Submit
  const handleSubmmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const gldatelock1 = data.get("gldatelock1");
    const gldatelock2 = data.get("gldatelock2");

    // validation  1
    if (gldatelock1 === null || gldatelock1 === "MM/DD/YYYY") {
      setErrorFrom(true);
      setErrorTextFrom("Please select date before continue");
    } else {
      setErrorFrom(false);
      setErrorTextFrom("");
    }

    // validation  2
    if (gldatelock2 === null || gldatelock2 === "MM/DD/YYYY") {
      setErrorTo(true);
      setErrorTextTo("Please select date before continue");
    } else {
      setErrorTo(false);
      setErrorTextTo("");
    }

    // validation  3 and success
    if (
      gldatelock1 !== null &&
      gldatelock2 !== null &&
      gldatelock1 !== "MM/DD/YYYY" &&
      gldatelock2 !== "MM/DD/YYYY"
    ) {
      if (gldatelock1! > gldatelock2!) {
        setErrorFrom(true);
        setErrorTo(true);
        setErrorTextFrom("Mas maliit dapat");
        setErrorTextTo("Mas malaki dapat");
      } else {
        apiConEdit(gldatelock1, gldatelock2);
      }
    }
  };

  return (
    <Paper
      variant="elevation"
      component="form"
      onSubmit={handleSubmmit}
      sx={{ paddingTop: "20px", paddingBottom: "20px" }}
      elevation={5}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogTitle>
          <Typography variant="h5">
            DATE LOCK
            {/* <IconButton onClick={handleEditChange}>
              <DriveFileRenameOutlineIcon fontSize="medium" />
            </IconButton> */}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            spacing={5}
            alignItems="center"
            justifyContent="space-between"
            position="relative"
          >
            <Grid xs={6}>
              <Typography>From:</Typography>
              <DatePicker
                slotProps={{
                  textField: {
                    error: errorFrom,
                    variant: "outlined",
                    id: "gldatelock1",
                    name: "gldatelock1",
                    helperText: errorTextFrom,
                  },
                }}
                sx={{ marginTop: "5px", width: "100%" }}
                value={dayjs(data?.data.payload[0].gldatelock1)}
                onChange={handleDateChangeFrom}
                disabled={dis}
              />
            </Grid>
            <Grid xs={6}>
              <Typography>To:</Typography>
              <DatePicker
                slotProps={{
                  textField: {
                    error: errorTo,
                    variant: "outlined",
                    id: "gldatelock2",
                    name: "gldatelock2",
                    helperText: errorTextTo,
                  },
                }}
                sx={{ marginTop: "5px", width: "100%" }}
                value={dayjs(data?.data.payload[0].gldatelock2)}
                onChange={handleDateChangeTo}
                disabled={dis}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={dis}
          >
            Save
          </Button>
        </DialogActions>
      </LocalizationProvider>
      {saveNotif && (
        <>
          <br />
          <Alert severity="success" sx={{ mb: 2 }}>
            Date Lock Succesfully Save!
          </Alert>
        </>
      )}
    </Paper>
  );
};

export default LSTVDateLock;
