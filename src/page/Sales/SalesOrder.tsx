import { LSTVPageRootStyle } from "@/components/Dynamic";
import { LSTVTable2 } from "@/components/lstv-table2/LSTVTable";
import { ActionMenu, FormElement, HeaderLabel2, TableSettings } from "@/models";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import eyeFill from "@iconify/icons-eva/eye-fill";
import trashFill from "@iconify/icons-eva/trash-fill";
import editFill from "@iconify/icons-eva/edit-fill";
import { useHandles } from "@/store/useCallbackStore";
import {
  LSTVDialogDeleteForm,
  LSTVDialogForm,
} from "@/components/lstv-dialog/LSTVDialog";
import { enqueueSnackbar } from "notistack";
import { use_SystemParam } from "@/components/hooks/lstvSysparam";
import { LSTVSalesDialog } from "@/components/lstv-dialog/LSTVSalesDialog";
import { useState } from "react";
import { LSTVSalesOrderDialog } from "@/components/lstv-dialog/LSTVSalesOrderDialog";

// #region System Parameters
const systemParam = () => {
  const { data } = use_SystemParam();
  const sysParam = data?.data?.payload[0];

  const enableDocnum = sysParam?.chksodocnum === 0 ? false : true;

  return { enableDocnum };
};
// #endregion

