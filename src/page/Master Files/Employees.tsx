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

// #region TABLE_API_CON
const API_CON = () => {
  const { setShowDialog } = useHandles();
  const { account } = useAccountStore();

  const { data, refetch } = useQuery<any>(
    "employees",
    async () =>
      await ApiService.get("employees", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const { data: deptData, refetch: deptRefetch } = useQuery<any>(
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
    const is_lock = formData.get("is_lock") as string;

    const data = {
      ...formJson,
      is_lock: is_lock === "on" ? 1 : 0,
    };

    try {
      const res = await ApiService.post("employees", data, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar("Added Employee Successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e) {
      enqueueSnackbar(`Adding Employee Failed: ${e}`, {
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
    const is_lock = formData.get("is_lock") as string;

    const data = {
      ...formJson,
      is_lock: is_lock === "on" ? 1 : 0,
    };

    try {
      const res = await ApiService.put(`employees/${formJson["recid"]}`, data, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(`Employee #${formJson["recid"]} Updated Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e) {
      enqueueSnackbar(`Employee #${formJson["recid"]} Failed Update: ${e}`, {
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
      const res = await ApiService.delete(`employees/${formJson["recid"]}`, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(`Employee #${formJson["recid"]} Deleted`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e) {
      enqueueSnackbar(`Employee #${formJson["recid"]} Failed Delete: ${e}`, {
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
    deptData,
    addData,
    editData,
    deleteData,
  };
};
// #endregion

// #region TABLE_TITLE
const TABLE_TITLE = "Employee";
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
    id: "recid",
    header: "ID",
    size: 100,
    align: "left", // left | center | right
    type: "number", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "fullname",
    header: "Fullname",
    size: 180,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "age",
    header: "Age",
    size: 100,
    align: "left", // left | center | right
    type: "number", // text | date | monetary | number | email | password
  },
  {
    id: "deptdescription",
    header: "Department",
    size: 250,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "esttotalincome",
    header: "Salary",
    size: 200,
    align: "left", // left | center | right
    type: "monetary", // text | date | monetary | number | email | password
    decimalCnt: 2,
    currency: "PHP", // User define the currency symbol exmple $ or ₱
  },
  {
    id: "hiredate",
    header: "Hire Date",
    size: 200,
    format: " MMMM D, YYYY", // MM/DD/YYYY | MMMM D, YYYY | MMM D, YYYY
    align: "left", // left | center | right
    type: "date", // text | date | monetary | number | email | password
  },
  {
    id: "is_lock",
    header: "Is Lock",
    size: 100,
    align: "left", // left | center | right
    type: "cndn", // text | date | monetary | number | email | password | cndn
    cndntype: 2, // 1 | 2 | 3
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
  const { deptData } = API_CON();
  const data = deptData?.data.payload;

  const department = data?.map((dept: any) => ({
    id: dept.deptcode,
    name: dept.deptdescription,
  }));

  return [
    {
      id: "recid",
      label: "ID",
      name: "recid",
      type: "number",
      hidden: true,
      // variant: "standard", // outlined | filled | standard
      // validation: true, // true | false
      // validationText: "Testing Lang", // leave blank if validation=false
    },
    {
      id: "fullname",
      label: "Fullname",
      name: "fullname",
      type: "text",
    },
    {
      id: "age",
      label: "Age",
      name: "age",
      type: "number",
    },
    {
      id: "esttotalincome",
      label: "Salary",
      name: "esttotalincome",
      type: "monetary",
    },
    {
      id: "hiredate",
      label: "Start Date",
      name: "hiredate",
      type: "date",
    },
    {
      id: "deptcode",
      label: "Department",
      name: "deptcode",
      type: "select",
      selectOpt: department,
    },
    {
      id: "is_lock",
      label: "Locked",
      name: "is_lock",
      // type: "check",
      type: "switch",
      switchStyle: "IOS",
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
      />
    );
  } else {
    return (
      <LSTVDialogForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        dialogContent="User"
        dialogTitle="Add User"
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
