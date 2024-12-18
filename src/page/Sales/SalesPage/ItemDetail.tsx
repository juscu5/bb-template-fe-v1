import { useEffect, useState, useMemo, useRef } from "react";
import {
  MRT_Table,
  type MRT_ColumnDef,
  type MRT_Cell,
  type MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Search } from "@mui/icons-material";
import { ItemsSearchDialog } from "./ItemsSearchDialog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ItemDetailProps {
  dialogType?: string;
  setGrandTotal?: (grandTotal: number) => void;
  setSalesItem?: (salesItem: any[] | []) => void;
  docNum?: string;
  setRemovedItem: (removedItem: any) => void;
  initializeItem?: boolean;
  setInitializeItem?: (initializeItem: boolean) => void;
}

const API_CON = (docNum?: string) => {
  const { account } = useAccountStore();
  const { data, refetch, isLoading, isFetching, isSuccess } = useQuery<any>(
    ["salesitem", docNum],
    async () =>
      await ApiService.get(`sales/salesitem/${docNum}`, {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  return {
    data,
    refetch,
    isLoading,
    isFetching,
    isSuccess,
  };
};

export const ItemDetail = ({
  dialogType,
  setGrandTotal,
  setSalesItem,
  docNum,
  setRemovedItem,
  initializeItem,
  setInitializeItem,
}: ItemDetailProps) => {
  const { data, refetch, isLoading, isSuccess, isFetching } = API_CON(docNum);
  const [tableData, setTableData] = useState<any[] | []>([]);
  const [isTableReady, setIsTableReady] = useState(false);
  const isTableInitializedRef = useRef(false);

  const [openSearchItem, setOpenSearchItem] = useState<boolean>(false);
  const [itemToAdd, setItemToAdd] = useState<any[] | []>([]);

  // #region load Data
  const sampleData = (isSuccess && data?.data?.payload) || [];

  const vatCodeOptions = [
    "None",
    "SAL VAT",
    "SJ VAT 10.02.21",
    "VAT 0 RATED",
    "VAT EXEMPT",
  ];
  const umOptions = ["None", "kg", "pcs", "liters"];
  const discountCodeOptions = ["None", "Diplomat", "SC20", "SC5"];
  // #endregion

  // #region initiate Data on TableState
  const mappedData = sampleData!.map((_: any, index: number) => {
    return {
      index: index + 1,
      dettype: _.dettype,
      itmcde: _.itmcde,
      itmdsc: _.itmdsc,
      taxcde: _.taxcde,
      itmqty: parseFloat(_.itmqty).toFixed(),
      untmea: _.untmea,
      groprc: parseFloat(_.groprc).toFixed(2),
      discountCode:
        _.discper === 10
          ? discountCodeOptions[1]
          : _.discper === 20
          ? discountCodeOptions[2]
          : _.discper === 5
          ? discountCodeOptions[3]
          : discountCodeOptions[0],
      discper: _.discper,
      discamt: parseFloat(_.discamt).toFixed(2),
      untprc: parseFloat(_.untprc).toFixed(2),
      extprc: parseFloat(_.extprc).toFixed(2),
      sonum: _.sonum,
      drnum: _.drnum,
      barcde: _.barcde,
    };
  });

  const emptyRow = Array.from({ length: 0 }, (_: any, index: number) => ({
    index: dialogType === "Edit" ? mappedData.length + index + 1 : index + 1,
    dettype: "",
    itmcde: "",
    itmdsc: "",
    taxcde: vatCodeOptions[0],
    itmqty: "",
    untmea: umOptions[0],
    groprc: "",
    discountCode: discountCodeOptions[0],
    discamt: "",
    untprc: "",
    extprc: "",
    sonum: "",
    drnum: "",
    barcde: "",
  }));

  useEffect(() => {
    console.log(initializeItem);
    if (isSuccess && data?.data?.payload) {
      if (!isTableInitializedRef.current) {
        setTableData(
          dialogType === "Edit" ? [...mappedData, ...emptyRow] : [...emptyRow]
        );
        setIsTableReady(initializeItem!);
        isTableInitializedRef.current = initializeItem!;
      }
    }
  }, [data, refetch]);

  useEffect(() => {
    const calculateTotalextprc = (data: any[]) => {
      return data.reduce((total, row) => {
        const extprc = parseFloat(row.extprc) || 0;
        return total + extprc;
      }, 0);
    };
    const totalextprc = calculateTotalextprc(tableData!);
    setGrandTotal?.(totalextprc.toFixed(2));
    setSalesItem?.(tableData);
  }, [data, tableData]);
  // #endregion

  // #region initiate Table Header from TableState
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "itemsInfo",
        header: "",
        size: 1000,
        muiTableBodyCellProps: {
          sx: {
            verticalAlign: "top",
            paddingTop: 2,
            borderBottom: "none",
          },
        },
        Cell: ({ row }: { row: MRT_Row<any> }) => (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              m: -0.5,
              borderRadius: 3,
              boxShadow:
                "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
            }}
          >
            <Grid container spacing={1} columns={24}>
              <Grid item xs={6} md={0.8} mt={0.7}>
                <Typography>{row.original.index}.</Typography>
              </Grid>
              <Grid item xs={6} md={18}>
                <Grid container spacing={1} columns={24} mb={1}>
                  <Grid item xs={6} md={1.3}>
                    <TextField
                      size="small"
                      label="I/C"
                      defaultValue={row.original.dettype ?? ""}
                      onBlur={(e) =>
                        handleChange(row.index, "dettype", e.target.value)
                      }
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      size="small"
                      label="Item No"
                      fullWidth
                      defaultValue={row.original.itmcde ?? ""}
                      onBlur={(e) =>
                        handleChange(row.index, "itmcde", e.target.value)
                      }
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <TextField
                      size="small"
                      label="Item Description"
                      fullWidth
                      defaultValue={row.original.itmdsc ?? ""}
                      onBlur={(e) =>
                        handleChange(row.index, "itmdsc", e.target.value)
                      }
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      type="text"
                      size="small"
                      label="Quantity"
                      fullWidth
                      value={row.original.itmqty ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleitmqty(row.index, "itmqty", e.target.value)
                      }
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 1,
                        },
                        inputMode: "numeric",
                        pattern: "^[0-9]*.?[0-9]{0,5}$",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      select
                      value={row.original.untmea as string}
                      onChange={(e) =>
                        handleChange(row.index, "untmea", e.target.value)
                      }
                      fullWidth
                      label="U/M"
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 0.8,
                        },
                      }}
                    >
                      {umOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <TextField
                      type="text"
                      size="small"
                      label="Selling Price"
                      fullWidth
                      value={row.original.groprc ?? ""}
                      onChange={(e: any) =>
                        handleSellingPrice(row.index, "groprc", e.target.value)
                      }
                      InputLabelProps={{ sx: { fontSize: 14 } }}
                      inputProps={{
                        sx: {
                          alignContent: "center",
                          fontSize: 14,
                          p: 1,
                        },
                        inputMode: "numeric",
                        pattern: "^[0-9]*.?[0-9]{0,5}$",
                      }}
                    />
                  </Grid>
                </Grid>
                <Box>
                  <Accordion variant="outlined" sx={{ border: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        flexDirection: "row-reverse",
                        ml: -2,
                        "&.Mui-expanded": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Typography variant="subtitle1">
                        &nbsp;&nbsp;&nbsp;Additional Information
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ ml: -2, pr: 5, mt: -3 }}>
                      <Grid container spacing={1} columns={8} mt={1}>
                        <Grid item xs={6} md={1}>
                          <TextField
                            select
                            label="Vat Code"
                            value={row.original.taxcde}
                            onChange={(e) =>
                              handleChange(row.index, "taxcde", e.target.value)
                            }
                            fullWidth
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                textAlign: "left",
                                fontSize: 14,
                                p: 0.8,
                              },
                            }}
                          >
                            {vatCodeOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TextField
                            select
                            size="small"
                            label="Discount Code"
                            value={row.original.discountCode}
                            onChange={(e) =>
                              handleDiscountCode(
                                row.index,
                                "discountCode",
                                e.target.value
                              )
                            }
                            fullWidth
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                textAlign: "left",
                                p: 0.8,
                              },
                            }}
                          >
                            {discountCodeOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            label="Discount Percent"
                            value={row.original.discper ?? "0"}
                            onChange={(e: any) =>
                              handleDiscountPercentage(
                                row.index,
                                "discper",
                                e.target.value
                              )
                            }
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                p: 1,
                              },
                              inputMode: "numeric",
                              pattern: "^[0-9]*.?[0-9]{0,5}$",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  sx={{ margin: -1 }}
                                  position="end"
                                >
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TextField
                            type="text"
                            size="small"
                            label="Discount Amount"
                            fullWidth
                            defaultValue={
                              row.original.discamt === ""
                                ? 0
                                : row.original.discamt
                            }
                            onChange={(e: any) =>
                              handleDiscountAmount(
                                row.index,
                                "discamt",
                                e.target.value
                              )
                            }
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                p: 1,
                              },
                              inputMode: "numeric",
                              pattern: "^[0-9]*.?[0-9]{0,5}$",
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} columns={6} mt={1}>
                        <Grid item xs={12} md={1}>
                          <TextField
                            size="small"
                            label="DR No."
                            defaultValue={row.original.drnum ?? ""}
                            fullWidth
                            onBlur={(e) =>
                              handleChange(row.index, "drnum", e.target.value)
                            }
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                p: 1,
                              },
                            }}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TextField
                            size="small"
                            label="SO No."
                            value={row.original.sonum ?? ""}
                            fullWidth
                            onBlur={(e) =>
                              handleChange(row.index, "sonum", e.target.value)
                            }
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            sx={{
                              color: "gray",
                            }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                p: 1,
                                color: "gray",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TextField
                            size="small"
                            label="IMEI"
                            value={row.original.barcde ?? ""}
                            onBlur={(e) =>
                              handleChange(row.index, "barcde", e.target.value)
                            }
                            fullWidth
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                            sx={{
                              color: "gray",
                            }}
                            inputProps={{
                              sx: {
                                alignContent: "center",
                                fontSize: 14,
                                p: 1,
                                color: "gray",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                md={5}
                textAlign="right"
                borderBottom="none"
                sx={{
                  verticalAlign: "top",
                }}
              >
                <Grid container spacing={1} columns={8}>
                  <Grid item xs={6} md={8}>
                    Net Price
                    <Box
                      style={{
                        height: "24px",
                        textAlign: "right",
                      }}
                    >
                      {row.original.untprc === ""
                        ? "0.00"
                        : row.original.untprc}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2">Total Amount</Typography>
                    <Box
                      style={{
                        height: "24px",
                        textAlign: "right",
                        fontSize: "16px",
                      }}
                    >
                      {row.original.extprc === ""
                        ? "0.00"
                        : row.original.extprc}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ),
      },
    ],
    []
  );
  // #endregion

  // #region initiate Table with Header
  const table = useMaterialReactTable({
    columns,
    data: tableData!,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableRowActions: true,
    enableTableHead: false,
    muiTableProps: {
      sx: {
        border: "none",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        padding: 2,
        marginTop: 1,
        borderBottom: "none",
      },
    },
    muiTablePaperProps: {
      sx: {
        border: "none",
      },
      elevation: 0,
    },
    muiTableBodyRowProps: {
      hover: false,
    },
    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <IconButton
          onClick={() => handleRemoveItem(row.original)}
          color="error"
          size="small"
          sx={{ m: -1 }}
        >
          <RemoveCircleIcon />
        </IconButton>
      </Box>
    ),
  });

  // #endregion

  // #region Handles Section
  // handle Add Row
  const handleAddRow = () => {
    setTableData((prevData: any) => {
      if (prevData.length >= 20) {
        enqueueSnackbar(
          "Can't add new item furthermore. Please setup the Maximum item on System Parameters.",
          {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
        return prevData;
      }

      const lastRow = prevData[prevData.length - 1];

      if (lastRow?.itmcde === "" || lastRow?.itmdsc === "") {
        enqueueSnackbar(
          "Please fill up the blank space first before adding new item.",
          {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
        return prevData;
      }

      return [
        ...prevData,
        {
          index: prevData.length + 1,
          dettype: "",
          itmcde: "",
          itmdsc: "",
          taxcde: vatCodeOptions[0],
          itmqty: "",
          untmea: umOptions[0],
          discountCode: discountCodeOptions[0],
          discamt: "",
          untprc: "",
          extprc: "",
          sonum: "",
          drnum: "",
          barcde: "",
        },
      ];
    });
  };

  // handle Delete Row
  const handleRemoveItem = (row: any) => {
    setRemovedItem((prev: any) => [...prev, row]);

    setTableData((prevData) =>
      prevData
        .filter((item: any) => item.index !== row.index)
        .map((item: any, newIndex: number) => ({
          ...item,
          index: newIndex + 1,
        }))
    );
  };

  // handle Change
  const handleChange = (rowIndex: number, columnId: string, value: any) => {
    setTableData((prevData) =>
      prevData.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  // handle itmqty
  const handleitmqty = (rowIndex: number, columnId: string, value: any) => {
    setTableData((prevData: any[]) =>
      prevData.map((row: any, index: number) => {
        const discper =
          row.discountCode === "Diplomat"
            ? 10
            : row.discountCode === "SC20"
            ? 20
            : row.discountCode === "SC5"
            ? 5
            : 0;
        const discamt = row.discamt === "" ? 0 : row.discamt;
        const untprc = row.groprc - (row.groprc * discper) / 100 - discamt;

        return index === rowIndex
          ? {
              ...row,
              [columnId]: value,
              untprc:
                value === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : untprc.toFixed(2),
              extprc:
                value === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : (untprc * value).toFixed(2),
            }
          : row;
      })
    );
  };

  // handles Selling Price
  const handleSellingPrice = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    setTableData((prevData: any[]) =>
      prevData.map((row: any, index: number) => {
        const discper =
          row.discountCode === "Diplomat"
            ? 10
            : row.discountCode === "SC20"
            ? 20
            : row.discountCode === "SC5"
            ? 5
            : 0;
        const discamt = row.discamt === "" ? 0 : row.discamt;
        const untprc = value - (value * discper) / 100 - discamt;
        return index === rowIndex
          ? {
              ...row,
              [columnId]: value,
              untprc:
                row.itmqty === "" &&
                value === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : untprc.toFixed(2),
              extprc:
                row.itmqty === "" &&
                value === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : (untprc * row.itmqty).toFixed(2),
            }
          : row;
      })
    );
  };

  // handles Discount Code
  const handleDiscountCode = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    const discper =
      value === "Diplomat"
        ? 10
        : value === "SC20"
        ? 20
        : value === "SC5"
        ? 5
        : 0;

    setTableData((prevData: any[]) =>
      prevData.map((row: any, index: number) => {
        const discamt = row.discamt === "" ? 0 : row.discamt;
        const untprc = row.groprc - (row.groprc * discper) / 100 - discamt;
        return index === rowIndex
          ? {
              ...row,
              [columnId]: value,
              discper: discper,
              untprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : untprc.toFixed(2),
              extprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                row.discamt === ""
                  ? ""
                  : (untprc * row.itmqty).toFixed(2),
            }
          : row;
      })
    );
  };

  // handle Discount Percentage
  const handleDiscountPercentage = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    setTableData((prevData: any[]) =>
      prevData.map((row: any, index: number) => {
        const discamt = row.discamt === "" ? 0 : row.discamt;
        const untprc = row.groprc - (row.groprc * value) / 100 - discamt;
        return index === rowIndex
          ? {
              ...row,
              [columnId]: value,
              untprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                value === "" &&
                row.discamt === ""
                  ? ""
                  : untprc.toFixed(2),
              extprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                value === "" &&
                row.discamt === ""
                  ? ""
                  : (untprc * row.itmqty).toFixed(2),
            }
          : row;
      })
    );
  };

  // handle Discount extprc
  const handleDiscountAmount = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    setTableData((prevData: any[]) =>
      prevData.map((row: any, index: number) => {
        const discper =
          row.discountCode === "Diplomat"
            ? 10
            : row.discountCode === "SC20"
            ? 20
            : row.discountCode === "SC5"
            ? 5
            : 0;

        const untprc = row.groprc - (row.groprc * discper) / 100 - value;
        return index === rowIndex
          ? {
              ...row,
              [columnId]: value,
              untprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                value === ""
                  ? ""
                  : untprc.toFixed(2),
              extprc:
                row.itmqty === "" &&
                row.groprc === "" &&
                row.discper === "" &&
                value === ""
                  ? ""
                  : (untprc * row.itmqty).toFixed(2),
            }
          : row;
      })
    );
  };

  // handle Add from Items (Item file Validated)
  const handleFromItemAdd = () => {
    setTableData((prevData: any) => {
      const mappedData = itemToAdd!.map((_: any, index: number) => {
        return {
          index: index + 1,
          dettype: _.dettype === undefined ? "" : _.dettype,
          itmcde: _.itmcde === undefined ? "" : _.itmcde,
          itmdsc: _.itmdsc === undefined ? "" : _.itmdsc,
          taxcde: _.taxcde === undefined ? "" : _.taxcde,
          itmqty: _.itmqty === undefined ? "" : parseFloat(_.itmqty).toFixed(),
          untmea: _.untmea === undefined ? "" : _.untmea,
          groprc: _.groprc === undefined ? "" : parseFloat(_.groprc).toFixed(2),
          discountCode:
            _.discper === 10
              ? discountCodeOptions[1]
              : _.discper === 20
              ? discountCodeOptions[2]
              : _.discper === 5
              ? discountCodeOptions[3]
              : discountCodeOptions[0],
          discper: _.discper === undefined ? "" : _.discper,
          discamt:
            _.discamt === undefined ? "" : parseFloat(_.discamt).toFixed(2),
          untprc: _.untprc === undefined ? "" : parseFloat(_.untprc).toFixed(2),
          extprc: _.extprc === undefined ? "" : parseFloat(_.extprc).toFixed(2),
          sonum: _.sonum === undefined ? "" : _.sonum,
          drnum: _.drnum === undefined ? "" : _.drnum,
          barcde: _.barcde === undefined ? "" : _.barcde,
        };
      });

      return [...prevData, ...mappedData];
    });
    setOpenSearchItem(false);
  };

  // #endregion

  return (
    <>
      <Box ml={-3} mr={-3}>
        {isLoading || isFetching ? (
          <div>Loading...</div>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{
                mb: 2,
                mr: 1,
              }}
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={handleAddRow}
            >
              New Item
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 2,
              }}
              startIcon={<Search />}
              onClick={() => setOpenSearchItem(true)}
            >
              Search Item
            </Button>
            {isTableReady && <MRT_Table table={table} />}
          </>
        )}
      </Box>
      <ItemsSearchDialog
        open={openSearchItem}
        setOpen={setOpenSearchItem}
        setItemToAdd={setItemToAdd}
        handleFromItemAdd={handleFromItemAdd}
      />
    </>
  );
};

export default ItemDetail;
