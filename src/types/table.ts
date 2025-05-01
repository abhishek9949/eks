export interface Column {
  field: string;
  label: string;
  align: "left" | "center" | "right" | "inherit" | "justify";
  isSortable?: boolean;
  render?: (value: any, row: any) => React.JSX.Element;
  width?: number | string;
}

export interface TableProps<T> {
  columns: Column[];
  data: T[] | [];
  rowsPerPage: number;
  page: number;
  totalRows: number;
  onPageChange: (event: React.MouseEvent | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  enableSelection?: boolean;
  sortColumn?: string;
  sortDirection?: "asc" | "desc" | false;
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  selectedRows?: T[];
  setSelectedRows?: any;
  loading: boolean;
}

export interface BinTableProps<T> {
  columns: Column[];
  data: T[] | [];
  enableSelection?: boolean;
  sortColumn?: string;
  sortDirection?: "asc" | "desc" | false;
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  selectedTableRows?: T[];
  setSelectedTableRows?: any;
}
