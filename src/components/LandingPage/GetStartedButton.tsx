  import React from "react";
  import { Button } from "@mui/material";
  import clsx from "clsx";
  import { GetStartedButtonProps } from "@/types/landingPage";
  import Link from "next/link";
  import { styled } from "@mui/system";
  import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
  import { URL_CONSTANTS } from "@/constants/routingUrl";

  const AnimatedButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "isBlue",
  })<{ isBlue?: boolean }>(({ theme, isBlue }) => ({
    transition: "all 0.5s ease-in-out !important",
    color: isBlue ? "white !important" : `${theme.palette.primary.main} !important`,
    backgroundColor: isBlue ? `${theme.palette.primary.main} !important` : "white !important",
    "&:hover": {
      color: isBlue ? `${theme.palette.primary.main} !important` : "white !important",
      backgroundColor: isBlue ? "white !important" : `${theme.palette.primary.main} !important`,
      transform: "scale(1) !important",
    },
  }));

  const GetStartedButton = ({
    customClassname,
    showIcon = true,
    title,
    customClassnameForLink,
    customClassnameForGap,
    customClassnameForArrow,
    isBlue,
    customLink,
  }: GetStartedButtonProps) => {
    return (
      <Link
        href={customLink ?? URL_CONSTANTS.SIGNUP}
        className={clsx("flex w-full", customClassnameForLink)}
      >
        <AnimatedButton
          variant="contained"
          className={clsx(
            "!border !border-solid !px-4 !text-3xl !font-semibold sm:!px-4 md:!px-8 lg:!px-10 xl:!px-8",
            customClassname
          )}
          isBlue={isBlue}
        >
          <div
            className={clsx(
              "flex items-center justify-between",
              customClassnameForGap
            )}
          >
            <span>{title}</span>
            {showIcon && (
              <ArrowForwardIosIcon
                fontSize="small"
                className={clsx(
                  "!h-4 !w-4 lg:!h-6 lg:!w-6",
                  customClassnameForArrow
                )}
              />
            )}
          </div>
        </AnimatedButton>
      </Link>
    );
  };

  export default GetStartedButton;
