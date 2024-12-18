import DashboardIcon from "@mui/icons-material/Dashboard";
import StarBorder from "@mui/icons-material/StarBorder";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ReportIcon from "@mui/icons-material/Report";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SummarizeIcon from "@mui/icons-material/Summarize";
import HandymanIcon from "@mui/icons-material/Handyman";
import Key from "@mui/icons-material/Key";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import PrintIcon from "@mui/icons-material/Print";
import PeopleIcon from "@mui/icons-material/People";
import TuneIcon from "@mui/icons-material/Tune";
import LockClockIcon from "@mui/icons-material/LockClock";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import ExtensionIcon from "@mui/icons-material/Extension";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import TocIcon from "@mui/icons-material/Toc";
import WidgetsIcon from "@mui/icons-material/Widgets";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BadgeIcon from "@mui/icons-material/Badge";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { KeyIcon } from ".";

export const getKeyIcon = (name: string): JSX.Element => {
  const iconMap: KeyIcon = {
    // #region MenuIcon
    reports: <ReportIcon />,
    setup: <SettingsIcon />,
    trans: <WidgetsIcon />,

    // #region Dasboard
    dashboard: <DashboardIcon />,
    // #endregion

    // #region Master Files
    masterfiles: <StarBorder />,
    ml_employee: <EmojiPeopleIcon />,
    ml_department: <WorkspacesIcon />,
    ml_customer: <GroupsIcon />,
    ml_item: <CategoryIcon />,
    ml_itemclass: <ExtensionIcon />,
    // #endregion

    // #region Sales
    sales: <ReceiptIcon />,
    sal_sales: <ReceiptIcon />,
    sal_invoice: <DescriptionIcon />,
    sal_returns: <AssignmentReturnIcon />,
    sal_order: <ShoppingCartCheckoutIcon />,
    //reports
    sal_rep_salesreg: <PointOfSaleIcon />,
    sal_rep_returnsreg: <TurnLeftIcon />,
    // #endregion

    // #region Receivables
    receivables: <SummarizeIcon />,
    // #endregion

    // #region Payroll
    payroll: <AccountBalanceWalletIcon />,
    pr_ml: <StarBorder />,
    pr_tables: <TocIcon />,
    pr_util: <HandymanIcon />,
    pr_bc: <CreditCardIcon />,
    // #endregion

    // #region Timekeeping
    timekeeping: <AccessTimeFilledIcon />,
    // #endregion

    // #region Assets
    assets: <InventoryIcon />,
    // #endregion

    // #region Training
    training: <AssignmentIcon />,
    // #endregion

    // #region Scheduling
    scheduling: <CalendarMonthIcon />,
    // #endregion

    // #region Forms
    forms: <DescriptionIcon />,
    // #endregion

    // #region Analytics
    analytics: <AnalyticsIcon />,
    // #endregion

    // #region ESS
    ess: <BadgeIcon />,
    // #endregion

    // #region Utilities
    utilities: <HandymanIcon />,
    util_setpass: <Key />,
    util_useractlog: <PendingActionsIcon />,
    util_userfile: <PeopleIcon />,
    util_syspar: <TuneIcon />,
    util_datelock: <LockClockIcon />,
    // #endregion
    // #endregion

    // #region Other Icon
    Print: <PrintIcon />,
    // #endregion
  };

  return iconMap[name];
};
