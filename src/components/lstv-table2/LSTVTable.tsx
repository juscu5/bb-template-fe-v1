import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  type MRT_ColumnDef,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Box,
  Stack,
  ListItemIcon,
  MenuItem,
  Button,
  Container,
  Typography,
  ListItemText,
  Paper,
} from "@mui/material";
import { ActionMenu, HeaderLabel2, TableSettings } from "@/models";
import { LSTVHead } from "./LSTVHead";
import LSTVMaxRec from "../lstv-syspar/LSTVMaxRec";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import { LstvPrintModal } from "../lstv-print/LstvPrintModal";
import { useHandles } from "@/store/useCallbackStore";
import { LstvPrint } from "../lstv-print/LstvPrint";
import PinIcon from "@mui/icons-material/Pin"; // Assuming you have an icon for pinning
import UnpinIcon from "@mui/icons-material/Pin";
import LSTVPageTitle from "../lstv-layout/title/LSTVPageTitle";
import { useGeneratePDF } from "@/page/Sales/Reports/hooks/useGeneratePDF";
import { usePdfPrint } from "../lstv-print/usePdfPrint";

// #region Interface
export interface LSTVTableProps<T> {
  title: string;
  placeholder: string;
  tableHead: HeaderLabel2[];
  tableData: T[];
  actionMenu: ActionMenu[];
  tableSettings: TableSettings[];
  actionDialog?: () => JSX.Element;
  refetch?: () => void;
}
// #endregion

// #region Theme
const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#597445",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#597445",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});
// #endregion

export const LSTVTable2 = <T extends any[]>({
  title,
  placeholder,
  tableHead,
  tableData,
  actionMenu,
  tableSettings,
  actionDialog,
  refetch,
}: LSTVTableProps<T>): JSX.Element => {
  // #region Hooks
  const { handleShowDialog } = useHandles();
  // #endregion

  // #region Table Data
  const data = tableData;
  const columns = LSTVHead(tableHead);
  // #endregion

  // #region Table Settings
  const stripeColor = tableSettings?.[0].stripeColor;
  const addButton = tableSettings?.[0].addButton;
  const sysParam = tableSettings?.[0].sysParam;
  const printButton = tableSettings?.[0].printButton;
  const columnAction = tableSettings?.[0].columnAction;
  const columnOrdering = tableSettings?.[0].columnOrdering;
  const columnPinning = tableSettings?.[0].columnPinning;
  // #endregion

  // #region Table
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilters: false,
    enableColumnActions: columnAction || false, //column action
    enableColumnOrdering: columnOrdering || false, //ordering
    enableColumnPinning: columnPinning || false, //pinning
    enableColumnVirtualization: false,
    enablePagination: true,
    enableSorting: true,
    enableRowActions: true,
    enableRowSelection: false,
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: stripeColor,
          fontFamily: "Poppins",
        },
      },
    },
    // muiTableBodyCellProps: {
    //   sx: {
    //     borderRight: "2px solid #e0e0e0", //add a border between columns
    //   },
    // },
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      density: title === "User Activity Log" ? "compact" : "comfortable",
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
      placeholder,
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: title === "User Activity Log" ? "400px" : "600px", // Set a maximum height for the table container
        overflowY: "auto", // Enable vertical scrollbar if needed
        overflowX: "auto", // Enable horizontal scrollbar if needed
      },
    },
    muiTablePaperProps: {
      sx: {
        borderRadius: 3,
      },
      elevation: 3,
    },

    //callback logic
    renderRowActionMenuItems: ({ row }) =>
      actionMenu.map((menuItem, idx) => (
        <MenuItem
          key={idx}
          sx={{ color: "text.secondary" }}
          onClick={() => menuItem.callback!(menuItem.type, row.original)}
        >
          <ListItemIcon>
            <Icon icon={menuItem.icon} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography fontFamily="Poppins" variant="subtitle2">
                {menuItem.label}
              </Typography>
            }
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      )),
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={() => ({
            backgroundColor: theme.palette.primary.main,
            display: "flex",
            gap: "0.5rem",
            p: 1,
            justifyContent: "space-between",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          })}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              borderRadius: 1,
            }}
          >
            <MRT_GlobalFilterTextField
              table={table}
              style={{
                height: 32,
                padding: 1,
                backgroundColor: "whitesmoke",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
              InputProps={{
                style: {
                  height: "100%",
                  fontSize: "16px",
                },
              }}
            />
          </Box>
        </Box>
      );
    },
  });
  // #endregion

  const orientation = "landscape";

  const generatePdf = usePdfPrint(tableData, tableHead, orientation);

  // #region TitleElement
  const element = (
    <>
      {addButton && (
        <Button
          color="success"
          onClick={() => {
            handleShowDialog!("Add", []);
          }}
          variant="outlined"
          size="small"
          component={RouterLink}
          to="#"
          startIcon={<Icon icon={plusFill} />}
          sx={{ marginLeft: "3px" }}
        >
          Add
        </Button>
      )}
      {printButton && (
        <LstvPrint
          tableData={tableData}
          lstvHead={tableHead}
          printTitle={title}
        />
      )}
      <Button
        color="success"
        // onClick={() => {
        //   handleShowDialog!("Add", []);
        // }}
        onClick={generatePdf}
        size="small"
        variant="contained"
        component={RouterLink}
        to="#"
        startIcon={<Icon icon={plusFill} />}
        sx={{ marginRight: "3px" }}
      >
        Print2
      </Button>
    </>
  );

  // #endregion
  return (
    <>
      <Box title={title}>
        <Container maxWidth={false}>
          <LSTVPageTitle title={title} element={element} />
          {sysParam && (
            <>
              <Stack mb={1} />
              <Divider>{title} Parameters</Divider>
              <Stack mb={1} />
              <Grid container spacing={1}>
                <Grid xs={15}>
                  <LSTVMaxRec refetch1={() => refetch?.()} />
                </Grid>
              </Grid>
            </>
          )}
          {!sysParam && (
            <>
              <Stack mb={1} />
              <Divider>{title}</Divider>
            </>
          )}
          <Stack mb={1} />
          <Box
            component="form"
            sx={{
              overflow: "auto",
              width: "100%",
              display: "table",
              tableLayout: "fixed",
            }}
          >
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
                {actionDialog?.()}
              </LocalizationProvider>
            </ThemeProvider>
          </Box>
        </Container>
      </Box>
    </>
  );
};
