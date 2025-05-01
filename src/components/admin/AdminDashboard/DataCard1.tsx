/* This is temporary, Ignore it for now, I have used apex chart for now */

import React from "react";
import CustomAvatar from "@/components/common/CustomAvatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import GroupIcon from "@mui/icons-material/Group";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { AdminDashboardDataCardType } from "@/types/adminDashboard";

const DataCard1 = ({
  count,
  label,
  active,
  inactive,
  cardIconColor,
}: AdminDashboardDataCardType) => {
  return (
    <div>
      <Card className="w-full">
        <CardContent className="flex justify-between">
          <Box>
            <Typography variant="h3">{count}</Typography>

            <Typography variant="button" className="font-bold text-gray-8">
              {label}
            </Typography>
            <Box>
              <Chip
                color="success"
                label={`${active} Active`}
                icon={<ArrowUpwardOutlinedIcon />}
                sx={{ color: "success" }}
                variant="outlined"
              />
              <Chip
                color="warning"
                label={`${inactive} Inactive`}
                icon={<ArrowDownwardOutlinedIcon />}
                sx={{ color: "warning" }}
                variant="outlined"
              />
            </Box>
          </Box>
          <CustomAvatar
            width={48} // Equivalent to `w-12`
            height={48} // Equivalent to `h-12`
            bgColor={cardIconColor} // Background color
            icon={<GroupIcon className="text-white" />} // Pass the icon
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCard1;
