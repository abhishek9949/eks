import { AdvanceSearchButtonComponentProps } from "@/types/advanceSearch";
import { Button } from "@mui/material";
import React from "react";

const AdvanceSearchButttonComponent = ({
  handleReset,
}: AdvanceSearchButtonComponentProps) => {
  return (
      <Button
        variant="contained"
        size="small"
        onClick={handleReset}
        disableRipple
        className="flex !flex-end"
        sx={{ backgroundColor:"primary.main" }}
      >
        Reset
      </Button>
  )
};

export default AdvanceSearchButttonComponent;