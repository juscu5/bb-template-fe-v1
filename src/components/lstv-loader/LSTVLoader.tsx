import {CircularProgress, styled } from "@mui/material";


const LoaderStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: '100%',
    width: '98%'
}));

interface LSTVLoaderProps {
    message: string;
}

export const LSTVLoader = (props: LSTVLoaderProps) => {
    return (
        <LoaderStyle>  
            <CircularProgress color="success" />
        </LoaderStyle>
    );

}

