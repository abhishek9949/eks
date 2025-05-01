import React from "react";
import { MenuItem } from "@mui/material";
import StyledMenu from "@/components/common/StyledMenu";
import { truncateString } from "@/utils/reusableFunctions";
import { OtherReasonMenuProps } from "@/types/community/ReportedCommentsType";

const OtherReasonsMenu = ({
  openOtherReportMenu,
  handleCloseOtherReportMenu,
  row,
}: OtherReasonMenuProps) => {
  return (
    <StyledMenu
      id="report-reason-comment-menu"
      anchorEl={openOtherReportMenu}
      open={Boolean(openOtherReportMenu)}
      onClose={handleCloseOtherReportMenu}
      slotProps={{
        root: {
          "aria-labelledby": "report-reason-action",
        },
      }}
      sx={{
        "& .MuiPaper-root": {
          maxHeight: 200,
          width: 250,
          overflowY: "auto",
        },
        "& .MuiMenuItem-root": {
          whiteSpace: "normal", // Allow text to wrap
          wordBreak: "break-word", // Break long words if needed
        },
      }}
    >
      {row?.other_reasons?.map((item, index) => {
        return (
          <MenuItem
            key={index + 1}
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              cursor: "text",
            }}
          >
            {truncateString(item, 50)}
          </MenuItem>
        );
      })}
    </StyledMenu>
  );
};

export default OtherReasonsMenu;
