import { Checkbox, Divider, Paper, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import TextField from "@mui/material/TextField";
import { setSysPar } from "@/store/useSysparStore";
import React, { HtmlHTMLAttributes, useEffect } from "react";
import { use_SystemParam } from "../hooks/lstvSysparam";

interface content {
  id: any;
  name: string;
  value?: any;
  checkId?: string;
  checked?: boolean;
}

// #region Setting up data coming from the database
const setColumn = () => {
  const { data } = use_SystemParam();
  const sysParam = data?.data?.payload[0];

  // all comments are also actual data
  return [
    {
      id: "saldocnum",
      name: "Sales",
      value: sysParam?.saldocnum,
      checkId: "chksaldocnum",
      checked: sysParam?.chksaldocnum === 1 ? true : false,
    },
    {
      id: "sodocnum",
      name: "Sales Order",
      value: sysParam?.sodocnum,
      checkId: "chksodocnum",
      checked: sysParam?.chksodocnum === 1 ? true : false,
    },
    // {
    //   id: "invdocnum",
    //   name: "Sales Invoice",
    //   checked: true,
    // },
    {
      id: "srtdocnum",
      name: "Sales Return",
      value: sysParam?.srtdocnum,
      checkId: "chksrtdocnum",
      checked: sysParam?.chksrtdocnum === 1 ? true : false,
    },
    {
      id: "otdocnum",
      name: "Other Receivables",
      value: sysParam?.otdocnum,
      checkId: "chkotdocnum",
      checked: sysParam?.chkotdocnum === 1 ? true : false,
    },
    // {
    //   id: "5",
    //   name: "Receipt Collections",
    //   checked: true,
    // },
    {
      id: "podocnum",
      name: "Purchase Order",
      value: sysParam?.podocnum,
      checkId: "chkpodocnum",
      checked: sysParam?.chkpodocnum === 1 ? true : false,
    },
    {
      id: "aprdocnum",
      name: "Purchases Receiving",
      value: sysParam?.aprdocnum,
      checkId: "chkaprdocnumfor",
      checked: sysParam?.chkaprdocnumfor === 1 ? true : false,
    },
    // {
    //   id: "8",
    //   name: "Purchase Return",
    //   checked: false,
    // },
    // {
    //   id: "9",
    //   name: "Provisional Receipt",
    //   checked: true,
    // },
    // {
    //   id: "11",
    //   name: "Other Payables",
    //   checked: true,
    // },
    // {
    //   id: "12",
    //   name: "Disbursement",
    //   checked: true,
    // },
    {
      id: "arcdocnum",
      name: "Receipts / Collections (Credit Memo)",
      value: sysParam?.arcdocnum,
      checkId: "chkarcdocnum",
      checked: sysParam?.chkarcdocnum === 1 ? true : false,
    },
    {
      id: "cashdocnum",
      name: "Cash Advances",
      value: sysParam?.cashdocnum,
      checkId: "chkcashdocnum",
      checked: sysParam?.chkcashdocnum === 1 ? true : false,
    },
    {
      id: "cusdocnum",
      name: "Customer",
      value: sysParam?.cusdocnum,
      checkId: "chkcusdocnum",
      checked: sysParam?.chkcusdocnum === 1 ? true : false,
    },
    // {
    //   id: "15",
    //   name: "Quotation",
    //   checked: true,
    // },
    // {
    //   id: "apcdocnum",
    //   name: "Physical Count",
    //   value: sysParam?.apcdocnum,
    //   checkId: "chkapcdocnumfor",
    //   checked: sysParam?.chkapcdocnumfor === 1 ? true : false,
    // },
    // {
    //   id: "17",
    //   name: "Check Reversal",
    //   checked: true,
    // },
    {
      id: "invdocnum",
      name: "Inventory",
      value: sysParam?.invdocnum,
      checkId: "chkinvdocnum",
      checked: sysParam?.chkinvdocnum === 1 ? true : false,
    },
    {
      id: "gldocnum",
      name: "Transaction GL Journal Entry",
      value: sysParam?.gldocnum,
      checkId: "chkgldocnum",
      checked: sysParam?.chkgldocnum === 1 ? true : false,
    },
    {
      id: "liqdocnum",
      name: "Liquidation",
      value: sysParam?.liqdocnum,
      checkId: "chkliqdocnum",
      checked: sysParam?.chkliqdocnum === 1 ? true : false,
    },
    // {
    //   id: "21",
    //   name: "Bank Transaction",
    //   checked: true,
    // },
    // {
    //   id: "22",
    //   name: "Inter Bank Transfer",
    //   checked: true,
    // },
    // {
    //   id: "23",
    //   name: "Disbursement (Debit Memo)",
    //   checked: false,
    // },
    {
      id: "deptdocnum",
      name: "Department",
      value: sysParam?.deptdocnum,
      checkId: "chkdeptdocnum",
      checked: sysParam?.chkdeptdocnum === 1 ? true : false,
    },
    {
      id: "itmcde",
      name: "Item",
      value: sysParam?.itmcde,
      checkId: "chkitmcde",
      checked: sysParam?.chkitmcde === 1 ? true : false,
    },
    {
      id: "itmclacde",
      name: "Item Class",
      value: sysParam?.itmclacde,
      checkId: "chkitmclacde",
      checked: sysParam?.chkitmclacde === 1 ? true : false,
    },
  ];
};
// #endregion

const LSTVDocnum = (): JSX.Element => {
  const { data, refetch } = use_SystemParam();
  const column = setColumn();
  const [columnData, setColumnData] = React.useState<any[]>([]); //Page Store for Ini and Change
  const { sysParam, setSysParam } = setSysPar(); //Global Store for Gathering Changes

  useEffect(() => {
    setColumnData(column);
  }, [data, refetch]);

  // #region Onchange Handle
  const handleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    checkId: string
  ) => {
    const checked = event.target.checked;

    //Page state update
    const updateChecked = columnData.map((content: any) =>
      checkId === content.checkId
        ? {
            ...content,
            checked,
          }
        : content
    );

    //sysparam global state update
    const toSysParam = sysParam?.map((content: any) => ({
      ...content,
      [checkId]: checked ? 1 : 0,
    }));

    setColumnData(updateChecked);
    setSysParam(toSysParam!);
  };

  const handleChangeData = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) => {
    const value = event.target.value;

    //Page state update
    const updateValue = columnData.map((content: any) =>
      content.id === id
        ? {
            ...content,
            value: value,
          }
        : content
    );

    //sysparam global state update
    const toSysParam = sysParam?.map((content: any) => ({
      ...content,
      [id]: value,
    }));

    setColumnData(updateValue);
    setSysParam(toSysParam!);
  };
  // #endregion

  // #region ColumnMapping
  const columnMapping = () => {
    const layouts = columnData.map((content: any, idx: number) => {
      const layout = (
        <Grid
          container
          direction="row"
          spacing={1}
          alignItems="center"
          xs={10}
          key={content.id}
        >
          <Grid xs={1.5}>
            <Checkbox
              checked={content.checked}
              color="default"
              onChange={(event) => handleChecked(event, content.checkId)}
            />
          </Grid>
          <Grid xs={4.6}>
            <Typography color={content.checked ? "" : "lightgray"}>
              {content.name}:
            </Typography>
          </Grid>
          <Grid xs={5.9}>
            <TextField
              disabled={!content.checked}
              autoFocus
              required
              fullWidth
              id={content.id}
              name={content.id}
              type="text"
              variant="outlined"
              size="small"
              color="success"
              value={content.value}
              onChange={(event) => handleChangeData(event, content.id)}
            />
          </Grid>
        </Grid>
      );

      return {
        idx,
        layout,
      };
    });

    const column1 = layouts
      .filter(({ idx }) => idx <= 7)
      .map(({ layout }) => layout);
    const column2 = layouts
      .filter(({ idx }) => idx > 7 && idx <= 14)
      .map(({ layout }) => layout);
    const column3 = layouts
      .filter(({ idx }) => idx > 14 && idx <= 21)
      .map(({ layout }) => layout);

    return {
      column1,
      column2,
      column3,
    };
  };
  const { column1, column2, column3 } = columnMapping();
  // #endregion

  return (
    <>
      <Divider>Document Number/Code</Divider>
      <Stack mb={1} />
      <Paper component="form" variant="outlined" sx={{ padding: "10px" }}>
        <Grid
          container
          direction="row"
          spacing={1}
          alignItems="baseline"
          xs={12}
        >
          {/* column 1 */}
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="center"
            xs={3.9}
          >
            {column1}
          </Grid>

          {/* column 2 */}
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="center"
            xs={4}
          >
            {column2}
          </Grid>

          {/* column 3 */}
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="center"
            xs={4}
          >
            {column3}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default LSTVDocnum;
