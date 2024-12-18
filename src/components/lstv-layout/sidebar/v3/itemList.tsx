import { styled } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import {
  Box,
  Divider,
  ListItemButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { use_FetchRoutes, use_MouseHandles } from "../../../hooks/itemList";
import { useNavigate } from "react-router-dom";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "auto",
  paddingRight: theme.spacing(1),
}));

const func = () => {
  const { handleClick, handleMouseLeave, handleClickSecondLevel, setItems2 } =
    use_MouseHandles();
  return {
    handleClick,
    handleMouseLeave,
    handleClickSecondLevel,
    setItems2,
  };
};

export interface ItemListFirstProps<T> {
  open: boolean;
  setItems: any;
  setOpen: (setOpen: boolean) => void;
  minimize?: boolean;
}

export function ItemListFirst<T extends any[]>({
  open,
  setItems,
  setOpen,
  minimize,
}: ItemListFirstProps<T>) {
  const { isError, isLoading, error, data } = use_FetchRoutes();
  const navigate = useNavigate();
  const { handleMouseLeave } = func();

  const [openId, setOpenId] = React.useState<number | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const onOpen = (items: any, id: number) => {
    setItems(items);

    if (openId === id) {
      setOpenId(null);
      setOpen(false);
    } else {
      setOpenId(id);
      setOpen(true);
    }
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      onMouseLeave={handleMouseLeave}
      style={{ overflow: "hidden", marginLeft: 12, marginRight: 12 }}
    >
      {data &&
        data.map((side: any, idx: number) => {
          const icon = (
            <StyledListItemIcon
              aria-labelledby="test"
              sx={{ mr: 2.5, justifyContent: "center" }}
              children={side.icon}
            />
          );

          return (
            <Box key={idx} sx={{ cursor: "pointer" }}>
              <ListItemButton
                dense
                sx={{
                  width: "100%",
                  mt: 0.5,
                  mb: 0.5,

                  bgcolor:
                    openId === idx && open
                      ? "rgba(0, 0, 0, 0.1)"
                      : "Background.default",
                }}
                onClick={
                  side && side.items
                    ? () => onOpen(side.items, idx)
                    : side.menprg
                    ? () => navigate(side.menprg)
                    : () => setOpen(false)
                }
              >
                {minimize ? (
                  <Tooltip
                    title={side.label}
                    placement="right"
                    children={icon}
                  />
                ) : (
                  icon
                )}

                {!minimize && (
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        fontFamily="Poppins"
                        sx={{
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          transition: "all 0.3s ease",
                          opacity: 1,
                          wordWrap: "break-word",
                        }}
                      >
                        {side.label}
                      </Typography>
                    }
                  />
                )}
                {!minimize && side.items && (
                  <>
                    {openId === idx && open ? (
                      <ArrowLeft fontSize="small" />
                    ) : (
                      <ArrowRight fontSize="small" />
                    )}
                  </>
                )}
              </ListItemButton>
            </Box>
          );
        })}
    </List>
  );
}

export interface ItemListSecondProps<T> {
  items: any;
  open: boolean;
  setOpen: (setOpen: boolean) => void;
  setItems: any;
}

export function ItemListSecond<T extends any[]>({
  items,
  open,
  setOpen,
  setItems,
}: ItemListSecondProps<T>) {
  const { isError, isLoading, error } = use_FetchRoutes();
  const navigate = useNavigate();

  const [openId, setOpenId] = React.useState<number | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const onOpen = (items: any, id: number) => {
    setItems(items);

    if (openId === id) {
      setOpenId(null);
      setOpen(false);
    } else {
      setOpenId(id);
      setOpen(true);
    }
  };

  return (
    <List component="nav" aria-labelledby="nested-list-subheader">
      {items &&
        items.map((side: any, idx: number) => (
          <React.Fragment key={idx}>
            <ListItemButton
              dense
              sx={{
                width: "100%",
                bgcolor:
                  openId === idx && open
                    ? "rgba(0, 0, 0, 0.1)"
                    : "Background.default",
                justifyContent: "center",
                mt: 0.5,
                mb: 0.5,
              }}
              onClick={
                side && side.items
                  ? () => onOpen(side.items, idx)
                  : side.menprg
                  ? () => navigate(side.menprg)
                  : () => setOpen(false)
              }
            >
              <ListItemIcon sx={{ marginLeft: "5px" }}>
                {side.icon}
              </ListItemIcon>
              <ListItemText
                sx={{ marginLeft: "-15px" }}
                primary={
                  <Typography
                    variant="subtitle2"
                    fontFamily="Poppins"
                    sx={{
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordWrap: "break-word",
                    }}
                  >
                    {side.label}
                  </Typography>
                }
              />
              {side.items && (
                <>
                  {openId === idx && open ? (
                    <ArrowLeft fontSize="small" />
                  ) : (
                    <ArrowRight fontSize="small" />
                  )}
                </>
              )}
            </ListItemButton>
          </React.Fragment>
        ))}
    </List>
  );
}

export interface ItemListThirdProps<T> {
  items?: any;
  id?: any;
  label?: string;
  menprg?: string;
  header?: string;
}

