import * as React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { use_FetchRoutes, use_FetchRoutesWithUser } from "../hooks/itemList";
import BpCheckbox from "../../assets/BpCheckbox";
import { enqueueSnackbar } from "notistack";

//Grid
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useHandles } from "@/store/useCallbackStore";
import { debounce } from "lodash";

interface UserAccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UserAccessDialog({
  open,
  setOpen,
}: UserAccessDialogProps) {
  const { selectedData, setSelectedData } = useHandles();
  const { data: data2 } = use_FetchRoutes();
  const { data } = use_FetchRoutesWithUser(
    selectedData!.usrcde,
    selectedData!.usrlvl
  );
  const { account } = useAccountStore();
  const dataMenuIni = React.useMemo(() => data2 ?? [], [data2]);
  const dataMenu = React.useMemo(() => data ?? [], [data]);
  const [isPending, startTransition] = React.useTransition();

  const { BpIcon, BpCheckedIcon } = BpCheckbox();

  const [checkedAll, setCheckedAll] = React.useState<boolean>(false);
  const [checkedMenu, setCheckedMenu] = React.useState<any[]>([]);
  const [checkedSubmenu1, setCheckedSubMenu1] = React.useState<any[]>([]);
  const [checkedSubmenu2, setCheckedSubMenu2] = React.useState<any[]>([]);

  React.useEffect(() => {
    const debouncedMenuIni = debounce(() => {
      menuIni();
      checkedIni();
    }, 300);
    debouncedMenuIni();
  }, [dataMenuIni, dataMenu]);

  // #region Initialize All Menus
  const menuIni = () => {
    // Initialize checkedMenu pattern using setState
    startTransition(() => {
      setCheckedMenu(
        dataMenuIni.map((data: any) => ({
          label: data.label,
          mengrp: data.mengrp,
          mensub: data.mensub,
          menidx: data.menidx,
          modcde: data.modcde,
          mennum: data.mennum,
          menprg: data.menprg,
          menico: data.menico,
          checked: false,
          items: data.items?.length,
        }))
      );
    });

    startTransition(() => {
      // Initialize submenu1 pattern using setState
      setCheckedSubMenu1(
        dataMenuIni.reduce((acc: any, data: any) => {
          if (data.items && Array.isArray(data.items)) {
            acc.push(
              ...data.items.map((dataSub1: any) => ({
                label: dataSub1.label,
                mengrp: dataSub1.mengrp,
                mensub: dataSub1.mensub,
                menidx: dataSub1.menidx,
                modcde: dataSub1.modcde,
                mennum: dataSub1.mennum,
                menprg: dataSub1.menprg,
                menico: dataSub1.menico,
                checked: false,
                items: dataSub1.items?.length,
              }))
            );
          }
          return acc;
        }, [])
      );
    });

    startTransition(() => {
      // Initialize checkedSubMenu2 pattern using setState
      setCheckedSubMenu2(
        dataMenuIni.reduce((acc: any, data: any) => {
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((dataSub1: any) => {
              if (dataSub1.items && Array.isArray(dataSub1.items)) {
                acc.push(
                  ...dataSub1.items.map((dataSub2: any) => ({
                    label: dataSub2.label,
                    mengrp: dataSub2.mengrp,
                    mensub: dataSub2.mensub,
                    menidx: dataSub2.menidx,
                    modcde: dataSub2.modcde,
                    mennum: dataSub2.mennum,
                    menprg: dataSub2.menprg,
                    menico: dataSub2.menico,
                    checked: false,
                    items: {
                      Add: {
                        status: dataSub2.add,
                        checked: false,
                      },
                      Edit: {
                        status: dataSub2.edit,
                        checked: false,
                      },
                      Delete: {
                        status: dataSub2.delete,
                        checked: false,
                      },
                      View: {
                        status: dataSub2.view,
                        checked: false,
                      },
                      Print: {
                        status: dataSub2.print,
                        checked: false,
                      },
                      Layout: {
                        status: dataSub2.lay,
                        checked: false,
                      },
                      Export: {
                        status: dataSub2.export,
                        checked: false,
                      },
                      Cancel: {
                        status: dataSub2.cancel,
                        checked: false,
                      },
                    },
                  }))
                );
              }
            });
          }
          return acc;
        }, [])
      );
    });
  };
  // #endregion

  // #region Initialize Checked States
  const checkedIni = () => {
    startTransition(() => {
      // CheckedMenu set checked change base on User came from API
      setCheckedMenu((prevCheckedMenu) => {
        const existingItemsMap = new Map(
          prevCheckedMenu
            .filter((item: any) => item !== null && item.menidx !== null)
            .map((item: any) => [item.menidx, item])
        );

        const newItems = dataMenu.map((data: any) => {
          const existingItem = existingItemsMap.get(data.menidx);
          return existingItem
            ? { ...existingItem, checked: true }
            : { ...data, checked: true };
        });
        const combinedItems = [...prevCheckedMenu];

        newItems.forEach((newItem: any) => {
          const index = combinedItems.findIndex(
            (item: any) => item.menidx === newItem.menidx
          );
          if (index !== -1) {
            combinedItems[index] = newItem;
          } else {
            combinedItems.push(newItem);
          }
        });

        return combinedItems;
      });
    });

    startTransition(() => {
      // setCheckedSubMenu1 set checked change base on User came from API
      setCheckedSubMenu1((prevCheckedSubMenu1) => {
        const existingItemsMap = new Map(
          prevCheckedSubMenu1
            .filter((item: any) => item !== null && item.menidx !== null)
            .map((item: any) => [item.menidx, item])
        );

        const newItems = dataMenu.reduce((acc: any, data: any) => {
          if (data.items && Array.isArray(data.items)) {
            acc.push(
              ...data.items.map((dataSub1: any) => {
                const existingItem = existingItemsMap.get(dataSub1.menidx);
                return existingItem
                  ? { ...existingItem, checked: true }
                  : { ...dataSub1, checked: true };
              })
            );
          }
          return acc;
        }, []);

        const combinedItems = [...prevCheckedSubMenu1];

        newItems.forEach((newItem: any) => {
          const index = combinedItems.findIndex(
            (item: any) => item.menidx === newItem.menidx
          );
          if (index !== -1) {
            combinedItems[index] = newItem;
          } else {
            combinedItems.push(newItem);
          }
        });

        return combinedItems;
      });
    });

    startTransition(() => {
      // setCheckedSubMenu2 and its item checked state change base on User came from API
      setCheckedSubMenu2((prevCheckedSubMenu2) => {
        const existingItemsMap = new Map(
          prevCheckedSubMenu2
            .filter((item: any) => item !== null && item.menidx !== null)
            .map((item: any) => [item.menidx, item])
        );

        const newItems = dataMenu.reduce((acc: any, data: any) => {
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((dataSub1: any) => {
              if (dataSub1.items && Array.isArray(dataSub1.items)) {
                acc.push(
                  ...dataSub1.items.map((dataSub2: any) => {
                    const existingItem = existingItemsMap.get(dataSub2.menidx);
                    return {
                      ...existingItem,
                      checked: true,
                      items: {
                        Add: {
                          status: existingItem?.items?.Add.status,
                          checked: dataSub2.add === 1 ? true : false,
                        },
                        Edit: {
                          status: existingItem?.items?.Edit.status,
                          checked: dataSub2.edit === 1 ? true : false,
                        },
                        Delete: {
                          status: existingItem?.items?.Delete.status,
                          checked: dataSub2.delete === 1 ? true : false,
                        },
                        View: {
                          status: existingItem?.items?.View.status,
                          checked: dataSub2.view === 1 ? true : false,
                        },
                        Print: {
                          status: existingItem?.items?.Print.status,
                          checked: dataSub2.print === 1 ? true : false,
                        },
                        Layout: {
                          status: existingItem?.items?.Layout.status,
                          checked: dataSub2.lay === 1 ? true : false,
                        },
                        Export: {
                          status: existingItem?.items?.Export.status,
                          checked: dataSub2.export === 1 ? true : false,
                        },
                        Cancel: {
                          status: existingItem?.items?.Cancel.status,
                          checked: dataSub2.cancel === 1 ? true : false,
                        },
                      },
                    };
                  })
                );
              }
            });
          }
          return acc;
        }, []);

        const combinedItems = [...prevCheckedSubMenu2];

        newItems.forEach((newItem: any) => {
          const index = combinedItems.findIndex(
            (item: any) => item.menidx === newItem.menidx
          );
          if (index !== -1) {
            combinedItems[index] = newItem;
          } else {
            combinedItems.push(newItem);
          }
        });

        return combinedItems;
      });
    });
  };
  // #endregion

  // #region handleCheckAll
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    const updatedMenuState = checkedMenu.map((menu: any, idxMenu: number) => ({
      ...menu,
      checked,
    }));

    const updateSubMenu1State = checkedSubmenu1.map((submenu1: any) => ({
      ...submenu1,
      checked,
    }));

    const updateSubMenu2State = checkedSubmenu2.map((submenu2: any) => ({
      ...submenu2,
      checked,
      items: Object.keys(submenu2.items).reduce((acc: any, key: string) => {
        acc[key] = {
          ...submenu2.items[key],
          checked,
        };
        return acc;
      }, {}),
    }));

    setCheckedAll(checked);
    setCheckedMenu(updatedMenuState);
    setCheckedSubMenu1(updateSubMenu1State);
    setCheckedSubMenu2(updateSubMenu2State);
  };
  // #endregion

  // #region handleMenu
  const handleMenu = React.useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      mensub: string,
      idx: number
    ) => {
      const checked = event.target.checked;

      const updatedMenuState = checkedMenu.map((menu: any, idxMenu: number) =>
        idx === idxMenu
          ? {
              ...menu,
              checked,
            }
          : menu
      );

      const updateSubMenu1State = checkedSubmenu1.map((submenu1: any) =>
        mensub === submenu1.mengrp
          ? {
              ...submenu1,
              checked,
            }
          : submenu1
      );

      const updateSubMenu2State = checkedSubmenu2.map((submenu2: any) => {
        const correspondingSubmenu1 = checkedSubmenu1.find(
          (submenu1) =>
            mensub === submenu1.mengrp && submenu1.mensub === submenu2.mengrp
        );
        return correspondingSubmenu1
          ? {
              ...submenu2,
              checked,
              items: Object.keys(submenu2.items).reduce(
                (acc: any, key: string) => {
                  acc[key] = {
                    ...submenu2.items[key],
                    checked,
                  };
                  return acc;
                },
                {}
              ),
            }
          : submenu2;
      });

      startTransition(() => {
        setCheckedMenu(updatedMenuState);
      });
      startTransition(() => {
        setCheckedSubMenu1(updateSubMenu1State);
      });
      startTransition(() => {
        setCheckedSubMenu2(updateSubMenu2State);
      });
    },
    [checkedMenu]
  );
  // #endregion

  // #region handleSubmenu1
  const handleSubmenu1 = React.useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      mengrp: string,
      mensub: string,
      idx: number
    ) => {
      const checked = event.target.checked;

      // Update checkedSubmenu1
      const updatedSubMenu1 = checkedSubmenu1.map(
        (submenu1: any, idxSub1: number) =>
          idx === idxSub1 ? { ...submenu1, checked } : submenu1
      );

      // Update checkedSubmenu2
      const updatedSubMenu2 = checkedSubmenu2.map((submenu2: any) =>
        mensub === submenu2.mengrp
          ? {
              ...submenu2,
              checked,
              items: Object.keys(submenu2.items).reduce(
                (acc: any, key: string) => {
                  acc[key] = {
                    ...submenu2.items[key],
                    checked,
                  };
                  return acc;
                },
                {}
              ),
            }
          : submenu2
      );

      // Update checkedMenu
      const updatedMenu = checkedMenu.map((menu: any) => {
        const correspondingSubMenu1 = updatedSubMenu1.filter(
          (submenu1) => menu.mensub === submenu1.mengrp
        );

        const anyChecked = correspondingSubMenu1.some(
          (submenu1) => submenu1.checked
        );

        if (correspondingSubMenu1.length > 0) {
          return {
            ...menu,
            checked: anyChecked,
          };
        }
        return menu;
      });

      startTransition(() => {
        setCheckedMenu(updatedMenu);
      });
      startTransition(() => {
        setCheckedSubMenu1(updatedSubMenu1);
      });
      startTransition(() => {
        setCheckedSubMenu2(updatedSubMenu2);
      });
    },
    [checkedSubmenu1]
  );
  // #endregion

  // #region handleSubmenu2
  const handleSubmenu2 = React.useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      mengrp: string,
      mensub: string,
      idx: number
    ) => {
      const checked = event.target.checked;

      // Update checkedSubmenu2
      const updatedSubMenu2 = checkedSubmenu2.map(
        (submenu2: any, idxSub2: number) =>
          idx === idxSub2
            ? {
                ...submenu2,
                checked,
                items: Object.keys(submenu2.items).reduce(
                  (acc: any, key: string) => {
                    acc[key] = {
                      ...submenu2.items[key],
                      checked,
                    };
                    return acc;
                  },
                  {}
                ),
              }
            : submenu2
      );

      // Update checkedSubmenu1 on any checkedSubmenu2 checked
      const updatedSubMenu1 = checkedSubmenu1.map((submenu1: any) => {
        if (submenu1.mensub === mengrp) {
          const correspondingSubMenu2 = updatedSubMenu2.filter(
            (submenu2) => submenu1.mensub === submenu2.mengrp
          );

          const subMenu1Checked = correspondingSubMenu2.some(
            (submenu2) => submenu2.checked
          );

          return {
            ...submenu1,
            checked: correspondingSubMenu2.length > 0 && subMenu1Checked,
          };
        }
        return submenu1;
      });

      // Update main menu state based on updated submenu 1 states
      const updatedMenu = checkedMenu.map((menu: any) => {
        const correspondingSubMenu1 = updatedSubMenu1.filter(
          (submenu1) => menu.mensub === submenu1.mengrp
        );

        const anyChecked = correspondingSubMenu1.some(
          (submenu1) => submenu1.checked
        );

        if (correspondingSubMenu1.length > 0) {
          return {
            ...menu,
            checked: anyChecked,
          };
        }
        return menu;
      });

      startTransition(() => {
        setCheckedMenu(updatedMenu);
      });
      startTransition(() => {
        setCheckedSubMenu1(updatedSubMenu1);
      });
      startTransition(() => {
        setCheckedSubMenu2(updatedSubMenu2);
      });
    },
    [checkedSubmenu2]
  );
  // #endregion

  // #region handleSubmenu2Items
  const handleSubmenu2Items = React.useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      mengrp: string,
      mensub: string,
      idx: number,
      itemKeyName: string
    ) => {
      const checked = event.target.checked;

      // Update checkedSubmenu2
      const updatedSubMenu2 = checkedSubmenu2.map(
        (submenu2: any, idxSub2: number) => {
          if (idx === idxSub2) {
            const updatedItems = {
              ...submenu2.items,
              [itemKeyName]: {
                ...submenu2.items[itemKeyName],
                checked,
              },
            };

            const anyItemChecked = Object.values(updatedItems).some(
              (item: any) => item.checked
            );

            return {
              ...submenu2,
              items: updatedItems,
              checked: anyItemChecked,
            };
          }
          return submenu2;
        }
      );

      // Update checkedSubmenu1 on any checkedSubmenu2 checked
      const updatedSubMenu1 = checkedSubmenu1.map((submenu1: any) => {
        if (submenu1.mensub === mengrp) {
          const correspondingSubMenu2 = updatedSubMenu2.filter(
            (submenu2) => submenu1.mensub === submenu2.mengrp
          );

          const subMenu1Checked = correspondingSubMenu2.some(
            (submenu2) => submenu2.checked
          );

          return {
            ...submenu1,
            checked: correspondingSubMenu2.length > 0 && subMenu1Checked,
          };
        }
        return submenu1;
      });

      // Update main menu state based on updated submenu 1 states
      const updatedMenu = checkedMenu.map((menu: any) => {
        const correspondingSubMenu1 = updatedSubMenu1.filter(
          (submenu1) => menu.mensub === submenu1.mengrp
        );

        const anyChecked = correspondingSubMenu1.some(
          (submenu1) => submenu1.checked
        );

        if (correspondingSubMenu1.length > 0) {
          return {
            ...menu,
            checked: anyChecked,
          };
        }
        return menu;
      });

      // const checkData = () => {
      //   const allSubMenu2ItemsChecked = checkedSubmenu2.every((submenu2) =>
      //     Object.values(submenu2.items).every(
      //       (item: any) => item.checked === true
      //     )
      //   );
      //   const allSubMenu2Checked = checkedSubmenu2.every(
      //     (submenu2) => submenu2.checked === true
      //   );
      //   const allSubMenu1Checked = checkedSubmenu1.every(
      //     (submenu1) => submenu1.checked === true
      //   );
      //   const allMenuChecked = checkedMenu.every((menu) => menu.checked === true);

      //   return (
      //     allSubMenu2ItemsChecked &&
      //     allSubMenu2Checked &&
      //     allSubMenu1Checked &&
      //     allMenuChecked
      //   );
      // };

      // setCheckedAll(!checkData());

      startTransition(() => {
        setCheckedMenu(updatedMenu);
      });
      startTransition(() => {
        setCheckedSubMenu1(updatedSubMenu1);
      });
      startTransition(() => {
        setCheckedSubMenu2(updatedSubMenu2);
      });
    },
    [checkedSubmenu2]
  );
  // #endregion

  // #region MenuMapping
  // Render menu and submenus
  const dialogMenuMapping = () => {
    return checkedMenu.map((data: any, idx: number) => {
      // Render submenu 1
      const renderSubMenu1 = () => {
        return checkedSubmenu1.map((dataSub1: any, idxSub1: number) => {
          // Render submenu 2
          const renderSubMenu2 = () => {
            return checkedSubmenu2.map((dataSub2: any, idxSub2: number) => {
              if (dataSub1.mensub === dataSub2.mengrp) {
                return (
                  <>
                    <Grid xs={12} container ml={4}>
                      <Grid xs={4} mr={20}>
                        <FormControlLabel
                          label={dataSub2.label}
                          key={idxSub2}
                          control={
                            <Checkbox
                              checked={
                                checkedSubmenu2[idxSub2]?.checked || false
                              }
                              disableRipple
                              color="default"
                              checkedIcon={<BpCheckedIcon />}
                              icon={<BpIcon />}
                              onChange={(event) =>
                                handleSubmenu2(
                                  event,
                                  dataSub2.mengrp,
                                  dataSub2.mensub,
                                  idxSub2
                                )
                              }
                            />
                          }
                        />
                      </Grid>
                      <Grid container ml={4}>
                        {Object.entries(dataSub2.items).map(
                          ([key, value], idxSub2Items) => {
                            const itemValue = value as {
                              status: number;
                              checked: boolean;
                            };
                            return itemValue.status === 1 ? (
                              <Grid
                                container
                                key={`item-${idxSub2}-${idxSub2Items}`}
                              >
                                <FormControlLabel
                                  label={key}
                                  control={
                                    <Checkbox
                                      disableRipple
                                      color="default"
                                      checkedIcon={<BpCheckedIcon />}
                                      icon={<BpIcon />}
                                      checked={
                                        checkedSubmenu2[idxSub2]?.items[key]
                                          .checked || false
                                      }
                                      onChange={(event) =>
                                        handleSubmenu2Items(
                                          event,
                                          dataSub2.mengrp,
                                          dataSub2.mensub,
                                          idxSub2,
                                          key
                                        )
                                      }
                                    />
                                  }
                                />
                              </Grid>
                            ) : (
                              <Grid container>
                                <FormControlLabel
                                  label={key}
                                  disabled
                                  sx={{ visibility: "hidden" }}
                                  control={
                                    <Checkbox
                                      disabled
                                      disableRipple
                                      color="default"
                                      checkedIcon={<BpCheckedIcon />}
                                      icon={<BpIcon />}
                                    />
                                  }
                                />
                              </Grid>
                            );
                          }
                        )}
                      </Grid>
                    </Grid>
                  </>
                );
              }
              return null;
            });
          };

          if (data.mensub === dataSub1.mengrp) {
            return (
              <Grid container xs={24} ml={4}>
                <FormControlLabel
                  label={dataSub1.label}
                  key={idxSub1}
                  control={
                    <Checkbox
                      disableRipple
                      color="default"
                      checkedIcon={<BpCheckedIcon />}
                      icon={<BpIcon />}
                      checked={checkedSubmenu1[idxSub1]?.checked || false}
                      onChange={(event) =>
                        handleSubmenu1(
                          event,
                          dataSub1.mengrp,
                          dataSub1.mensub,
                          idxSub1
                        )
                      }
                    />
                  }
                />
                {renderSubMenu2()}
              </Grid>
            );
          }
          return null;
        });
      };

      return (
        <>
          <Grid
            container
            xs={24}
            pb={2}
            pl={2}
            sx={{
              "--Grid-borderWidth": "1px",
              borderBottom: "var(--Grid-borderWidth) solid",
              borderLeft: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
            }}
          >
            <React.Fragment key={idx}>
              <FormControlLabel
                label={data.label}
                control={
                  <Checkbox
                    disableRipple
                    color="default"
                    checkedIcon={<BpCheckedIcon />}
                    icon={<BpIcon />}
                    checked={checkedMenu[idx]?.checked || false}
                    onChange={(event) => handleMenu(event, data.mensub, idx)}
                  />
                }
              />
              {renderSubMenu1()}
            </React.Fragment>
          </Grid>
        </>
      );
    });
  };
  // #endregion

  // #region handleSave
  const handleSave = async () => {
    const menu = checkedMenu
      .filter((menu: any) => menu.checked)
      .map((menu: any) => ({
        usrcde: selectedData!.usrcde,
        mencap: menu.label,
        mengrp: menu.mengrp,
        menidx: menu.menidx,
        mensub: menu.mensub,
        menprg: menu.menprg === "null" ? null : menu.menprg,
        modcde: menu.modcde,
        mennum: menu.mennum,
        menico: menu.menico,
        temp_menidx: menu.mennum,
        is_active: 1,
      }));
    const submenu1 = checkedSubmenu1
      .filter((submenu1: any) => submenu1.checked)
      .map((submenu1: any) => ({
        usrcde: selectedData!.usrcde,
        mencap: submenu1.label,
        mengrp: submenu1.mengrp,
        menidx: submenu1.menidx,
        mensub: submenu1.mensub,
        menprg: submenu1.menprg === "null" ? null : submenu1.menprg,
        modcde: submenu1.modcde,
        mennum: submenu1.mennum,
        menico: submenu1.menico,
        temp_menidx: submenu1.mennum,
        is_active: 1,
      }));
    const submenu2 = checkedSubmenu2
      .filter((submenu2: any) => submenu2.checked)
      .map((submenu2: any) => ({
        usrcde: selectedData!.usrcde,
        mencap: submenu2.label,
        mengrp: submenu2.mengrp,
        menidx: submenu2.menidx,
        mensub: submenu2.mensub,
        menprg: submenu2.menprg === "null" ? null : submenu2.menprg,
        modcde: submenu2.modcde,
        mennum: submenu2.mennum,
        menico: submenu2.menico,
        temp_menidx: submenu2.mennum,
        has_add: submenu2.items.Add.checked ? 1 : null,
        has_cancel: submenu2.items.Cancel.checked ? 1 : null,
        has_delete: submenu2.items.Delete.checked ? 1 : null,
        has_edit: submenu2.items.Edit.checked ? 1 : null,
        has_export: submenu2.items.Export.checked ? 1 : null,
        has_lay: submenu2.items.Layout.checked ? 1 : null,
        has_print: submenu2.items.Print.checked ? 1 : null,
        has_view: submenu2.items.View.checked ? 1 : null,
        is_active: 1,
      }));
    const gatherData = [...menu, ...submenu1, ...submenu2];
    try {
      const res = await ApiService.delete(`usermenus/${selectedData!.usrcde}`, {
        headers: { Authorization: `Bearer ${account}` },
      });
    } catch (e) {
      console.log(e);
    }
    try {
      const res = await ApiService.post("usermenus", gatherData, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setOpen(false);
        enqueueSnackbar(`User ${selectedData!.usrcde} access save!`, {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } else {
        setOpen(false);
        enqueueSnackbar(`User ${selectedData!.usrcde} access not save!`, {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
    } catch (e) {
      setOpen(false);
      enqueueSnackbar(`Error: ${e}`, {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };
  // #endregion

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      maxWidth="xl"
    >
      <DialogTitle id="form-dialog-title">User Access Dialog</DialogTitle>
      <DialogContent>
        <FormGroup>
          {selectedData!.usrlvl === "Supervisor" ? (
            <Typography>Can't Edit Supervisor</Typography>
          ) : selectedData!.usrlvl === "User" ? (
            <>
              <Box>
                <Grid container ml={1} mt={2} columns={24}>
                  <FormControlLabel
                    label={"Check All"}
                    control={
                      <Checkbox
                        disableRipple
                        color="default"
                        checkedIcon={<BpCheckedIcon />}
                        icon={<BpIcon />}
                        checked={checkedAll || false}
                        onChange={(event) => handleCheckAll(event)}
                      />
                    }
                  />
                </Grid>
              </Box>
              <Box ml={1.7} mt={1}>
                <Grid container columns={24}>
                  {dialogMenuMapping()}
                </Grid>
              </Box>
            </>
          ) : null}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleSave()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
