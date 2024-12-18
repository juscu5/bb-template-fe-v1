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
            <legend>VAT</legend>
            <TextField
              size="small"
              sx={{ mb: 1 }}
              fullWidth
              label="VATable"
              name="docNoTo"
            />
            <TextField
              size="small"
              sx={{ mb: 1 }}
              fullWidth
              label="VAT Exempt"
              name="docNoTo"
            />
            <TextField
              size="small"
              sx={{ mb: 1 }}
              fullWidth
              label="VAT Zero Rated"
              name="docNoTo"
            />
            <TextField
              size="small"
              sx={{ mb: 1 }}
              fullWidth
              label="VAT Amount"
              name="docNoTo"
            />
          </Box>
        </Grid>
        <Grid xs={6}>
          <Box component="fieldset" sx={{ borderRadius: ".3rem" }}>
            <legend>Other Info</legend>
            <TextField
              size="small"
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
