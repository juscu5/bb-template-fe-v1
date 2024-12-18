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

// #region System Parameters
const systemParam = () => {
  const { data } = use_SystemParam();
  const sysParam = data?.data?.payload[0];

  const enableDocnum = sysParam?.chkcusdocnum === 0 ? false : true;

  return { enableDocnum };
};
// #endregion

// #region Access Parameters
const accessParam = () => {
  return {};
};
// #endregion

// #region TABLE_API_CON
const API_CON = () => {
  const { setShowDialog } = useHandles();
  const { account } = useAccountStore();
  const { enableDocnum } = systemParam();

  const { data, refetch } = useQuery<any>(
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

    try {
      const res = await ApiService.post(`customer/${docnum}`, formJson, {
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
      enqueueSnackbar(`Adding Customer Failed: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };

  const editData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const res = await ApiService.put(
        `customer/${formJson["cuscde"]}`,
        formJson,
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
      enqueueSnackbar(`Customer Failed Update: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };

  const deleteData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const res = await ApiService.delete(`customer/${formJson["cuscde"]}`, {
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
      enqueueSnackbar(`Customer Failed Delete: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };
  return {
    data,
    addData,
    editData,
    deleteData,
  };
};
// #endregion

// #region TABLE_TITLE
const TABLE_TITLE = "Customers File";
// #endregion

// #region TABLE_SETTINGS
const TABLE_SETTINGS: TableSettings[] = [
  {
    stripeColor: "#f5f5f5",
    addButton: true,
    printButton: true,
    sysParam: false,
    columnPinning: true,
  },
];
// #endregion

// #region TABLE_HEAD
const TABLE_HEAD: HeaderLabel2[] = [
  {
    id: "cuscde",
    header: "Customer Code",
    size: 50,
    align: "left", // left | center | right
    type: "number", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "cusdsc",
    header: "Customer Description",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "cusadd1",
    header: "Address 1",
    size: 200,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "cusadd2",
    header: "Address 2",
    size: 200,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
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
  const { dialogType } = useHandles();
  const { enableDocnum } = systemParam();

  // Dialog Type with Docnum. If edit auto hidden, if add depend on syspar
  const typeDocnum = dialogType === "Add" ? enableDocnum : true;

  return [
    {
      id: "cuscde",
      label: "Customer Code",
      name: "cuscde",
      type: "text",
      hidden: typeDocnum,
    },
    {
      id: "cusdsc",
      label: "Customer Desc",
      name: "cusdsc",
      type: "text",
    },
    {
      id: "cusadd1",
      label: "Address 1",
      name: "cusadd1",
      type: "text",
    },
    {
      id: "cusadd2",
      label: "Address 2",
      name: "cusadd2",
      type: "text",
    },
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
        docnum="cuscde"
        dialogTitle="Customer"
      />
    );
  } else {
    return (
      <LSTVDialogForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        dialogContent="Customer"
        dialogTitle="Add Customer"
        addCallback={addData}
        editCallback={editData}
      />
    );
  }
};
// #endregion

export default function CustomersPage() {
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
