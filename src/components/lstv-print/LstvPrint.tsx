import React from "react";
import { LstvPrintModal } from "./LstvPrintModal";
import { use_LstvPrintModal } from "../hooks/lstvPrint";
import { LstvPrintProps } from "../../models/print";
import { HeaderLabel2 } from "@/models";

export const LstvPrint: React.FC<LstvPrintProps> = ({
  tableData,
  lstvHead,
  printTitle,
}) => {
  const {
    open,
    handleClickOpen,
    handleClose,
    handlePrintOnClick,
    componentRef,
    handleSavePDFOnClick,
  } = use_LstvPrintModal();

  const checkCndn = lstvHead.filter((item: any) => item.type === "cndn");
  const checkAmount = lstvHead.filter((item: any) => item.type === "monetary");

  const data = tableData.map(
    (data: any) =>
      data.hasOwnProperty(checkCndn[0]?.id) ||
      data.hasOwnProperty(checkAmount[0]?.id)
        ? {
            ...data,
            [checkCndn[0]?.id]:
              checkCndn[0]?.cndntype === 1
                ? data[checkCndn[0]?.id] === 0
                  ? "False"
                  : "True"
                : checkCndn[0]?.cndntype === 2
                ? data[checkCndn[0]?.id] === 0
                  ? "No"
                  : "Yes"
                : checkCndn[0]?.cndntype === 3
                ? data[checkCndn[0]?.id] === 0
                  ? "Cancelled"
                  : "Not Cancelled"
                : data[checkCndn[0]?.id] === 0
                ? "False"
                : "True",
            [checkAmount[0]?.id]: parseFloat(data[checkAmount[0]?.id]).toFixed(
              2
            ),
          }
        : data,
    {
      [checkAmount[0]?.id]: "test",
    }
  );

  // console.log(data);

  // If you want custom header for other components
  // Create condition using printTitle like this
  //
  // let printHeader: HeaderLabel2[] = [];
  // if (printTitle === "User File") {
  //   printHeader = [
  //     {
  //       ...lstvHead[0],
  //     },
  //     ...other items you want to add
  //   ];
  // } else {
  //   printHeader = [
  //     ...declare global printHeader
  //   ]
  // }

  const printHeader: HeaderLabel2[] = [
    {
      ...lstvHead[1],
    },
    {
      ...lstvHead[2],
    },
    {
      ...lstvHead[3],
    },
    {
      ...lstvHead[4],
    },
    {
      ...lstvHead[5],
    },
  ];

  return (
    <LstvPrintModal
      tableData={data}
      lstvHead={printHeader}
      printTitle={printTitle}
      open={open}
      handleClickOpen={handleClickOpen}
      handleClose={handleClose}
      handlePrintOnClick={handlePrintOnClick}
      componentRef={componentRef}
      handleSavePDFOnClick={handleSavePDFOnClick}
    />
  );
};
