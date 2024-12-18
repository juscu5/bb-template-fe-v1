import { ApiService } from "@/services";
import { useAccountStore, useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getKeyIcon } from "@/models/dynamic";

// #region use_FetchRoutesWithUser
export const use_FetchRoutesWithUser = (usrcde: string, usrlvl: string) => {
  const [loadedData, setLoadedData] = useState<any>();
  const { account } = useAccountStore();

  const menus =
    usrlvl === "Supervisor" ? "routes" : usrlvl === "User" ? "usermenus" : "";

  const routes =
    usrlvl === "Supervisor"
      ? `menus/routes`
      : usrlvl === "User"
      ? `usermenus/${usrcde}`
      : "";

  const { isError, isFetched, data, isLoading, error } = useQuery<any>(
    [menus, usrcde, usrlvl],
    async () =>
      await ApiService.get(routes, {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  useEffect(() => {
    const modifyData = () => {
      const modified = data.data.payload.map((menu: any) => {
        const children = menu.subMenus;

        if (children.length == 0) {
          return {
            label: menu.mencap,
            menprg: `${menu.menprg}`,
            icon: getKeyIcon(menu.menico),
            mengrp: menu.mengrp,
            mensub: menu.mensub,
            menidx: menu.menidx,
            modcde: menu.modcde,
            mennum: menu.mennum,
            menico: menu.menico,
          };
        }

        const mappedChildren = children.map((men: any) => {
          const children2 = men.superSubmenus;

          if (children2.length == 0) {
            return {
              label: men.mencap,
              menprg: `${men.menprg}`,
              icon: getKeyIcon(men.menico),
              mengrp: men.mengrp,
              mensub: men.mensub,
              menidx: men.menidx,
              modcde: men.modcde,
              mennum: men.mennum,
              menico: men.menico,
            };
          }
          const mappedChildren2 = children2.map((menchild: any) => {
            return {
              label: menchild.mencap,
              menprg: `${menchild.menprg}`,
              icon: getKeyIcon(menchild.menico),
              mengrp: menchild.mengrp,
              mensub: menchild.mensub,
              menidx: menchild.menidx,
              modcde: menchild.modcde,
              mennum: menchild.mennum,
              menico: menchild.menico,
              add:
                usrlvl === "Supervisor" ? menchild.allow_add : menchild.has_add,
              edit:
                usrlvl === "Supervisor"
                  ? menchild.allow_edit
                  : menchild.has_edit,
              delete:
                usrlvl === "Supervisor"
                  ? menchild.allow_delete
                  : menchild.has_delete,
              view:
                usrlvl === "Supervisor"
                  ? menchild.allow_view
                  : menchild.has_view,
              print:
                usrlvl === "Supervisor"
                  ? menchild.allow_print
                  : menchild.has_print,
              lay:
                usrlvl === "Supervisor" ? menchild.allow_lay : menchild.has_lay,
              export:
                usrlvl === "Supervisor"
                  ? menchild.allow_export
                  : menchild.has_export,
              cancel:
                usrlvl === "Supervisor"
                  ? menchild.allow_cancel
                  : menchild.has_cancel,
            };
          });
          return {
            label: men.mencap,
            menprg: `${men.menprg}`,
            icon: getKeyIcon(men.menico),
            mengrp: men.mengrp,
            mensub: men.mensub,
            menidx: men.menidx,
            modcde: men.modcde,
            mennum: men.mennum,
            menico: men.menico,
            items: mappedChildren2,
          };
        });

        return {
          label: menu.mencap,
          menprg: `${menu.menprg}`,
          icon: getKeyIcon(menu.menico),
          mengrp: menu.mengrp,
          mensub: menu.mensub,
          menidx: menu.menidx,
          modcde: menu.modcde,
          mennum: menu.mennum,
          menico: menu.menico,
          items: mappedChildren,
        };
      });

      setLoadedData(modified);
    };
    if (data) {
      modifyData();
    }
  }, [data, error]);

  return {
    isError,
    isFetched,
    isLoading,
    error: error as any,
    account,
    data: loadedData,
  };
};

// #endregion

// #region use_FetchRoutes
export const use_FetchRoutes = () => {
  const [loadedData, setLoadedData] = useState<any>();
  const { account } = useAccountStore();
  const { user } = useAuthStore();

  const menus =
    user?.usrlvl === "Supervisor"
      ? "routes"
      : user?.usrlvl === "User"
      ? "usermenus"
      : "";

  const routes =
    user?.usrlvl === "Supervisor"
      ? `menus/routes`
      : user?.usrlvl === "User"
      ? `usermenus/${user.usrcde}`
      : "";

  const { isError, isFetched, data, isLoading, error } = useQuery<any>(
    menus,
    async () =>
      await ApiService.get(routes, {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  // TO MODIFY DATA AND MAKE IT SUITABLE FOR THE MENU

  useEffect(() => {
    const modifyData = () => {
      const modified = data.data.payload.map((menu: any) => {
        const children = menu.subMenus;

        if (children.length == 0) {
          return {
            label: menu.mencap,
            menprg: `${menu.menprg}`,
            icon: getKeyIcon(menu.menico),
            mengrp: menu.mengrp,
            mensub: menu.mensub,
            menidx: menu.menidx,
            modcde: menu.modcde,
            mennum: menu.mennum,
            menico: menu.menico,
          };
        }

        const mappedChildren = children.map((men: any) => {
          const children2 = men.superSubmenus;

          if (children2.length == 0) {
            return {
              label: men.mencap,
              menprg: `${men.menprg}`,
              icon: getKeyIcon(men.menico),
              mengrp: men.mengrp,
              mensub: men.mensub,
              menidx: men.menidx,
              modcde: men.modcde,
              mennum: men.mennum,
              menico: men.menico,
            };
          }
          const mappedChildren2 = children2.map((menchild: any) => {
            return {
              label: menchild.mencap,
              menprg: `${menchild.menprg}`,
              icon: getKeyIcon(menchild.menico),
              mengrp: menchild.mengrp,
              mensub: menchild.mensub,
              menidx: menchild.menidx,
              modcde: menchild.modcde,
              mennum: menchild.mennum,
              menico: menchild.menico,
              menheader: menchild.menheader,
              mencol: menchild.mencol,
              add:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_add
                  : menchild.has_add,
              edit:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_edit
                  : menchild.has_edit,
              delete:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_delete
                  : menchild.has_delete,
              view:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_view
                  : menchild.has_view,
              print:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_print
                  : menchild.has_print,
              lay:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_lay
                  : menchild.has_lay,
              export:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_export
                  : menchild.has_export,
              cancel:
                user?.usrlvl === "Supervisor"
                  ? menchild.allow_cancel
                  : menchild.has_cancel,
            };
          });
          return {
            label: men.mencap,
            menprg: `${men.menprg}`,
            icon: getKeyIcon(men.menico),
            mengrp: men.mengrp,
            mensub: men.mensub,
            menidx: men.menidx,
            modcde: men.modcde,
            mennum: men.mennum,
            menico: men.menico,
            items: mappedChildren2,
          };
        });

        return {
          label: menu.mencap,
          menprg: `${menu.menprg}`,
          icon: getKeyIcon(menu.menico),
          mengrp: menu.mengrp,
          mensub: menu.mensub,
          menidx: menu.menidx,
          modcde: menu.modcde,
          mennum: menu.mennum,
          menico: menu.menico,
          items: mappedChildren,
        };
      });

      setLoadedData(modified);
    };
    if (data) {
      modifyData();
    }
  }, [data, error]);

  return {
    isError,
    isFetched,
    isLoading,
    error: error as any,
    account,
    data: loadedData,
  };
};

// #endregion

// #region use_MouseHandles
export const use_MouseHandles = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [openSecondLevel, setOpenSecondLevel] = useState<string | null>(null);
  const [items2, setItems2] = useState<any | null>(null);
  const [items3, setItems3] = useState<any | null>(null);

  const handleClick = (item: string) => {
    setOpen(open === item ? null : item);
  };

  const handleMouseLeave = () => {
    setOpen(null);
    setOpenSecondLevel(null);
  };

  const handleClickSecondLevel = (item: string) => {
    setOpenSecondLevel(openSecondLevel === item ? null : item);
  };

  return {
    handleClick,
    handleMouseLeave,
    handleClickSecondLevel,
    open,
    openSecondLevel,
    items2,
    setItems2,
    items3,
    setItems3,
  };
};
// #endregion
