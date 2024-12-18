import { Icon } from "@iconify/react";
import React, { useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
} from "@mui/material";

import SearchNotFound from "@/components/SearchNotFound";
import { LSTVToolbar } from "./LSTVToolbar";
import { use_LSTVTableHooks } from "@/components/hooks/lstvTable";
import { LSTVHead } from "./LSTVHead";
import { LSTVDynamicMenu } from "./LSTVDynamicMenu";
import { ActionElement, FormElement, HeaderLabel } from "@/models";
import { LstvPrintModal } from "../lstv-print/LstvPrintModal";

interface LSTVTableProps<T> {
  title: string;
  placeholder: string;
  tableHead: HeaderLabel[];
  tableData: T[];
  actionElements: ActionElement[];
  formElements: FormElement[];
  dialogContent: string;
  dialogTitle: string;
  addCallback: (event: React.FormEvent<HTMLFormElement>) => void;
  enablePrinting?: boolean;
}

export const LSTVTable = <T,>({
  title,
  placeholder,
  tableHead,
  tableData,
  actionElements,
  formElements,
  dialogContent,
  dialogTitle,
  addCallback,
  enablePrinting,
}: LSTVTableProps<T>): JSX.Element => {
  // const {title, placeholder, tableHead, tableData} = props;
  const {
    selected,
    filterName,
    handleFilterByName,
    order,
    orderBy,
    handleRequestSort,
    handleSelectAllClick,
    filteredData,
    page,
    rowsPerPage,
    handleClick,
    emptyRows,
    isDataNotFound,
    handleChangeRowsPerPage,
    handleChangePage,
  } = use_LSTVTableHooks(tableData);

  const [open, setOpen] = useState(false);

  return (
    <Box title={title}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>

          <Stack
            direction="row-reverse"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Button
              sx={{ marginLeft: "3px" }}
              onClick={() => {
                setOpen(!open);
              }}
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
            >
              New {title}
            </Button>
            {/* <LstvPrintModal /> */}
          </Stack>
        </Stack>

        <Card>
          <LSTVToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder={placeholder}
          />

          <Box
            sx={{
              overflow: "auto",
              width: "100%",
              display: "table",
              tableLayout: "fixed",
            }}
          >
            <TableContainer sx={{ width: `100%` }}>
              <Table>
                <LSTVHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={tableHead}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => {
                      const { recid, usrname } = row;
                      const isItemSelected = selected.indexOf(usrname) !== -1;

                      return (
                        <TableRow
                          hover
                          key={recid}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, usrname)}
                            />
                          </TableCell>
                          {tableHead.map((data: any) => (
                            <TableCell align="left">{row[data.id]}</TableCell>
                          ))}

                          {/* <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Avatar alt={name} src={avatarUrl} />
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{company}</TableCell>
                                                    <TableCell align="left">{role}</TableCell>
                                                    <TableCell align="left">
                                                        {isVerified ? 'Yes' : 'No'}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Label
                                                            variant="ghost"
                                                            color={
                                                                (status === 'banned' && 'error') ||
                                                                'success'
                                                            }
                                                        >
                                                            {status}
                                                        </Label>
                                                    </TableCell> */}

                          <TableCell align="right">
                            <LSTVDynamicMenu
                              actionElements={actionElements}
                              row={row}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isDataNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {/* <LSTVDialogForm open={open} setOpen={(isOpen: boolean) => setOpen(isOpen)} formElements={formElements} dialogContent={dialogContent} dialogTitle={dialogTitle} addCallback={addCallback}/> */}
    </Box>
  );
};
