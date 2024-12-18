import { LSTVPageRootStyle } from "@/components/Dynamic";
import { LSTVTable2 } from "@/components/lstv-table2/LSTVTable";
import { ActionMenu, FormElement, HeaderLabel2, TableSettings } from "@/models";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import eyeFill from "@iconify/icons-eva/eye-fill";
import trashFill from "@iconify/icons-eva/trash-fill";
import editFill from "@iconify/icons-eva/edit-fill";
import userKey from "@iconify/icons-eva/checkmark-square-2-fill";
import {
  useAddCallback,
  useEditCallback,
  useDeleteCallback,
} from "@/store/useCallbackStore";
import { useHandles } from "@/store/useCallbackStore";
// import { UserAccessDialog } from "@/components/lstv-dialog/UserAccessDialogv1";
import {
  LSTVDialogForm,
  LSTVDialogDeleteForm,
} from "@/components/lstv-dialog/LSTVDialog";
import { lazy, Suspense } from "react";
import Loading from "@/components/lstv-loader/Loading";

// const UserAccessDialog = lazy(
//   () => import("@/components/lstv-dialog/UserAccessDialogV3/")
// );

const UserAccessDialog = lazy(
  () =>
    new Promise((resolve: any) =>
      setTimeout(
        () => resolve(import("@/components/lstv-dialog/UserAccessDialogV2")),
        1000
      )
    )
);

// #region TABLE_API_CON
const API_CON = () => {
  const { account } = useAccountStore();
  const { addUser } = useAddCallback();
  const { editUser } = useEditCallback();
  const { deleteUser } = useDeleteCallback();

  const { data, refetch } = useQuery<any>(
    "users",
    async () =>
      await ApiService.get("users", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const addData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData as any);

    const manualJson = {
      usrcde: formJson.usrname ? formJson.usrname.toString() : "",
      usrname: formJson.usrname ? formJson.usrname.toString() : "",
      usrpwd: formJson.usrpwd ? formJson.usrpwd.toString() : "",
      usrlvl: formJson.usrlvl ? formJson.usrlvl.toString() : "",
      emailadd: formJson.emailadd ? formJson.emailadd.toString() : "",
      fullname: formJson.fullname ? formJson.fullname.toString() : "",
    };

    addUser!(manualJson, refetch);
  };

  const editData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData as any);

    const recid = parseInt(formJson.recid);
    const manualJson = {
      usrcde: formJson.usrname ? formJson.usrname.toString() : "",
      usrname: formJson.usrname ? formJson.usrname.toString() : "",
      usrpwd: formJson.usrpwd ? formJson.usrpwd.toString() : "",
      usrlvl: formJson.usrlvl ? formJson.usrlvl.toString() : "",
      emailadd: formJson.emailadd ? formJson.emailadd.toString() : "",
      fullname: formJson.fullname ? formJson.fullname.toString() : "",
    };

    editUser!(recid, manualJson, refetch);
  };

  const deleteData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData as any);

    const recid = parseInt(formJson.recid);
    deleteUser!(recid, refetch);
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
const TABLE_TITLE = "User File";
// #endregion

// #region TABLE_SETTINGS
const TABLE_SETTINGS: TableSettings[] = [
  {
    stripeColor: "#f5f5f5",
    addButton: true,
    printButton: true,
    sysParam: false,
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
    id: "usrname",
    header: "Username",
    size: 250,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "usrlvl",
    header: "User Level",
    size: 250,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "emailadd",
    header: "Email Address",
    size: 250,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "fullname",
    header: "Employee Full Name",
    size: 250,
    format: " MMMM D, YYYY", // MM/DD/YYYY | MMMM D, YYYY | MMM D, YYYY
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
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
    {
      label: "Access",
      icon: userKey,
      type: "Access", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
  ];
};
// #endregion

// #region TABLE_ACTION_DIALOG
const ACTION_DIALOG = () => {
  const { setShowDialog, showDialog, dialogType } = useHandles();
  const { addData, editData, deleteData } = API_CON();
  const FORM_ELEMENTS = formElements();

  if (dialogType === "Access") {
    return (
      <UserAccessDialog
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
      />
    );
  } else if (dialogType === "Delete") {
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

// #region TABLE_DIALOG_ELEMENTS
const formElements = (): FormElement[] => {
  return [
    {
      id: "recid",
      label: "ID",
      name: "recid",
      type: "number",
      hidden: true,
      required: true,
    },
    {
      id: "usrname",
      label: "Username",
      name: "usrname",
      type: "text",
      required: true,
    },
    {
      id: "usrpwd",
      label: "Password",
      name: "usrpwd",
      type: "password",
      required: true,
    },
    {
      id: "usrlvl",
      label: "User Level",
      name: "usrlvl",
      type: "select",
      selectOpt: [
        { id: "Supervisor", name: "Supervisor" },
        { id: "User", name: "User" },
      ],
      required: true,
    },
    {
      id: "emailadd",
      label: "Email Address",
      name: "emailadd",
      type: "text",
      required: true,
    },
    {
      id: "fullname",
      label: "Employee Full Name",
      name: "fullname",
      type: "text",
      required: false,
    },
  ];
};
// #endregion

export default function UserPage() {
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
