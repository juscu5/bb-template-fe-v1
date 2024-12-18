import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import Loading from "./components/lstv-loader/Loading";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Corrected imports
import "@fontsource/poppins"; // Ensure Poppins font is loaded

const queryClient = new QueryClient();
const nonce = document.querySelector("style[nonce]")?.getAttribute("nonce");

const cache = createCache({
  key: "css",
  nonce: nonce || undefined,
});

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider dense maxSnack={3}>
            <Suspense fallback={<Loading />}>
              <RouterProvider router={AppRoutes} />
            </Suspense>
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
