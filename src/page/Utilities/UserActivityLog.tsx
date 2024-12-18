import { LSTVPageRootStyle } from "@/components/Dynamic";
import { LSTVTable2 } from "@/components/lstv-table2/LSTVTable";
import { ActionMenu, FormElement, HeaderLabel2, TableSettings } from "@/models";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import { use_LSTVTable2Hooks } from "@/components/hooks/lstvTable2";
import eyeFill from "@iconify/icons-eva/eye-fill";
import { useHandles } from "@/store/useCallbackStore";
import { LSTVDialogForm } from "@/components/lstv-dialog/LSTVDialog";
import itemsListSearch from "@/utils/itemsListSearch";
import PageNotFound from "../PageNoAccess";

// #region TABLE_API_CON
const API_CON = () => {
  const { account } = useAccountStore();

  const { data, refetch } = useQuery<any>(
    "useractivitylog",
    async () =>
      await ApiService.get("useractivitylog", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );
  return {
    data,
    refetch,
  };
};
// #endregion

// #region TABLE_TITLE
const TABLE_TITLE = "User Activity Log";
// #endregion

// #region TABLE_SETTINGS
const TABLE_SETTINGS: TableSettings[] = [
  {
    stripeColor: "#f5f5f5",
    addButton: false,
    printButton: false,
    sysParam: true,
  },
];
// #endregion

// #region TABLE_HEAD
const TABLE_HEAD: HeaderLabel2[] = [
  {
    id: "usrdte",
    header: "User Date",
    size: 150,
    format: "MMMM D, YYYY",
    align: "left", // left | center | right
    type: "date", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "usrtim",
    header: "User Time",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "usrcde",
    header: "User",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
    // decimalCnt: 2,
    // currency: "PHP", // User define the currency symbol exmple $ or ₱
  },
  {
    id: "modcde",
    header: "Module",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "activity",
    header: "Activity",
    size: 250,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password
  },
  {
    id: "remarks",
    header: "Remarks",
    size: 350,
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
  ];
};
// #endregion

// #region TABLE_ACTION_DIALOG
const ACTION_DIALOG = () => {
  const { setShowDialog, showDialog, dialogType } = useHandles();

  return (
    <LSTVDialogForm
      open={showDialog!}
      setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
      formElements={FORM_ELEMENTS}
      dialogContent="Activity Logs"
      dialogTitle="Activity Logs"
    />
  );
};
// #endregion

// #region TABLE_DIALOG_ELEMENTS
const FORM_ELEMENTS: FormElement[] = [
  {
    id: "usrdte",
    label: "User Date",
    name: "usrdte",
    type: "date",
  },
  {
    id: "usrtim",
    label: "User Time",
    name: "usrtim",
    type: "text",
  },
  {
    id: "usrcde",
    label: "User",
    name: "usrcde",
    type: "text",
  },
  {
    id: "modcde",
    label: "Module",
    name: "modcde",
    type: "text",
  },
  {
    id: "activity",
    label: "Activity",
    name: "activity",
    type: "text",
  },
  {
    id: "remarks",
    label: "Remarks",
    name: "remarks",
    type: "text",
  },
];
// #endregion

export default function UserActivityLog() {
  const ACTION_MENU = actionMenu();
  const { data, refetch } = API_CON();

  return (
    <LSTVTable2
      title={TABLE_TITLE}
      placeholder={"Search " + TABLE_TITLE}
      tableHead={TABLE_HEAD}
      tableData={data?.data?.payload || []}
      actionMenu={ACTION_MENU}
      actionDialog={() => ACTION_DIALOG()}
      tableSettings={TABLE_SETTINGS}
      refetch={() => refetch()}
    />
  );
}
