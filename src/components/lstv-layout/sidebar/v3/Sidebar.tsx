import * as React from "react";
import {
  styled,
  createTheme,
  ThemeProvider,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import {
  ItemListFirst,
  ItemListSecond,
  ItemList3_1,
  ItemList3_2,
  ItemList3_3,
  ItemList3_4,
} from "./itemList";
import { use_MouseHandles } from "@/components/hooks/itemList";
import { use_Toggle } from "@/components/hooks/toggle";
import Backdrop from "@mui/material/Backdrop";
import { useAuthStore } from "@/store/useStore";
import { IconButton, Typography, useTheme } from "@mui/material";
import ArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useMinimizeDrawer } from "@/store/useDrawerStore";

interface DrawerProps {
  open2?: boolean;
  minimize?: boolean;
}

const scrollBarStyle = (theme: Theme) => ({
  "&::-webkit-scrollbar": {
    width: "4px", // Increase the width for better visibility of shadow effect
  },
  "&::-webkit-scrollbar-track": {
    background: "#F0F0F0", // Track color
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)", // Simulate shadow effect
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.grey[400], // Scrollbar thumb color
    borderRadius: "10px",
  },
});

const CtrlSlider = styled(IconButton)<DrawerProps>(
  ({ theme, open2, minimize }) => ({
    position: "fixed",
    top: 85,
    left: minimize ? 68 : 268,
    transform: "translateY(-50%)",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    zIndex: theme.zIndex.drawer + 3,
    width: 22,
    height: 22,
    transition: "left 0.3s ease, opacity 0.3s ease",
    display: open2 ? "none" : "content",
    "& .MuiIconButton-label": {
      fontSize: 20,
    },
  })
);

const Drawer1 = styled(MuiDrawer)<DrawerProps>(
  ({ theme, open2, minimize }) => ({
    "& .MuiDrawer-paper": {
      zIndex: theme.zIndex.drawer + 3,
      position: "fixed",
      overflowX: "hidden",
      marginTop: theme.spacing(7),
      height: `calc(100% - ${theme.spacing(7)})`,
      backgroundColor: open2 ? "#FFFFFF" : "rgb(244, 245, 247)",
      width: minimize ? theme.spacing(10) : theme.spacing(35),
      clipPath: minimize ? "inset(0 0 0 0)" : "none", // Adjust clipping as needed
      transition: "width 0.3s ease",
      flexDirection: "column",
      boxShadow: open2
        ? "none"
        : "rgba(0, 0, 1, 0.15) -0.5px 0px 6px 0px inset",
      ...scrollBarStyle(theme),
    },
  })
);

const Drawer2 = styled(MuiDrawer)<DrawerProps>(({ theme, minimize }) => ({
  zIndex: theme.zIndex.drawer + 2,
  "& .MuiDrawer-paper": {
    ...{
      position: "fixed",
      whiteSpace: "nowrap",
      overflowX: "hidden",
      width: theme.spacing(30),
      marginTop: theme.spacing(7),
      height: `calc(100% - ${theme.spacing(7)})`,
      marginLeft: minimize ? theme.spacing(10) : theme.spacing(35),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      ...scrollBarStyle(theme),
    },
  },
}));

const Drawer3 = styled(MuiDrawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  "& .MuiDrawer-paper": {
    position: "fixed",
    whiteSpace: "nowrap",
    overflowX: "hidden",
    marginTop: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)})`,
    ...scrollBarStyle(theme),
  },
}));

const Drawer3_1 = styled(Drawer3)<DrawerProps>(({ theme, minimize }) => ({
  "& .MuiDrawer-paper": {
    width: theme.spacing(36),
    marginLeft: minimize ? theme.spacing(40) : theme.spacing(65),
    marginTop: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)})`,
    ...scrollBarStyle(theme),
  },
}));

const Drawer3_2 = styled(Drawer3)<DrawerProps>(({ theme, minimize }) => ({
  "& .MuiDrawer-paper": {
    width: theme.spacing(36),
    marginLeft: minimize ? theme.spacing(76) : theme.spacing(101),
    marginTop: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)})`,
    ...scrollBarStyle(theme),
  },
}));

const Drawer3_3 = styled(Drawer3)<DrawerProps>(({ theme, minimize }) => ({
  "& .MuiDrawer-paper": {
    width: theme.spacing(36),
    marginLeft: minimize ? theme.spacing(112) : theme.spacing(137),
    marginTop: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)})`,
    ...scrollBarStyle(theme),
  },
}));

