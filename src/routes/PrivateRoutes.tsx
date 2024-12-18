import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useStore";
import PageNoAccess from "../page/PageNoAccess";
import PageNotFound from "@/page/PageNotFound";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import { use_FetchRoutes } from "@/components/hooks/itemList";
import debounce from "lodash/debounce";
import { useAxiosInterceptors } from "@/services/interceptors";
import { useMinimizeDrawer } from "@/store/useDrawerStore";

interface PrivateRoutesProps {
  element: React.ReactNode;
}

const rolesFor = () => {
  const { data } = use_FetchRoutes();

  const mapMenuProgram = data
    ?.map((menu: any) => {
      const submenuPrgs = menu.items
        ?.flatMap((submenu1: any) => {
          const submenu2Prgs = submenu1.items
            ?.map((submenu2: any) => {
              return submenu2.menprg !== "null" ? submenu2.menprg : null;
            })
            .filter(Boolean);

          return submenu2Prgs && submenu2Prgs.length > 0
            ? submenu2Prgs
            : submenu1.menprg !== "null"
            ? [submenu1.menprg]
            : null;
        })
        .filter(Boolean);

      return submenuPrgs && submenuPrgs.length > 0
        ? submenuPrgs
        : menu.menprg !== "null"
        ? [menu.menprg]
        : null;
    })
    .filter(Boolean)
    .flat();

  const rolesConfig: { [key: string]: string[] } = {
    Supervisor: mapMenuProgram,
    User: mapMenuProgram,
  };
  return { rolesConfig };
};

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ element }) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  const { rolesConfig } = rolesFor();
  const userRole = user?.usrlvl;
  useAxiosInterceptors();

  const { minimized } = useMinimizeDrawer();

  React.useEffect(() => {
    const delayedRender = debounce(() => {
      setShouldRender(true);
    }, 300);
    delayedRender();
    return () => {
      delayedRender.cancel();
    };
  }, []);

  const isAuthenticated = useMemo(() => {
    const allowedRoutes =
      rolesConfig[userRole as keyof typeof rolesConfig] || [];
    return allowedRoutes.includes(location.pathname);
  }, [userRole, location.pathname, rolesConfig]);

  return isAuthenticated ? (
    <LSTVPageRootStyle minimized={minimized}>{element}</LSTVPageRootStyle>
  ) : location.pathname === "/null" ? (
    <LSTVPageRootStyle minimized={minimized}>{element}</LSTVPageRootStyle>
  ) : (
    <>
      {shouldRender && (
        <LSTVPageRootStyle minimized={minimized}>
          <PageNoAccess />
        </LSTVPageRootStyle>
      )}
    </>
  );
};

export default PrivateRoutes;
