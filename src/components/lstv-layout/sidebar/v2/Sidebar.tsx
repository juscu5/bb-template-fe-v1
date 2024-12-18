import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { ItemListFirst, ItemListSecond } from "./itemList";
import { use_MouseHandles } from "@/components/hooks/itemList";
import { use_Toggle } from "@/components/hooks/toggle";

const Drawer1 = styled(MuiDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    zIndex: theme.zIndex.drawer + 3,
    ...{
      position: "fixed",
      whiteSpace: "nowrap",
      overflowX: "hidden",
      width: theme.spacing(13),
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(15),
      },
    },
  },
}));

const Drawer2 = styled(MuiDrawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 2,
  "& .MuiDrawer-paper": {
    ...{
      position: "fixed",
      whiteSpace: "nowrap",
      overflowX: "hidden",
      width: theme.spacing(45),
      marginLeft: theme.spacing(13),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(45),
        marginLeft: theme.spacing(15),
      },
    },
  },
}));

const defaultTheme = createTheme();

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { open2, setOpen2, toggleDrawer2 } = use_Toggle();
  const { items2, setItems2 } = use_MouseHandles();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CssBaseline />
        <Drawer1 variant="permanent" open={open2}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          ></Toolbar>
          <Divider />
          <List component="nav">
            <ItemListFirst setItems={setItems2} setOpen={setOpen2} />
            {/* {DrawerList} */}
          </List>
        </Drawer1>
        <Drawer2 open={open2} onClose={toggleDrawer2(false)}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          />
          <Divider />
          <List component="nav">
            <ItemListSecond items={items2} />
            {/* {DrawerList2} */}
          </List>
        </Drawer2>
        <Box sx={{ height: "100%", width: "100%" }}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          ></Toolbar>
          <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
