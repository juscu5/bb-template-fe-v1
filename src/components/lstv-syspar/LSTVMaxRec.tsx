import React, { useState, useEffect } from "react";
import { Alert, Divider, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { setSysPar } from "@/store/useStore";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useAlertStatus } from "@/store/useStore";
import { ref } from "yup";

export interface LSTVMaxRecProps {
  refetch1?: () => void;
}

const LSTVMaxRec = ({ refetch1 }: LSTVMaxRecProps): JSX.Element => {
  const { account } = useAccountStore();
  const { setMaxRec } = setSysPar();
  const { alert, setAlert } = useAlertStatus();

  const [maxRecValue, setMaxRecValue] = useState<number>();

  const { data, isLoading, refetch } = useQuery<any>(
    "syspar",
    async () =>
      await ApiService.get("syspar", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  useEffect(() => {
    if (!isLoading && data?.data.payload[0]) {
      setMaxRecValue(data?.data.payload[0].userlogmaxrec);
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch1!();
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxRecValue(Number(e.target.value));
    setAlert(false);
  };

  const handleSubmmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userlogmaxrec = formData.get("userlogmaxrec");
    if (maxRecValue === data?.data.payload[0].userlogmaxrec) {
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    } else {
      setMaxRec(userlogmaxrec);
      if (!isLoading && data?.data.payload[0]) {
        setMaxRecValue(data?.data.payload[0].userlogmaxrec);
        refetch();
      }
    }
  };

  return (
    <>
      <Paper component="form" onSubmit={handleSubmmit} variant="outlined">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid xs={5} textAlign="right">
            Maximum Records Allowed
          </Grid>
          <Grid xs={2} textAlign={"right"}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="userlogmaxrec"
              name="userlogmaxrec"
              type="number"
              variant="outlined"
              size="small"
              value={maxRecValue ?? ""}
              onChange={handleInputChange}
              color="success"
              InputProps={{
                inputProps: {
                  pattern: "[0-9]*",
                },
              }}
            />
          </Grid>
          <Grid xs={3} textAlign={"left"}>
            <Button
              variant="contained"
              color="success"
              size="large"
              type="submit"
            >
              Save
            </Button>
          </Grid>
          <Grid xs={2} textAlign={"left"}>
            {alert && (
              <Alert variant="standard" severity="success">
                Max Records Saved!
              </Alert>
            )}
          </Grid>
        </Stack>
      </Paper>
    </>
  );
};

export default LSTVMaxRec;
