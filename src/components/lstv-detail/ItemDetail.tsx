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
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface ItemDetailProps {
  dialogType?: string;
  setGrandTotal?: (grandTotal: number) => void;
  setSalesItem?: (salesItem: any[] | []) => void;
  docNum?: string;
  setRemovedItem: (removedItem: any) => void;
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
}: ItemDetailProps) => {
  const { data, refetch, isLoading, isSuccess, isFetching } = API_CON(docNum);
  const [tableData, setTableData] = useState<any[] | []>([]);
  const [isTableReady, setIsTableReady] = useState(false);
  const isTableInitializedRef = useRef(false);

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
          : "",
      discper: _.discper,
      discamt: parseFloat(_.discamt).toFixed(2),
      untprc: parseFloat(_.untprc).toFixed(2),
      extprc: parseFloat(_.extprc).toFixed(2),
      sonum: _.sonum,
      drnum: _.drnum,
      barcde: _.barcde,
    };
  });

  const emptyRow = Array.from({ length: 1 }, (_: any, index: number) => ({
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
    if (isSuccess) {
      if (!isTableInitializedRef.current) {
        setTableData(
          dialogType === "Edit" ? [...mappedData, ...emptyRow] : [...emptyRow]
        );
        setIsTableReady(true);
        // Mark the table as initialized
        isTableInitializedRef.current = true;
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
  }, [data, tableData, refetch]);
  // #endregion

  // #region initiate Table Header from TableState
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "index",
        header: "",
        size: 50,
      },
      {
        accessorKey: "dettype",
        header: "I/C",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleChange(row.index, "dettype", e.target.innerText)
            }
            style={{
              height: "24px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
        size: 80,
      },
      ...[
        { key: "itmcde", label: "Item Number" },
        { key: "itmdsc", label: "Item Description" },
      ].map(({ key, label }) => ({
        accessorKey: key,
        header: label,
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleChange(row.index, key, e.target.innerText)}
            style={{
              height: "24px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
      })),
      {
        accessorKey: "taxcde",
        header: "Vat Code",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Select
            value={cell.getValue() as string}
            onChange={(e) => handleChange(row.index, "taxcde", e.target.value)}
            fullWidth
            sx={{ height: "24px" }}
            inputProps={{
              sx: {
                fontSize: 14,
              },
            }}
          >
            {vatCodeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        accessorKey: "itmqty",
        header: "Item Quantity",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <TextField
            type="text"
            size="small"
            value={cell.getValue<string>() ?? ""}
            onChange={(e: any) =>
              handleitmqty(row.index, "itmqty", e.target.value)
            }
            inputProps={{
              sx: {
                height: 7,
                alignContent: "center",
                fontSize: 14,
                p: 1,
              },
              inputMode: "numeric",
              pattern: "^[0-9]*.?[0-9]{0,5}$",
            }}
          />
        ),
        size: 100,
      },
      {
        accessorKey: "untmea",
        header: "U/M",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Select
            value={cell.getValue() as string}
            onChange={(e) => handleChange(row.index, "untmea", e.target.value)}
            fullWidth
            sx={{ height: "24px" }}
            inputProps={{
              sx: {
                fontSize: 14,
              },
            }}
          >
            {umOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ),
        size: 100,
      },
      {
        accessorKey: "groprc",
        header: "Selling Price",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <TextField
            type="text"
            size="small"
            value={cell.getValue<string>() ?? ""}
            onChange={(e: any) =>
              handleSellingPrice(row.index, "groprc", e.target.value)
            }
            inputProps={{
              sx: {
                height: 7,
                alignContent: "center",
                fontSize: 14,
                p: 1,
                textAlign: "right",
              },
              inputMode: "numeric",
              pattern: "^[0-9]*.?[0-9]{0,5}$",
            }}
          />
        ),
      },
      {
        accessorKey: "discountCode",
        header: "Discount Code",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Select
            value={cell.getValue() as string}
            onChange={(e) =>
              handleDiscountCode(row.index, "discountCode", e.target.value)
            }
            fullWidth
            sx={{ height: "24px" }}
            inputProps={{
              sx: {
                fontSize: 14,
              },
            }}
          >
            {discountCodeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ),
        size: 130,
      },
      {
        accessorKey: "discper",
        header: "Discount Percentage",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <TextField
            type="text"
            size="small"
            value={cell.getValue<string>() ?? ""}
            onChange={(e: any) =>
              handleDiscountPercentage(row.index, "discper", e.target.value)
            }
            inputProps={{
              sx: {
                height: 7,
                alignContent: "center",
                fontSize: 14,
                p: 1,
                textAlign: "center",
              },
              inputMode: "numeric",
              pattern: "^[0-9]*.?[0-9]{0,5}$",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ margin: -1 }} position="end">
                  %
                </InputAdornment>
              ),
            }}
          />
        ),
        size: 120,
      },
      {
        accessorKey: "discamt",
        header: "Discount Amount",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <TextField
            type="text"
            size="small"
            value={cell.getValue<string>() ?? ""}
            onChange={(e: any) =>
              handleDiscountAmount(row.index, "discamt", e.target.value)
            }
            inputProps={{
              sx: {
                height: 7,
                alignContent: "center",
                fontSize: 14,
                p: 1,
                textAlign: "right",
              },
              inputMode: "numeric",
              pattern: "^[0-9]*.?[0-9]{0,5}$",
            }}
          />
        ),
        size: 150,
      },
      {
        accessorKey: "untprc",
        header: "Net Price",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            style={{
              height: "24px",
              textAlign: "right",
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
        size: 120,
      },
      {
        accessorKey: "extprc",
        header: "Amount",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            style={{
              height: "24px",
              textAlign: "right",
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
      },
      {
        accessorKey: "sonum",
        header: "SO No.",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            style={{
              height: "24px",
              textAlign: "center",
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
      },
      {
        accessorKey: "drnum",
        header: "DR No.",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleChange(row.index, "drnum", e.target.innerText)}
            style={{
              height: "24px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
      },
      {
        accessorKey: "barcde",
        header: "IMEI",
        Cell: ({ cell, row }: { cell: MRT_Cell<any>; row: MRT_Row<any> }) => (
          <Box
            onBlur={(e: any) =>
              handleChange(row.index, "barcde", e.target.innerText)
            }
            style={{
              height: "24px",
              textAlign: "center",
            }}
          >
            {cell.getValue<string>() ?? ""}
          </Box>
        ),
        size: 100,
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
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        fontStyle: "italic",
        fontWeight: "normal",
        padding: "4px",
        align: "center",
        border: "1px solid rgba(81, 81, 81, .4)",
        ...(column.id === "mrt-row-actions" && {
          border: "1px solid rgba(81, 81, 81, .4)",
          fontStyle: {
            color: "#fff",
            cursor: "default",
          },
        }),
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        padding: "4px",
        border: "1px solid rgba(81, 81, 81, .4)",
      },
    },
    muiTablePaperProps: {
      sx: {
        border: "none",
      },
      elevation: 0,
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
  // #endregion

  return (
    <>
      {isLoading || isFetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <Button
            variant="contained"
            sx={{
              mb: "1rem",
              backgroundColor: "blue",
              "&:hover": {
                backgroundColor: "darkblue",
              },
            }}
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={handleAddRow}
          >
            New Item
          </Button>
          {isTableReady && <MRT_Table table={table} />}
        </>
      )}
    </>
  );
};

export default ItemDetail;
