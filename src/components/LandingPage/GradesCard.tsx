import { gradesDetails } from "@/constants/landingPageConstants";
import { TabPanelProps } from "@/types/userManagementType";
import { Box, Tab, Tabs, styled } from "@mui/material";
import React, { useState } from "react";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  ".MuiTabs-flexContainer": {
    justifyContent: "space-between",
  },
  ".MuiTab-root": {
    textTransform: "none",
  },
  ".Mui-selected": {
    color: `${theme.palette.common.black} !important`,
    borderBottom: `4px solid ${theme.palette.primary.main}`,
    fontWeight: "bold",
  },
}));

const CustomTabPanel = (props: Readonly<TabPanelProps>) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="pt-4">{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `grades-tab-${index}`,
    "aria-controls": `grades-tabpanel-${index}`,
  };
};

const DisplayGradeDetails = ({ details }: { details: string[] }) => {
  return (
    <ul className="flex flex-col gap-2 pl-5 marker:text-xl marker:text-primary">
      {details?.map((gradeDetail: string) => (
        <li
          className="list-disc text-base font-normal text-black"
          key={gradeDetail}
        >
          {gradeDetail}
        </li>
      ))}
    </ul>
  );
};

const GradesCard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box className="bg-white px-2 py-4 xs:px-6">
      <Box className="border-b-2 border-gray-24">
        <StyledTabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="grades tab"
        >
          <Tab
            className="text-lg font-normal text-black"
            label="K-2"
            {...a11yProps(0)}
            disableRipple
          />
          <Tab
            className="text-lg font-normal text-black"
            label="3-5"
            {...a11yProps(1)}
            disableRipple
          />
          <Tab
            className="text-lg font-normal text-black"
            label="6-8"
            {...a11yProps(1)}
            disableRipple
          />
        </StyledTabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <DisplayGradeDetails details={gradesDetails?.["K-2"]} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <DisplayGradeDetails details={gradesDetails?.["3-5"]} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <DisplayGradeDetails details={gradesDetails?.["6-8"]} />
      </CustomTabPanel>
    </Box>
  );
};

export default GradesCard;
