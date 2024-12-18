
import { applySortFilter, getComparator } from "@/utils/filteringName";
import { useState } from "react";
// import USER_LIST from '@/_mocks_/user';

export const use_LSTVTableHooks = <T> (tableData: T[]) => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState<T[]>([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: any) => {
        if (event.target.checked) {
            setSelected(tableData);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: any, name: any) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: T[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event: any) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

    const filteredData = applySortFilter(tableData, getComparator(order, orderBy), filterName);

    const isDataNotFound = tableData.length === 0;


    return {
        selected,
        filterName,
        order,
        orderBy,
        filteredData,
        page,
        rowsPerPage,
        emptyRows,
        isDataNotFound,
        handleFilterByName,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleChangeRowsPerPage,
        handleChangePage
    }

}