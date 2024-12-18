import { LSTVPageRootStyle } from "@/components/Dynamic";
import { Typography } from "@mui/material";
import alertError from "../assets/404-not-found.svg";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function PageNotFound() {
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
            404: Page Not Found or In Development
          </Typography>
        </Grid2>
        <Grid2>
          <Typography variant="h6">
            Contact administrator for more information
          </Typography>
        </Grid2>
      </Grid2>
    </LSTVPageRootStyle>
  );
}
