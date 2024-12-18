import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ApiService } from "@/services";
import { useQuery } from "react-query";
import { useAccountStore } from "@/store/useStore";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";

interface UserAccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogType: string | null;
  selectedData: { [T: string]: any } | null;
}

export const UserAccessDialog = ({
  open,
  setOpen,
  dialogType,
  selectedData,
}: UserAccessDialogProps) => {
  const { account } = useAccountStore();

  const { data, refetch } = useQuery<any>(
    "menus",
    async () =>
      await ApiService.get("menus", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );
  const dataMenu = data?.data?.payload ?? [];

  const [checkedMenu, setCheckedMenu] = useState<any[]>(
    dataMenu.map((data: any, idx: number) => ({
      idx: idx,
      menidx: data.menidx,
      checked: false,
      submen: [],
    }))
  );

  useEffect(() => {
    checkMenuIni();
  }, [dataMenu]);

  const checkMenuIni = () => {
    setCheckedMenu(
      dataMenu.map((data: any, idx: number) => ({
        idx: idx,
        menidx: data.menidx,
        checked: false,
      }))
    );
  };

  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    menidx: string
  ) => {
    let len = menidx.length;
    let menid = menidx;
    let menSubMenu = menidx.slice(0, 3);
    let updatedCheckedMenu = [...checkedMenu];

    while (len >= 5) {
      len = len - 3;
      let menSubMenu2 = menid.slice(0, len);

      updatedCheckedMenu = updatedCheckedMenu.map((data: any) =>
        menSubMenu2 === data.menidx ||
        menidx === data.menidx ||
        menSubMenu === data.menidx
          ? {
              ...data,
              checked: event.target.checked,
            }
          : data
      );
    }

    setCheckedMenu(updatedCheckedMenu);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dialogFormMapping = () => {
    return dataMenu.map((data: any, idx: number) => {
      const calculatedValue = (data.menidx.toString().length - 2) / 3;

      const child = () => {
        let text: JSX.Element[] = [];
        for (let i = 0; i < calculatedValue; i++) {
          text.push(
            <React.Fragment key={i}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </React.Fragment>
          );
        }
        return <>{text}</>;
      };

      // const isAnySubMenuChecked = checkedSubMenu[idx]?.some(
      //   (checked: any) => checked
      // );
      // const isEverySubMenuChecked = checkedSubMenu[idx]?.every(
      //   (checked: any) => checked
      // );
      // const isIndeterminate = isAnySubMenuChecked && !isEverySubMenuChecked;

      return (
        <>
          {calculatedValue === 0 ? (
            <>
              <br />
            </>
          ) : (
            ""
          )}
          <FormControlLabel
            key={data.menidx}
            id={data.menidx}
            name={data.menidx}
            control={
              <>
                {child()}
                <Checkbox
                  checked={checkedMenu[idx]?.checked || false}
                  // indeterminate={true}
                  onChange={(event) => handleCheck(event, data.menidx)}
                />
              </>
            }
            label={data.menidx}
          />
        </>
      );
    });
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          sx: {
            width: "70%",
          },
        }}
      >
        <DialogTitle>{dialogType}</DialogTitle>

        <DialogContent>
          <DialogContentText>User Access Dialog</DialogContentText>
          <FormGroup>{dialogFormMapping()}</FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button type="submit">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
