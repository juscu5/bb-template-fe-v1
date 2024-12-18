import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack";

// Lazy load components
const Login = lazy(() => import("./page/Login/Login"));
const DepartmentsPage = lazy(() => import("./page/Master Files/DepartmentsV1"));
const Dashboard = lazy(() => import("./page/Dashboard/Dashboard"));
const EmployeesPage = lazy(() => import("./page/Master Files/Employees"));
const UserActivityLog = lazy(() => import("./page/Utilities/UserActivityLog"));
const SetPassword = lazy(() => import("./page/Utilities/SetPassword2"));
const AuthenticatedLayout = lazy(() => import("./AuthenticatedLayout"));
const Settings = lazy(() => import("./page/Utilities/DateLocking"));
const UserPage = lazy(() => import("./page/Utilities/User"));

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "departments",
            element: <DepartmentsPage />,
          },
          {
            path: "employees",
            element: <EmployeesPage />,
          },
          {
            path: "useractivitylog",
            element: <UserActivityLog />,
          },
          {
            path: "setpassword",
            element: <SetPassword />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "users",
            element: <UserPage />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider dense maxSnack={3}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
