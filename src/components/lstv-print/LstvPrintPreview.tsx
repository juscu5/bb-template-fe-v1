import React, { forwardRef, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { HeaderLabel2 } from "@/models";
import dayjs from "dayjs";

const PrintStyle = styled("div")({
  display: "flex",
  width: "100%",
  height: "100%",
  padding: "20px",
  flexDirection: "column",
});

interface LstvPrintPreviewProps {
  lstvHead: HeaderLabel2[];
  tableData: any[];
  printTitle: string;
}

export const LstvPrintPreview = forwardRef<
  HTMLDivElement,
  LstvPrintPreviewProps
>(({ lstvHead, tableData, printTitle }, ref) => {
  const dateToday = dayjs(new Date()).format("LL");

  return (
    <PrintStyle ref={ref}>
      <Typography variant="h5" fontWeight="bold">
        {printTitle}
      </Typography>
      <hr />
      {/* <Typography variant="h6" fontWeight="bold">
        Sales Register By Date (SUMMARIZED VAT)
      </Typography> */}
      {/* <Typography variant="body1">Doc. No.: ___ to ___</Typography>
      <Typography variant="body1">Date From: __-__-____ to DATE</Typography> */}
      <Typography variant="body1">Date Printed: {dateToday}</Typography>
      <Divider />
      <TableContainer component={Box}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {lstvHead.map((el: any, index: number) =>
                index !== 0 ? (
                  <TableCell key={index} align="right">
                    <Typography fontWeight="bold">{el.header}</Typography>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Typography fontWeight="bold">{el.header}</Typography>
                  </TableCell>
                )
              )}
              {/* <TableCell><Typography fontWeight="bold">Dessert (100g serving)</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Calories</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Fat&nbsp;(g)</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Carbs&nbsp;(g)</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Protein&nbsp;(g)</Typography></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  height: "5px",
                }}
              >
                {lstvHead.map((el: any, index: number) =>
                  index !== 0 ? (
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      }}
                    >
                      {row[el.id]}
                    </TableCell>
                  ) : (
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        borderBottom: "none",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      }}
                    >
                      {row[el.id]}
                    </TableCell>
                  )
                )}
                {/* <TableCell component="th" scope="row" sx={{ borderBottom: 'none', paddingTop: '4px', paddingBottom: '4px' }}>
                  {row.name}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', paddingTop: '4px', paddingBottom: '4px' }}>{row.calories}</TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', paddingTop: '4px', paddingBottom: '4px' }}>{row.fat}</TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', paddingTop: '4px', paddingBottom: '4px' }}>{row.carbs}</TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', paddingTop: '4px', paddingBottom: '4px' }}>{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PrintStyle>
  );
});

export default LstvPrintPreview;
