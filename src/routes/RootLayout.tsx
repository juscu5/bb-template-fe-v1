import React, { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/lstv-layout/sidebar/v3/Sidebar";
import Loading from "../components/lstv-loader/Loading";
import { useAccountStore, useAuthStore } from "@/store/useStore";
import { useMutation } from "react-query";
import { isLoggedIn } from "@/services/api/userApi";
import { LSTVTokenDialog } from "@/components/lstv-dialog/LSTVTokenExpired";
import ToggleLoading from "@/components/lstv-loader/NetworkError";
import AppBar from "@/components/lstv-layout/appbar/AppBar";

const RootLayout: React.FC = () => {
  const { setUser } = useAuthStore();
  const { account } = useAccountStore();
  const navigate = useNavigate();

  const mutation = useMutation(isLoggedIn, {
    onError: () => {
      navigate("/login");
    },
    onSuccess: (data) => {
      console.log("Success");
      setUser(data.payload);
    },
  });

  useEffect(() => {
    mutation.mutate(account);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <AppBar />
      <Sidebar>
        <Suspense fallback={<Loading />}>
          <Outlet />
          <LSTVTokenDialog />
        </Suspense>
      </Sidebar>
      <ToggleLoading />
    </div>
  );
};

export default RootLayout;
