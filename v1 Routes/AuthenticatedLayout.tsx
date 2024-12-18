import React, { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/lstv-layout/sidebar/Sidebar";
import { useMutation } from "react-query";
import { isLoggedIn } from "./services/api/userApi";
import { useAccountStore } from "./store/useStore";
import Sidebar2 from "./components/lstv-layout/sidebar/Sidebar2";
import Loading from "./components/Loading";
import { useAuthStore } from "./store/useStore";

const AuthenticatedLayout: React.FC = () => {
  const { setUser } = useAuthStore();
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

  const { account } = useAccountStore();

  useEffect(() => {
    mutation.mutate(account);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* <Sidebar /> */}
      {/* <Sidebar>
        <Outlet />
      </Sidebar> */}
      <Sidebar2>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Sidebar2>
    </div>
  );
};

export default AuthenticatedLayout;
