import React, { useState } from "react";
import IndividualPricingCardComponent from "./IndividualPricingCardComponent";
import { PricingConstants } from "@/constants/landingPageConstants";
import { Box, Button, MobileStepper, Tab, Tabs, styled } from "@mui/material";
import { TabPanelProps } from "@/types/userManagementType";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { PricingCardForCarouselProps } from "@/types/landingPage";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  ".MuiTabs-flexContainer": {
    justifyContent: "space-between"
  },
  ".MuiTab-root": {
    textTransform: "none",
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    borderRadius: "4px",
  },
  ".Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
    borderRadius: "4px",
    fontWeight: "bold"
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
}

const a11yProps = (index: number) => {
  return {
    id: `plan-tab-${index}`,
    "aria-controls": `plan-tabpanel-${index}`,
  };
}

const RenderPricingCardForCarousel = ({
  activeStep,
  pricingDetails,
  forTitle,
  handleStepChange
}: PricingCardForCarouselProps) => {
  const showCarousel = pricingDetails?.length > 1;
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex">
        {showCarousel && (
          <Button size="small" onClick={() => handleStepChange("back")} disabled={activeStep === 0} disableRipple>
            <KeyboardArrowLeft className="w-12 h-12" />
          </Button>
        )}
        <IndividualPricingCardComponent
          pricingDetails={pricingDetails?.[activeStep]}
          forTitle={forTitle}
        />
        {showCarousel && (
          <Button
            size="small"
            onClick={() => handleStepChange("next")}
            disabled={activeStep === pricingDetails?.length - 1}
            disableRipple
          >
            <KeyboardArrowRight className="w-12 h-12 xs:!min-w-0" />
          </Button>
        )}
      </div>
      {showCarousel && (
        <MobileStepper
          variant="dots"
          steps={pricingDetails?.length}
          position="static"
          activeStep={activeStep}
          className="lg:hidden"
          backButton=""
          nextButton=""
        />
      )}
    </div>
  )
};


const PricingComponent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [educatorActiveStep, setEducatorActiveStep] = useState(0);
  const [businessActiveStep, setBusinessActiveStep] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setEducatorActiveStep(0);
    setBusinessActiveStep(0);
    setTabValue(newValue);
  };

  const handleEducatorStepChange = (direction: string) => {
    setEducatorActiveStep((prevActiveStep) =>
      direction === "next" ? prevActiveStep + 1 : prevActiveStep - 1
    );
  };

  const handleBusinessStepChange = (direction: string) => {
    setBusinessActiveStep((prevActiveStep) =>
      direction === "next" ? prevActiveStep + 1 : prevActiveStep - 1
    );
  };

  return (
    <Box className="bg-blue-light-13">
      <Box className="flex flex-col gap-3 items-center p-10">
        <p className="text-primary text-lg font-semibold uppercase text-center">Pricing</p>
        <p className="text-gray-20 text-[3.125rem] font-semibold text-center leading-[3rem] lg:leading-[4rem]">Plans for Your Need</p>
        <p className="text-gray-18 text-lg font-normal text-center">Select from best plan, ensuring a perfect match. Need more or less? Customize your subscription for a seamless fit!</p>
        <StyledTabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="grades tab"
        >
          <Tab className="!text-black !text-xl font-normal" label="Educator" {...a11yProps(0)} disableRipple />
          <Tab className="!text-black !text-xl font-normal" label="Business" {...a11yProps(1)} disableRipple />
        </StyledTabs>
        <CustomTabPanel value={tabValue} index={0}>
          <Box className="hidden lg:flex gap-6">
            {PricingConstants?.educator?.map((item) => (
              <IndividualPricingCardComponent
                key={item?.id}
                pricingDetails={item}
                forTitle="Educator"
              />
            ))}
          </Box>
          <div className="lg:hidden">
            <RenderPricingCardForCarousel
              activeStep={educatorActiveStep}
              pricingDetails={PricingConstants?.educator}
              forTitle="Educator"
              handleStepChange={handleEducatorStepChange}
            />
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <div className="hidden lg:flex">
            {PricingConstants?.business?.map((item) => (
              <IndividualPricingCardComponent
                key={item?.id}
                pricingDetails={item}
                forTitle="Business"
              />
            ))}
          </div>
          <div className="lg:hidden">
            <RenderPricingCardForCarousel
              activeStep={businessActiveStep}
              pricingDetails={PricingConstants?.business}
              forTitle="Business"
              handleStepChange={handleBusinessStepChange}
            />
          </div>
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default PricingComponent;