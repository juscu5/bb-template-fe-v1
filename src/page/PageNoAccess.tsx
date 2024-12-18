import { LSTVPageRootStyle } from "@/components/Dynamic";
import { Typography } from "@mui/material";
import alertError from "../assets/alert-error.svg";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function PageNoAccess() {
  return (
    <LSTVPageRootStyle
      style={{
        alignItems: "center",
        marginTop: "-150px",
        marginRight: "300px",
      }}
    >
      <Grid2 textAlign="center">
        <Grid2>
          <img src={alertError}></img>
        </Grid2>
        <Grid2>
          <Typography variant="h5">
            You don't have access on this page.
          </Typography>
        </Grid2>
        <Grid2>
          <Typography variant="h6">
            Please contact your administrator.
          </Typography>
        </Grid2>
      </Grid2>
    </LSTVPageRootStyle>
  );
}
