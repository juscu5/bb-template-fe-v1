import { HeaderLabel2 } from "@/models";
import { MRT_ColumnDef } from "material-react-table"; // Assuming `Cell` is imported from material-react-table
import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { MRT_RowData } from "material-react-table";
import dayjs from "dayjs";

interface Cell<T, V> {
  getValue(): V | undefined;
}

export const LSTVHead = <T extends any[]>(tableHead: HeaderLabel2[]) => {
  const columns = useMemo<MRT_ColumnDef<T>[]>(() => {
    const head: MRT_ColumnDef<T>[] = tableHead.map((col) => {
      let accessory: any = {};

      if (col.type === "text") {
        accessory = {
          accessorKey: col.id,
          muiTableHeadCellProps: {
            align: col.align,
          },
          muiTableBodyCellProps: {
            align: col.align,
          },
          muiTableFooterCellProps: {
            align: "left",
          },
          Cell: ({ renderedCellValue }: { renderedCellValue: string }) => (
            <Box>
              <span>{renderedCellValue}</span>
            </Box>
          ),
        };
      } else if (col.type === "cndn") {
        accessory = {
          accessorKey: col.id,
          muiTableHeadCellProps: {
            align: col.align,
          },
          muiTableBodyCellProps: {
            align: col.align,
          },
          muiTableFooterCellProps: {
            align: "left",
          },
          Cell: ({
            renderedCellValue,
          }: {
            renderedCellValue: number | string;
          }) => (
            <Box>
              <span>
                {col.cndntype === 1
                  ? renderedCellValue === 0
                    ? "False"
                    : "True"
                  : col.cndntype === 2
                  ? renderedCellValue === 0
                    ? "No"
                    : "Yes"
                  : col.cndntype === 3
                  ? renderedCellValue === 0
                    ? "Cancelled"
                    : "Not Cancelled"
                  : renderedCellValue === 0
                  ? "False"
                  : "True"}
              </span>
            </Box>
          ),
        };
      } else if (col.type === "date") {
        accessory = {
          muiTableHeadCellProps: {
            align: col.align,
          },
          muiTableBodyCellProps: {
            align: col.align,
          },
          muiTableFooterCellProps: {
            align: "left",
          },
          accessorFn: (row: T) => {
            const dateValue = (row as any)[col.id];
            return dateValue ? dayjs(dateValue).format(col.format) : "";
          },
          Cell: ({ cell }: { cell: Cell<T, string> }) => {
            const dateValue = cell.getValue();
            return dateValue ? dayjs(dateValue).format(col.format) : "";
          },
        };
      } else if (col.type === "monetary") {
        accessory = {
          accessorKey: col.id,
          muiTableHeadCellProps: {
            align: col.align,
          },
          muiTableBodyCellProps: {
            align: col.align,
          },
          muiTableFooterCellProps: {
            align: "left",
          },
          Cell: ({ cell }: { cell: Cell<T, string> }) => {
            const value = parseFloat(cell.getValue()!);
            return (
              <Box component="span">
                {value.toLocaleString("en-US", {
                  style: col.currency === "" ? "decimal" : "currency",
                  currency: col.currency === "" ? "PHP" : col.currency,
                  minimumFractionDigits: col.decimalCnt,
                  maximumFractionDigits: col.decimalCnt,
                })}
              </Box>
            );
          },
        };
      } else if (col.type === "number") {
        accessory = {
          accessorKey: col.id,
          muiTableHeadCellProps: {
            align: col.align,
          },
          muiTableBodyCellProps: {
            align: col.align,
          },
          muiTableFooterCellProps: {
            align: "left",
          },
          Cell: ({ cell }: { cell: Cell<T, number> }) => (
            <Box>{cell.getValue()}</Box>
          ),
        };
      }

      return {
        id: col.id,
        header: col.header,
        size: col.size,
        enableColumnFilter: false,
        ...accessory,
      };
    });

    return head;
  }, [tableHead]);

  return columns;
};
