import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

const OtherInfo = () => {
  return (
    <div>
      <Grid container spacing={4}>
        <Grid xs={6}>
          <Box
            component="fieldset"
            sx={{ padding: "1rem", borderRadius: ".3rem" }}
          >
            <TextField
              sx={{ mb: "1rem" }}
              fullWidth
              label="VATable"
              name="docNoTo"
            />
            <TextField
              sx={{ mb: "1rem" }}
              fullWidth
              label="VAT Exempt"
              name="docNoTo"
            />
            <TextField
              sx={{ mb: "1rem" }}
              fullWidth
              label="VAT Zero Rated"
              name="docNoTo"
            />
            <TextField
              sx={{ mb: "1rem" }}
              fullWidth
              label="VAT Amount"
              name="docNoTo"
            />
          </Box>
        </Grid>
        <Grid xs={6}>
          <Box component="fieldset">
            <legend>Other Info</legend>
            <TextField
              fullWidth
              label="Testing Expiration Date"
              name="docNoTo"
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherInfo;
