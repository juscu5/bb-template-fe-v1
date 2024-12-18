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

  const enableDocnum = sysParam?.chkdeptdocnum === 0 ? false : true;

  return { enableDocnum };
};
// #endregion

// #region TABLE_API_CON
const API_CON = () => {
  const { setShowDialog } = useHandles();
  const { account } = useAccountStore();
  const { enableDocnum } = systemParam();

  const { data, refetch } = useQuery<any>(
    "departments",
    async () =>
      await ApiService.get("departments", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const addData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const docnum = enableDocnum ? "docnum" : "";

    try {
      const res = await ApiService.post(`departments/${docnum}`, formJson, {
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
      enqueueSnackbar(`Adding Deparment Failed: ${error}`, {
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
        `departments/${formJson["deptcode"]}`,
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
      enqueueSnackbar(`Department Failed Update: ${error}`, {
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

    console.log(formJson["deptcode"]);

    try {
      const res = await ApiService.delete(
        `departments/${formJson["deptcode"]}`,
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
      enqueueSnackbar(`Department Failed Delete: ${error}`, {
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
const TABLE_TITLE = "Departments";
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
    id: "deptcode",
    header: "Department Code",
    size: 100,
    align: "left", // left | center | right
    type: "number", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "deptdescription",
    header: "Department",
    size: 250,
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
      id: "deptcode",
      label: "Department Code",
      name: "deptcode",
      type: "text",
      hidden: typeDocnum,
    },
    {
      id: "deptdescription",
      label: "Department",
      name: "deptdescription",
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
        docnum="deptcode"
        dialogTitle="Department"
      />
    );
  } else {
    return (
      <LSTVDialogForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        dialogContent="Department"
        dialogTitle="Add Department"
        addCallback={addData}
        editCallback={editData}
      />
    );
  }
};
// #endregion

export default function EmployeesPage() {
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
