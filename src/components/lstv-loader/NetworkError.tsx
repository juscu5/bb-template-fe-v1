import { useNetworkError } from "@/store/useStore";
import { Backdrop, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const NetworkError = () => {
  const { isError } = useNetworkError();

  if (isError === true) {
    enqueueSnackbar(`Network Error: No internet or can't connect to server`, {
      preventDuplicate: true,
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  }

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 5 }}
      open={isError}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default NetworkError;
