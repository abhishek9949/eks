import React from "react";
import {
  Table,
  TableBody as BinTableBody,
  TableCell as BinTableCell,
  TableContainer as BinTableContainer,
  TableHead as BinTableHead,
  TableRow as BinTableRow,
  Checkbox,
  TableSortLabel as BinTableSortLabel,
} from "@mui/material";
import { BinTableProps } from "@/types/table";

const BinTable = <T extends { [key: string]: any }>({
  columns,
  data,
  enableSelection = false,
  sortColumn,
  sortDirection,
  onSortChange,
  selectedTableRows,
  setSelectedTableRows,
}: BinTableProps<T>) => {
  /**
   * Handle a particular row selection
   *
   * To use this feature create a state as defined below in your parent component and as a prop
   * const [selectedTableRows, setSelectedTableRows] = useState([]);
   */
  const handleSelectAllRow = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTableRows(data);
    } else {
      setSelectedTableRows([]);
    }
  };

  const handleSelectSingleRow = (row: T) => {
    const isSelectedRow = selectedTableRows?.find(
      (selected) => selected?.id === row?.id,
    );
    const newSelectedRows = isSelectedRow
      ? selectedTableRows?.filter((selected) => selected?.id !== row?.id)
      : [...(selectedTableRows ?? []), row];

      setSelectedTableRows(newSelectedRows);
  };

  const isAllRowSelected =
    selectedTableRows?.length === data?.length && data?.length > 0;
  const isIndeterminateRow =
    selectedTableRows &&
    selectedTableRows?.length > 0 &&
    selectedTableRows?.length < data?.length;

  const isRowSelected = (row: T) =>
    selectedTableRows?.some((selected) => selected?.id === row?.id);

  /**
   * Handle sort
   */

  const handleSortTable = (field: string) => {
    const isAsc = sortColumn === field && sortDirection === "asc";
    if (onSortChange) {
      onSortChange(field, isAsc ? "desc" : "asc");
    }
  };

  return (
    <BinTableContainer>
      <Table>
        <BinTableHead>
          <BinTableRow>
            {enableSelection && (
              <BinTableCell padding="checkbox">
                <Checkbox
                  indeterminate={isIndeterminateRow}
                  checked={isAllRowSelected}
                  onChange={handleSelectAllRow}
                />
              </BinTableCell>
            )}
            {columns?.map((columnItem) => (
              <BinTableCell
                key={columnItem.field}
                align={columnItem.align || "left"}
                sortDirection={
                  sortColumn === columnItem.field ? sortDirection : false
                }
                sx={{ maxWidth: columnItem.width ?? "auto", paddingLeft:"8px", paddingRight:"8px" }}
              >
                {columnItem?.isSortable ? (
                  <BinTableSortLabel
                    active={sortColumn === columnItem.field}
                    direction={
                      sortColumn === columnItem.field
                        ? (sortDirection as "asc" | "desc")
                        : "asc"
                    }
                    onClick={() => handleSortTable(columnItem.field)}
                  >
                    <span className="text-base font-semibold">
                      {columnItem.label}
                    </span>
                  </BinTableSortLabel>
                ) : (
                  <span className="text-base font-semibold">
                    {columnItem.label}
                  </span>
                )}
              </BinTableCell>
            ))}
          </BinTableRow>
        </BinTableHead>
        <BinTableBody>
          {(() => {
            return data?.map((row, rowIndex) => (
              <BinTableRow
                key={rowIndex + 1}
                sx={{
                  bgcolor: rowIndex % 2 === 0 ? "#F6F6F6" : "inherit",
                }}
              >
                {enableSelection && (
                  <BinTableCell padding="checkbox">
                    <Checkbox
                      checked={isRowSelected(row)}
                      onChange={() => handleSelectSingleRow(row)}
                    />
                  </BinTableCell>
                )}
                {columns.map((columnItem) => (
                  <BinTableCell
                    key={columnItem.field}
                    align={columnItem.align || "left"}
                    className="text-sm"
                    sx={{ maxWidth: columnItem.width ?? "auto", padding:"8px" }}
                  >
                    {columnItem.render
                      ? columnItem.render(row[columnItem.field as keyof T], row)
                      : row[columnItem.field as keyof T]}
                  </BinTableCell>
                ))}
              </BinTableRow>
            ));
          })()}
        </BinTableBody>
      </Table>
    </BinTableContainer>
  );
};

export default BinTable;
