import { Button, IconButton, Snackbar } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';


interface LSTVSnackbarProps {
    message: string;
}

export const LSTVSnackbar = (props: LSTVSnackbarProps) => {

    const [state, setState] = React.useState<any>({
        open: true,
        vertical: 'top',
        horizontal: 'center',
    });
    
    const { vertical, horizontal, open } = state;
    
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    
    const action = (
        <>
          <Button color="secondary" size="small" onClick={handleClose}>
            Okay
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
    );


    return (
        <>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={5000}
                onClose={handleClose}
                message={props.message}
                action={action}
                key={vertical + horizontal}
            />
        </>
    );
}

