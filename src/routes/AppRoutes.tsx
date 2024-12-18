import { lazy } from "react";
import { createHashRouter } from "react-router-dom";
import RootLayout from "./RootLayout";

import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import PageNotFound from "@/page/PageNotFound";

// Lazy load components
const Login = lazy(() => import("../page/Login/Login"));
const DepartmentsPage = lazy(() => import("../page/Master Files/Departments"));
const Dashboard = lazy(() => import("../page/Dashboard/Dashboard"));
const EmployeesPage = lazy(() => import("../page/Master Files/Employees"));
const UserActivityLog = lazy(() => import("../page/Utilities/UserActivityLog"));
const SetPassword = lazy(() => import("../page/Utilities/SetPassword2"));
const DateLocking = lazy(() => import("../page/Utilities/DateLocking"));
const UserPage = lazy(() => import("../page/Utilities/User"));
const SalesPage = lazy(() => import("../page/Sales/SalesPage/Sales"));
const SysParam = lazy(() => import("../page/Utilities/SystemParameters"));
const CustomersPage = lazy(() => import("../page/Master Files/Customers"));
const ItemClass = lazy(() => import("../page/Master Files/ItemClassification"));
const ItemFile = lazy(() => import("../page/Master Files/Item"));
const ByDate = lazy(() => import("../page/Sales/Reports/ByDate"));
const ByDocNum = lazy(() => import("../page/Sales/Reports/ByDocnum"));
const SalesOrder = lazy(() => import("../page/Sales/SalesOrder"));

const AppRoutes = createHashRouter([
  {
    path: "/login",
    element: <PublicRoutes element={<Login />} />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "null",
        element: <PrivateRoutes element={<PageNotFound />} />,
      },
      {
        path: "dashboard",
        element: <PrivateRoutes element={<Dashboard />} />,
      },
      {
        path: "departments",
        element: <PrivateRoutes element={<DepartmentsPage />} />,
      },
      {
        path: "employees",
        element: <PrivateRoutes element={<EmployeesPage />} />,
      },
      {
        path: "customer",
        element: <PrivateRoutes element={<CustomersPage />} />,
      },
      {
        path: "useractivitylog",
        element: <PrivateRoutes element={<UserActivityLog />} />,
      },
      {
        path: "setpassword",
        element: <PrivateRoutes element={<SetPassword />} />,
      },
      {
        path: "datelock",
        element: <PrivateRoutes element={<DateLocking />} />,
      },
      {
        path: "users",
        element: <PrivateRoutes element={<UserPage />} />,
      },
      {
        path: "sales",
        element: <PrivateRoutes element={<SalesPage />} />,
      },
      {
        path: "syspar",
        element: <PrivateRoutes element={<SysParam />} />,
      },
      {
        path: "itemclass",
        element: <PrivateRoutes element={<ItemClass />} />,
      },
      {
        path: "item",
        element: <PrivateRoutes element={<ItemFile />} />,
      },
      {
        path: "repsaldate",
        element: <PrivateRoutes element={<ByDate />} />,
      },
      {
        path: "repsaldocnum",
        element: <PrivateRoutes element={<ByDocNum />} />,
      },
      {
        path: "salesorder",
        element: <PrivateRoutes element={<SalesOrder />} />,
      },
    ],
  },
]);

export default AppRoutes;
