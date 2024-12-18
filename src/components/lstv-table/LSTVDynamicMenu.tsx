import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ActionElement } from "../../models";

interface LSTVDynamicMenuProps {
  actionElements: ActionElement[];
  row: any;
}

export const LSTVDynamicMenu = (props: LSTVDynamicMenuProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {props.actionElements.map((elem: ActionElement) => (
          <MenuItem
            sx={{ color: "text.secondary" }}
            onClick={() => {
              if (elem) elem?.callback?.(props.row);
            }}
          >
            <ListItemIcon>
              <Icon icon={elem.icon} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={elem.label}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
