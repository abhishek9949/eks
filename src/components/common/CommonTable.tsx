import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  TableSortLabel,
  Skeleton,
} from "@mui/material";
import { TableProps } from "@/types/table";

const CommonTable = <T extends { [key: string]: any }>({
  columns,
  data,
  rowsPerPage,
  page,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  enableSelection = false,
  sortColumn,
  sortDirection,
  onSortChange,
  selectedRows,
  setSelectedRows,
  loading = false,
}: TableProps<T>) => {
  /**
   * Handle row selection
   *
   * To use this feature just create a state as defined below in your parent component
   * const [selectedRows, setSelectedRows] = useState([]);
   */
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(data);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (row: T) => {
    const isSelected = selectedRows?.find(
      (selected) => selected?.id === row?.id,
    );
    const newSelectedRows = isSelected
      ? selectedRows?.filter((selected) => selected?.id !== row?.id)
      : [...(selectedRows ?? []), row];

    setSelectedRows(newSelectedRows);
  };

  const isAllSelected =
    selectedRows?.length === data?.length && data?.length > 0;
  const isIndeterminate =
    selectedRows &&
    selectedRows?.length > 0 &&
    selectedRows?.length < data?.length;

  const isRowSelected = (row: T) =>
    selectedRows?.some((selected) => selected?.id === row?.id);

  /**
   * Handle sort
   */

  const handleSortChange = (field: string) => {
    const isAsc = sortColumn === field && sortDirection === "asc";
    if (onSortChange) {
      onSortChange(field, isAsc ? "desc" : "asc");
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead className="bg-blue-light-6">
            <TableRow>
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns?.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  sortDirection={
                    sortColumn === column.field ? sortDirection : false
                  }
                >
                  {column?.isSortable ? (
                    <TableSortLabel
                      active={sortColumn === column.field}
                      direction={
                        sortColumn === column.field
                          ? (sortDirection as "asc" | "desc")
                          : "asc"
                      }
                      onClick={() => handleSortChange(column.field)}
                    >
                      <b>{column.label}</b>
                    </TableSortLabel>
                  ) : (
                    <b>{column.label}</b>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                {enableSelection && (
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={24} height={24} />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    <Skeleton variant="text" width="80%" height={24} />
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              (() => {
                if (data?.length === 0) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (enableSelection ? 1 : 0)}
                        align="center"
                      >
                        <b>No data available</b>
                      </TableCell>
                    </TableRow>
                  );
                }

                return data?.map((row, rowIndex) => (
                  <TableRow key={rowIndex + 1} hover>
                    {enableSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isRowSelected(row)}
                          onChange={() => handleSelectRow(row)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || "left"}
                      >
                        {column.render
                          ? column.render(row[column.field as keyof T], row)
                          : row[column.field as keyof T]}
                      </TableCell>
                    ))}
                  </TableRow>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        disabled={loading}
      />
    </>
  );
};

export default CommonTable;