// #region TABLE_API_CON
const API_CON = () => {
  const { setShowDialog } = useHandles();
  const { account } = useAccountStore();
  const { enableDocnum } = systemParam();

  const { data, refetch: refSal } = useQuery<any>(
    "salesorder",
    async () =>
      await ApiService.get("salesorder", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const { data: datCust, refetch: refCust } = useQuery<any>(
    "customer",
    async () =>
      await ApiService.get("customer", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const addData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const docnum = enableDocnum ? "docnum" : "";

    const advdoc = formData.get("advdoc") as string;

    const data = {
      ...formJson,
      advdoc: advdoc === "on" ? 1 : 0,
    };

    try {
      const res = await ApiService.post(`salesorder/${docnum}`, data, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Adding Transaction Failed: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refSal();
  };

  const editData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const advdoc = formData.get("advdoc") as string;

    const data = {
      ...formJson,
      advdoc: advdoc === "on" ? 1 : 0,
    };

    try {
      const res = await ApiService.put(
        "salesorder/" + formJson["docnum"],
        data,
        {
          headers: { Authorization: `Bearer ${account}` },
        }
      );
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Transaction Failed Update: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refSal();
  };

  const deleteData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const res = await ApiService.delete(`salesorder/${formJson["docnum"]}`, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Transaction Failed Delete: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refSal();
  };
  return {
    data,
    datCust,
    addData,
    editData,
    deleteData,
  };
};
// #endregion

// #region TABLE_TITLE
const TABLE_TITLE = "Sales Order";
// #endregion

// #region TABLE_SETTINGS
const TABLE_SETTINGS: TableSettings[] = [
  {
    stripeColor: "#f5f5f5",
    addButton: true,
    printButton: true,
    sysParam: false,
    columnAction: true,
    columnOrdering: true,
    columnPinning: true,
  },
];
// #endregion

// #region TABLE_HEAD
const TABLE_HEAD: HeaderLabel2[] = [
  {
    id: "trndte",
    header: "Trans Date",
    size: 100,
    format: " MMMM D, YYYY",
    align: "left", // left | center | right
    type: "date", // text | date | monetary | number | email | password
  },
  {
    id: "docnum",
    header: "Doc No.",
    size: 100,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "totamtdisfor",
    header: "Amount",
    size: 100,
    align: "left", // left | center | right
    type: "monetary", // text | date | monetary | number | email | password
    currency: "PHP",
    decimalCnt: 2,
  },
  // {
  //   id: "recdocnum",
  //   header: "OR No.",
  //   size: 100,
  //   align: "left", // left | center | right
  //   type: "text", // text | date | monetary | number | email | password
  // },
  // {
  //   id: "refnum",
  //   header: "REF No.",
  //   size: 100,
  //   align: "left", // left | center | right
  //   type: "text", // text | date | monetary | number | email | password
  // },
  // {
  //   id: "docbalfor",
  //   header: "Balance",
  //   size: 100,
  //   align: "left", // left | center | right
  //   type: "monetary", // text | date | monetary | number | email | password
  //   currency: "PHP",
  //   decimalCnt: 2,
  // },
  // {
  //   id: "canceldoc",
  //   header: "Cancelled",
  //   size: 100,
  //   align: "left", // left | center | right
  //   type: "text", // text | date | monetary | number | email | password
  // },
  // {
  //   id: "advdoc",
  //   header: "Advances",
  //   size: 100,
  //   align: "left", // left | center | right
  //   type: "cndn", // text | date | monetary | number | email | password | cndn
  //   cndntype: 2,
  // },
];
// #endregion

// #region TABLE_ACTION_MENU
const actionMenu = (): ActionMenu[] => {
  const { handleShowDialog } = useHandles();
  return [
    {
      label: "View",
      icon: eyeFill,
      type: "View", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
    {
      label: "Edit",
      icon: editFill,
      type: "Edit", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
    {
      label: "Delete",
      icon: trashFill,
      type: "Delete", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
  ];
};
// #endregion

// #region TABLE_DIALOG_ELEMENTS
const formElements = (): FormElement[] => {
  const { datCust } = API_CON();
  const { dialogType } = useHandles();
  const { enableDocnum } = systemParam();

  const data = datCust?.data?.payload;

  const customer = data?.map((cust: any) => ({
    id: cust.cuscde,
    name: cust.cusdsc,
    address: cust.cusadd1,
    address2: cust.cusadd2,
  }));

  // Dialog Type with Docnum. If edit auto disable, if add depend on syspar
  const typeDocnum = dialogType === "Add" ? enableDocnum : true;
  return [
    {
      id: "docnum",
      label: "Sales Doc No.",
      name: "docnum",
      type: "text",
      disabled: typeDocnum,
    },
    {
      id: "cuscde",
      label: "Customer Description",
      name: "cuscde",
      type: "select",
      selectOpt: customer,
    },
    {
      id: "cusdsc",
      label: "Customer Address ",
      name: "cusdsc",
      type: "text",
      // disabled: true,
    },
    {
      id: "shipto",
      label: "Ship To",
      name: "shipto",
      type: "select",
      selectOpt: customer,
    },
    {
      id: "preby",
      label: "Prepared By",
      name: "preby",
      type: "text",
    },
    {
      id: "trndte",
      label: "Trans. Date",
      name: "trndte",
      type: "date",
    },
    // {
    //   id: "drnum",
    //   label: "Dr No.",
    //   name: "drnum",
    //   type: "text",
    // },
    {
      id: "refnum",
      label: "Ref No.",
      name: "refnum",
      type: "text",
    },
    {
      id: "ewtcde",
      label: "EWT Code",
      name: "ewtcde",
      type: "select",
      selectOpt: [
        {
          id: "PROF FEES",
          name: "PROF FEES",
        },
        {
          id: "RENT",
          name: "RENT",
        },
        {
          id: "SAL GOODS",
          name: "SAL GOODS",
        },
        {
          id: "SAL SERVICES",
          name: "SAL SERVICES",
        },
        {
          id: "SJ SERVICES",
          name: "SJ SERVICES",
        },
      ],
    },
    {
      id: "evatcde",
      label: "EVAT Code",
      name: "evatcde",
      type: "select",
      selectOpt: [
        {
          id: "SAL SERVICES",
          name: "SAL SERVICES",
        },
        {
          id: "SJ SERVICES",
          name: "SJ SERVICES",
        },
        {
          id: "VAT EXEMPT",
          name: "VAT EXEMPT",
        },
      ],
    },
    // {
    //   id: "warcde",
    //   label: "Warehouse",
    //   name: "warehouse",
    //   type: "select",
    //   selectOpt: [],
    // },
    {
      id: "usrcde",
      label: "User",
      name: "usrcde",
      type: "text",
      disabled: true,
    },
    // {
    //   id: "prccde",
    //   label: "Price List",
    //   name: "prccde",
    //   type: "select",
    //   selectOpt: [],
    // },
    {
      id: "smncde",
      label: "Salesman",
      name: "smncde",
      type: "select",
      selectOpt: [
        {
          id: "John Doe",
          name: "John Doe",
        },
        {
          id: "Johnny Diaz",
          name: "Johnny Diaz",
        },
        {
          id: "Christopher Nolan",
          name: "Christopher Nolan",
        },
        {
          id: "Ricardo Martinez",
          name: "Ricardo Martinez",
        },
        {
          id: "Lebron James",
          name: "Lebron James",
        },
      ],
    },
    {
      id: "trmcde",
      label: "Terms",
      name: "trmcde",
      type: "select",
      selectOpt: [
        {
          id: "30 Days",
          name: "30 Days",
        },
        {
          id: "45 Days",
          name: "45 Days",
        },
        {
          id: "45 Days",
          name: "45 Days",
        },
        {
          id: "60 Days",
          name: "60 Days",
        },
        {
          id: "90 Days",
          name: "90 Days",
        },
        {
          id: "COD",
          name: "COD",
        },
        {
          id: "Installment",
          name: "Installment",
        },
      ],
    },
    {
      id: "advdoc",
      label: "Advances",
      name: "advdoc",
      type: "check",
    },
    {
      id: "remarks",
      label: "Remarks",
      name: "remarks",
      type: "text",
    },
    {
      id: "chkby",
      label: "Checked By",
      name: "chkby",
      type: "text",
    },
    {
      id: "apvby",
      label: "Approved By",
      name: "apvby",
      type: "text",
    },
    {
      id: "totamtdisfor",
      label: "Ammount",
      name: "totamtdisfor",
      type: "monetary",
    },
    // GrandTotal = "trntotfor"
  ];
};
// #endregion

// #region TABLE_ACTION_DIALOG
const ACTION_DIALOG = () => {
  const { setShowDialog, showDialog, dialogType } = useHandles();
  const { addData, editData, deleteData } = API_CON();
  const FORM_ELEMENTS = formElements();

  if (dialogType === "Delete") {
    return (
      <LSTVDialogDeleteForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        deleteCallback={deleteData}
        docnum="docnum"
        dialogTitle="Sales Order"
      />
    );
  } else {
    return (
      <LSTVSalesOrderDialog
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        dialogContent="Sales"
        dialogTitle="Add Sales Order"
        addCallback={addData}
        editCallback={editData}
      />
    );
  }
};
// #endregion

export default function SalesOrder() {
  const ACTION_MENU = actionMenu();
  const { data } = API_CON();

  return (
    <LSTVTable2
      title={TABLE_TITLE}
      placeholder={"Search " + TABLE_TITLE}
      tableHead={TABLE_HEAD}
      tableData={data?.data?.payload || []}
      actionMenu={ACTION_MENU}
      actionDialog={() => ACTION_DIALOG()}
      tableSettings={TABLE_SETTINGS}
    />
  );
}
