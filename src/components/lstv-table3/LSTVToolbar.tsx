import React from 'react';

import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import { styled } from '@mui/material/styles';
import {
    Box,
    Toolbar,
    Tooltip,
    IconButton,
    Typography,
    OutlinedInput,
    InputAdornment
} from '@mui/material';

const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320 },
    '& fieldset': {
        borderWidth: '1px !important',
        borderColor: `${theme.palette.grey[500]} !important`
    }
}));

interface LSTVToolbarProps {
    numSelected: number;
    filterName: string;
    placeholder: string;
    onFilterName: any;
}

export const LSTVToolbar = (props: LSTVToolbarProps): JSX.Element => {
    const { numSelected, filterName, onFilterName, placeholder } = props;
    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <SearchStyle
                    value={filterName}
                    onChange={onFilterName}
                    placeholder={placeholder}
                    startAdornment={
                        <InputAdornment position="start">
                            <Box
                                component={Icon}
                                icon={searchFill}
                                sx={{ color: 'text.disabled' }}
                            />
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <Icon icon={trash2Fill} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Icon icon={roundFilterList} />
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
};
