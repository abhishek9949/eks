import { Chip } from "@mui/material";

export const getStatusChip = (status: string) => {
  const statusMap: Record<string, { label: string; color: "primary" | "warning" | "error" | "secondary" | "default" }> = {
    published: { label: "Published", color: "primary" },
    active: { label: "Active", color: "primary" },
    inactive: { label: "Inactive", color: "secondary" },
    failure: { label: "Failed", color: "error" },
    pending: { label: "Pending", color: "warning" },
    deleted: { label: "Deleted", color: "error" },
    expired: { label: "Invite Expired", color: "error" },
  };

  return <Chip label={statusMap[status]?.label || "Draft"} color={statusMap[status]?.color || "default"} size="small" />;
};
