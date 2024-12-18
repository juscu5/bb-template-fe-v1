import { styled } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import { use_FetchRoutes, use_MouseHandles } from "../../../hooks/itemList";
import { useNavigate } from "react-router-dom";

const Nested = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));

const NestedSecondLevel = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(8),
}));

export function ItemList() {
  const { isError, isFetched, isLoading, error, account, data } =
    use_FetchRoutes();
  const {
    handleClick,
    handleMouseLeave,
    handleClickSecondLevel,
    open,
    openSecondLevel,
  } = use_MouseHandles();

  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      onMouseLeave={handleMouseLeave}
      style={{ overflow: "hidden" }}
    >
      {data &&
        data.map((side: any) => (
          <Box key={side.id} sx={{ cursor: "pointer" }}>
            <ListItem onClick={() => handleClick(side.label)}>
              <ListItemIcon>{side.icon}</ListItemIcon>
              <ListItemText
                primary={side.label}
                onClick={() => {
                  navigate(side.menprg);
                }}
              />
              {side.items && (
                <>{open === side.label ? <ExpandLess /> : <ExpandMore />}</>
              )}
            </ListItem>

            <Collapse in={open === side.label} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {side.items?.map((subItem: any) => (
                  <Nested
                    key={subItem.id}
                    onClick={() => handleClickSecondLevel(subItem.label)}
                  >
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    <ListItemText
                      primary={subItem.label}
                      onClick={() => {
                        navigate(subItem.menprg);
                      }}
                    />
                    {subItem.items ? (
                      openSecondLevel === subItem.label ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : null}
                  </Nested>
                ))}

                {side.items?.map((subItem: any) =>
                  subItem.items ? (
                    <Collapse
                      key={subItem.id}
                      in={openSecondLevel === subItem.label}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {subItem.items.map((nestedItem: any) => (
                          <NestedSecondLevel key={nestedItem.id}>
                            <ListItemIcon>{nestedItem.icon}</ListItemIcon>
                            <ListItemText
                              primary={nestedItem.label + "xxxxx"}
                            />
                          </NestedSecondLevel>
                        ))}
                      </List>
                    </Collapse>
                  ) : null
                )}
              </List>
            </Collapse>
          </Box>
        ))}
    </List>
  );
}
