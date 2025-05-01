import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { ToggleBtnGridListPropType } from "@/types/bins/binsType";

const ToggleBtnGridList = ({
  alignment,
  handleChangeAlignment,
}: ToggleBtnGridListPropType) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChangeAlignment}
      aria-label="recents bin"
      size="small"
    >
      <ToggleButton value="list" disableRipple>
        <FormatListBulletedOutlinedIcon />
      </ToggleButton>
      <ToggleButton value="grid" disableRipple>
        <GridViewOutlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleBtnGridList;
