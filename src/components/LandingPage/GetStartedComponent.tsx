import React, { useState } from "react";
import GetStartedButton from "./GetStartedButton";
import { GettingStartedConstants } from "@/constants/landingPageConstants";
import Image from "next/image";
import { Button, MobileStepper, Box } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { GettingStartedCardProps } from "@/types/landingPage";
import { GetStartedProps } from "@/types/common";

const RenderGetStartedCard = ({ item }: GettingStartedCardProps) => {
  return (
    <div className="flex h-114 w-full max-w-125 flex-col rounded-[9px] rounded-lg border border-gray-200  bg-white hover:scale-105 hover:shadow-lg md:min-w-125 lg:min-w-0">
      <div className="relative h-[60%] w-full">
        <Image
          src={item?.image}
          alt="Getting Started Image"
          fill
          className="rounded-t-lg object-cover"
          priority={true}
        />
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 py-4 text-center">
        <p className="text-xl font-bold text-black">{item?.title}</p>
        <p className="text-base font-normal text-black">{item?.description}</p>
      </div>
    </div>
  );
};

const GetStartedComponent = ({ showGetStartedButton }: GetStartedProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="bg-white p-4">
      <div className="flex flex-col items-center gap-4">
        <p className="my-5 text-center text-[2.125rem] font-bold text-black">
          Get started in 3 simple steps
        </p>
        <div className="hidden grid-cols-12 gap-4 lg:grid">
          {GettingStartedConstants?.map((item) => (
            <div key={item?.title} className="col-span-4">
              <RenderGetStartedCard item={item} />
            </div>
          ))}
        </div>
        <div className="flex items-center lg:!hidden">
          <RenderGetStartedCard item={GettingStartedConstants?.[activeStep]} />
        </div>
        <Box
          sx={{
            display: { lg: "none", xs: "flex" },
          }}
        >
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            disableRipple
          >
            <KeyboardArrowLeft className="h-12 w-12" />
          </Button>
          <MobileStepper
            variant="dots"
            steps={GettingStartedConstants?.length}
            position="static"
            activeStep={activeStep}
            className="lg:!hidden"
            backButton=""
            nextButton=""
          />
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === GettingStartedConstants?.length - 1}
            disableRipple
          >
            <KeyboardArrowRight className="h-12 w-12" />
          </Button>
        </Box>
        {showGetStartedButton && (
          <GetStartedButton
            customClassname="h-11 w-fit !rounded-[0.25rem] !bg-white !text-sm md:!text-lg !m-auto !my-6 !text-blue-light-17 !border-blue-light-17"
            title="Get Started!"
            customClassnameForGap="!gap-2 lg:!gap-3"
          />
        )}
      </div>
    </div>
  );
};

export default GetStartedComponent;