export const ItemLayout = <T extends any[]>({
  items,
  id,
  label,
  menprg,
  header,
}: ItemListThirdProps<T>) => {
  const { handleClick } = use_MouseHandles();
  const navigate = useNavigate();

  return (
    <React.Fragment key={id}>
      {header && (
        <ListItem
          dense
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <ListItemText
            sx={{ marginLeft: "10px" }}
            primary={
              <Typography
                variant="caption"
                fontFamily="Poppins"
                sx={{
                  whiteSpace: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "600",
                }}
              >
                {header}
              </Typography>
            }
          />
        </ListItem>
      )}
      <ListItemButton
        dense
        onClick={
          items
            ? () => handleClick(label!)
            : () => {
                navigate(menprg!);
              }
        }
      >
        <ListItemIcon sx={{ marginLeft: "-40px" }} />
        <ListItemText
          sx={{ marginRight: "20px" }}
          primary={
            <Typography
              variant="caption"
              fontFamily="Poppins"
              sx={{
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordWrap: "break-word",
              }}
            >
              {label}
            </Typography>
          }
        />
      </ListItemButton>
    </React.Fragment>
  );
};

export function ItemList3_1<T extends any[]>({ items }: ItemListThirdProps<T>) {
  let lastHeader: string | null = null;
  let isFirstCol = true;

  const ItemList = items?.map((side: any, index: number) => {
    const shouldRenderHeader = side.menheader !== lastHeader;
    lastHeader = side.menheader;

    const isCol = side.mencol === "1";
    if (isCol) {
      if (isFirstCol) {
        isFirstCol = false;
        return (
          <React.Fragment key={side.id}>
            <ItemLayout
              items={side.items}
              id={side.id}
              label={side.label}
              menprg={side.menprg}
              header={shouldRenderHeader ? side.menheader : null}
            />
          </React.Fragment>
        );
      }
    }

    return (
      (side.mencol === "1" || side.mencol === null || side.mencol > 4) && (
        <React.Fragment key={side.id}>
          {shouldRenderHeader && <Divider sx={{ mt: 1.5, mb: 1.5 }} />}
          <ItemLayout
            items={side.items}
            id={side.id}
            label={side.label}
            menprg={side.menprg}
            header={shouldRenderHeader ? side.menheader : null}
          />
        </React.Fragment>
      )
    );
  });

  return <>{ItemList}</>;
}

export function ItemList3_2<T extends any[]>({ items }: ItemListThirdProps<T>) {
  let lastHeader: string | null = null;
  let isFirstCol = true;

  const ItemList = items?.map((side: any, index: number) => {
    const shouldRenderHeader = side.menheader !== lastHeader;
    lastHeader = side.menheader;

    const isCol = side.mencol === "2";
    if (isCol) {
      if (isFirstCol) {
        isFirstCol = false;
        return (
          <React.Fragment key={side.id}>
            <ItemLayout
              items={side.items}
              id={side.id}
              label={side.label}
              menprg={side.menprg}
              header={shouldRenderHeader ? side.menheader : null}
            />
          </React.Fragment>
        );
      }
    }

    return (
      side.mencol === "2" && (
        <React.Fragment key={side.id}>
          {shouldRenderHeader && <Divider sx={{ mt: 1.5, mb: 1.5 }} />}
          <ItemLayout
            items={side.items}
            id={side.id}
            label={side.label}
            menprg={side.menprg}
            header={shouldRenderHeader ? side.menheader : null}
          />
        </React.Fragment>
      )
    );
  });

  return <>{ItemList}</>;
}

export function ItemList3_3<T extends any[]>({ items }: ItemListThirdProps<T>) {
  let lastHeader: string | null = null;
  let isFirstCol = true;

  const ItemList = items?.map((side: any, index: number) => {
    const shouldRenderHeader = side.menheader !== lastHeader;
    lastHeader = side.menheader;

    const isCol = side.mencol === "3";
    if (isCol) {
      if (isFirstCol) {
        isFirstCol = false;
        return (
          <React.Fragment key={side.id}>
            <ItemLayout
              items={side.items}
              id={side.id}
              label={side.label}
              menprg={side.menprg}
              header={shouldRenderHeader ? side.menheader : null}
            />
          </React.Fragment>
        );
      }
    }

    return (
      side.mencol === "3" && (
        <React.Fragment key={side.id}>
          {shouldRenderHeader && <Divider sx={{ mt: 1.5, mb: 1.5 }} />}
          <ItemLayout
            items={side.items}
            id={side.id}
            label={side.label}
            menprg={side.menprg}
            header={shouldRenderHeader ? side.menheader : null}
          />
        </React.Fragment>
      )
    );
  });

  return <>{ItemList}</>;
}

export function ItemList3_4<T extends any[]>({ items }: ItemListThirdProps<T>) {
  let lastHeader: string | null = null;
  let isFirstCol = true;

  const ItemList = items?.map((side: any, index: number) => {
    const shouldRenderHeader = side.menheader !== lastHeader;
    lastHeader = side.menheader;

    const isCol = side.mencol === "4";
    if (isCol) {
      if (isFirstCol) {
        isFirstCol = false;
        return (
          <React.Fragment key={side.id}>
            <ItemLayout
              items={side.items}
              id={side.id}
              label={side.label}
              menprg={side.menprg}
              header={shouldRenderHeader ? side.menheader : null}
            />
          </React.Fragment>
        );
      }
    }

    return (
      side.mencol === "4" && (
        <React.Fragment key={side.id}>
          {shouldRenderHeader && <Divider sx={{ mt: 1.5, mb: 1.5 }} />}
          <ItemLayout
            items={side.items}
            id={side.id}
            label={side.label}
            menprg={side.menprg}
            header={shouldRenderHeader ? side.menheader : null}
          />
        </React.Fragment>
      )
    );
  });

  return <>{ItemList}</>;
}
