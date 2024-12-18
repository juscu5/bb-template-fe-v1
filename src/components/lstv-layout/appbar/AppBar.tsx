import React from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  alpha,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Height, Image } from "@mui/icons-material";
import { useAuthStore, useLogout } from "@/store/useStore";
import { LSTVGlobalDialog } from "@/components/lstv-dialog/LSTVDialog";
import AppsIcon from "@mui/icons-material/Apps";
import Settings from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import lstIcon from "../../../assets/lst.png";

export const NavBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 4,
  backgroundImage: "linear-gradient(to left, #98BFA2, #ffffff)",
  color: "inherit",
  height: theme.spacing(7),
  boxShadow: "none",
  borderBottom: "1px solid #ccc",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  "& .MuiToolbar-root": {
    minHeight: theme.spacing(7),
  },
  "& .MuiButtonBase-root": {
    minHeight: theme.spacing(2),
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  height: "50%",
  border: "1px solid #3C3D37",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  height: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    fontSize: 15,
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function AppBar() {
  const { user } = useAuthStore();
  const { logMeOut } = useLogout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean | null>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const buttonText = [
    {
      text: "Yes",
      color: "error",
      onClick: logMeOut,
    },
  ];

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Typography sx={{ padding: 1 }}>&ensp;{user?.usrname}</Typography>
      <MenuItem onClick={handleOpenDialog}>Log Out</MenuItem>
    </Menu>
  );

  return (
    <>
      <NavBar position="fixed">
        <Toolbar>
          <img
            src={lstIcon}
            alt="LSTV No 1"
            style={{
              width: "25px",
              height: "25px",
              marginRight: 15,
            }}
          />
          <Typography
            component="h1"
            variant="button"
            fontSize="20px"
            color="inherit"
            fontWeight={550}
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer", color: "#042500" }}
          >
            Lee System Technology Ventures
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Item"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <MenuItem sx={{ height: 56, pl: 1, pr: 1, ml: 1 }}>
            <Settings />
          </MenuItem>
          <MenuItem sx={{ height: 56, pl: 1, pr: 1 }}>
            <AppsIcon />
          </MenuItem>
          <MenuItem
            onClick={handleProfileMenuOpen}
            sx={{ height: 56, pl: 1, pr: 1 }}
          >
            <AccountCircle />
            &nbsp;
            <p> {user?.usrname}</p>
          </MenuItem>
        </Toolbar>
      </NavBar>
      {renderMenu}
      <LSTVGlobalDialog
        dialogOpen={dialogOpen!}
        setDialogOpen={setDialogOpen}
        title="Log Out"
        context="Do you want to logout?"
        buttonText={buttonText}
      />
    </>
  );
}
