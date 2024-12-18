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
import LSTVPageTitle from "../lstv-layout/title/LSTVPageTitle2";
import { usePdfPrint } from "../lstv-print/usePdfPrint";
import PrintIcon from "@mui/icons-material/Print";
import { useEffect } from "react";

// #region Interface
export interface LSTVTableProps<T> {
  title?: string;
  placeholder?: string;
  tableHead?: HeaderLabel2[];
  tableData?: T[];
  actionMenu?: ActionMenu[];
  tableSettings?: TableSettings[];
  actionDialog?: () => JSX.Element;
  refetch?: () => void;
  enableTitle?: boolean;
  enableCheckbox?: boolean;
  setItemToAdd?: (itemToAdd: any[]) => void;
  enableActionsMenu?: boolean;
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

export const LSTVTable3 = <T extends any[]>({
  title,
  placeholder,
  tableHead,
  tableData,
  actionMenu,
  tableSettings,
  actionDialog,
  refetch,
  enableTitle,
  enableCheckbox,
  setItemToAdd,
  enableActionsMenu,
}: LSTVTableProps<T>): JSX.Element => {
  // #region Hooks
  const { handleShowDialog } = useHandles();
  // #endregion

  // #region Table Data
  const data = tableData;
  const columns = LSTVHead(tableHead!);
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
    data: data!,
    enableColumnFilters: false,
    enableColumnActions: columnAction || false, //column action
    enableColumnOrdering: columnOrdering || false, //ordering
    enableColumnPinning: columnPinning || false, //pinning
    enableColumnVirtualization: false,
    enablePagination: true,
    enableSorting: true,
    enableRowActions: enableActionsMenu === false ? false : true,
    enableRowSelection: enableCheckbox ? enableCheckbox : false,
    muiTableBodyProps: {
      sx: {
        borderRadius: "3000px",
        //stripe the rows, make odd rows a darker color
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: stripeColor,
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        paddingTop: "9px",
        borderBottom: "1px solid #ccc",
        borderTop: "1px solid #ccc",
        '&[data-pinned="true"]::before': {
          backgroundColor: "#fff!important",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "none",
        '&[data-pinned="true"]::before': {
          backgroundColor: "#fff!important", // Ensure background is fully opaque
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        borderTop: "1px solid #ccc",
        boxShadow: "none",
      },
    },
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
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
      placeholder,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 30],
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
        border: "none",
      },
      elevation: 0,
    },

    //callback logic
    renderRowActionMenuItems: ({ row }) =>
      actionMenu!.map((menuItem, idx) => (
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
      return <MRT_GlobalFilterTextField sx={{ mb: 2 }} table={table} />;
    },
  });
  // #endregion

  const orientation = "landscape";
  const generatePdf = usePdfPrint(tableData, tableHead!, orientation);

  // #region TitleElement
  const element = (
    <>
      {addButton && (
        <Button
          color="success"
          onClick={() => {
            handleShowDialog!("Add", []);
          }}
          size="small"
          variant="outlined"
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
          tableData={tableData!}
          lstvHead={tableHead!}
          printTitle={title!}
        />
      )}
      <Button
        color="success"
        // onClick={() => {
        //   handleShowDialog!("Add", []);
        // }}
        onClick={generatePdf}
        variant="outlined"
        size="small"
        component={RouterLink}
        to="#"
        startIcon={<PrintIcon />}
        sx={{ marginRight: "3px" }}
      >
        Print2
      </Button>
    </>
  );
  // #endregion

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);
  useEffect(() => {
    if (setItemToAdd) {
      setItemToAdd(selectedData);
    }
  }, [selectedData, setItemToAdd]);


  return (
    <>
      <Box title={title}>
        <Container maxWidth={false}>
          {enableTitle === undefined || enableTitle === null ? (
            <LSTVPageTitle title={title!} element={element} />
          ) : (
            <></>
          )}
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
            </>
          )}
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