const Drawer3_4 = styled(Drawer3)<DrawerProps>(({ theme, minimize }) => ({
  "& .MuiDrawer-paper": {
    width: theme.spacing(36),
    marginLeft: minimize ? theme.spacing(148) : theme.spacing(173),
    marginTop: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)})`,
    ...scrollBarStyle(theme),
  },
}));

const defaultTheme = createTheme();

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { user } = useAuthStore();
  const { open2, setOpen2, toggleDrawer2, open3, setOpen3, toggleDrawer3 } =
    use_Toggle();
  const { items2, setItems2, items3, setItems3 } = use_MouseHandles();
  const { minimized, setMinimized } = useMinimizeDrawer();

  const drawerSlider = () => {
    setMinimized(!minimized);
  };

  const col1 = items3?.some(
    (data: any) =>
      data.mencol === "1" || data.mencol === null || data.mencol > 4
  );
  const col2 = items3?.some((data: any) => data.mencol === "2");
  const col3 = items3?.some((data: any) => data.mencol === "3");
  const col4 = items3?.some((data: any) => data.mencol === "4");

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CssBaseline />

        {/* Drawer 1 */}
        <div style={{ position: "relative" }}>
          <Drawer1
            variant="permanent"
            onClick={toggleDrawer3(false)}
            open2={open2}
            minimize={minimized}
          >
            <Toolbar
              sx={{
                p: 5,
                justifyContent: "center",
                display: minimized ? "none" : "content",
              }}
            >
              <Typography align="center" fontFamily="Poppins">
                Hi {user?.usrname}! Have a great day!
              </Typography>
            </Toolbar>
            <List component="nav">
              <ItemListFirst
                open={open2}
                setItems={setItems2}
                setOpen={setOpen2}
                minimize={minimized}
              />
            </List>
          </Drawer1>
          <CtrlSlider
            size="small"
            aria-label="toggle drawer"
            color="success"
            open2={open2}
            onClick={drawerSlider}
            minimize={minimized}
          >
            {minimized ? (
              <ArrowRight fontSize="inherit" />
            ) : (
              <ArrowLeft fontSize="inherit" />
            )}
          </CtrlSlider>
        </div>
        <Backdrop
          sx={{ zIndex: 2 }}
          onClick={() => setOpen2(false)}
          open={open2}
        />

        {/* Drawer 2 */}
        <Drawer2
          variant="persistent"
          open={open2}
          onClose={toggleDrawer2(false)}
          minimize={minimized}
        >
          <List component="nav">
            <ItemListSecond
              items={items2}
              open={open3}
              setItems={setItems3}
              setOpen={setOpen3}
            />
          </List>
        </Drawer2>

        {/* Drawer 3 */}
        <Backdrop
          sx={{ zIndex: 3 }}
          onClick={() => setOpen3(false)}
          open={open3}
        />
        <Drawer3_1
          variant="persistent"
          open={open3}
          onClose={toggleDrawer3(false)}
          hidden={!col2 && !col3 && !col4 && !col1}
          minimize={minimized}
        >
          <List sx={{ marginTop: 1 }} component="nav">
            <ItemList3_1 items={items3} />
          </List>
        </Drawer3_1>
        <Drawer3_2
          variant="persistent"
          open={open3}
          onClose={toggleDrawer3(false)}
          hidden={!col3 && !col4 && !col2}
          minimize={minimized}
        >
          <List sx={{ marginTop: 1 }} component="nav">
            <ItemList3_2 items={items3} />
          </List>
        </Drawer3_2>

        <Drawer3_3
          variant="persistent"
          open={open3}
          onClose={toggleDrawer3(false)}
          hidden={!col4 && !col3}
          minimize={minimized}
        >
          <List sx={{ marginTop: 1 }} component="nav">
            <ItemList3_3 items={items3} />
          </List>
        </Drawer3_3>
        <Drawer3_4
          variant="persistent"
          open={open3}
          onClose={toggleDrawer3(false)}
          hidden={!col4}
          minimize={minimized}
        >
          <List sx={{ marginTop: 1 }} component="nav">
            <ItemList3_4 items={items3} />
          </List>
        </Drawer3_4>
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
function useDrawerStore(): { minimze: any; setMinimized: any } {
  throw new Error("Function not implemented.");
}
