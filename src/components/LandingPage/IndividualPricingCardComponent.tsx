import React from "react";
import { IndividualPricingCardProps } from "@/types/landingPage";
import clsx from "clsx";
import GetStartedButton from "./GetStartedButton";
import { CheckCircle, CheckCircleOutlineOutlined } from "@mui/icons-material";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const IndividualPricingCardComponent = ({
  pricingDetails,
  forTitle,
}: IndividualPricingCardProps) => {
  const isPopular = pricingDetails?.isPopular;

  const getPriceType = (planType: string) => {
    let priceType = "";
    if (planType === "Quarterly") {
      priceType = "quarter";
    } else if (planType === "Monthly") {
      priceType = "month";
    } else if (planType === "Annual") {
      priceType = "year";
    }
    return priceType;
  };

  return (
    <div className={clsx("rounded-3xl", isPopular ? "bg-primary" : "bg-white")}>
      <div className="relative flex flex-col px-12 pb-10 pt-5">
        {isPopular && (
          <div className="absolute right-0 mr-8 flex h-9 w-24 items-center justify-center rounded-xl bg-white/30">
            <span className="text-sm font-semibold text-white">Popular</span>
          </div>
        )}
        <div className="flex flex-col gap-4 pt-10">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <p
                className={clsx(
                  "text-base font-semibold xsm:text-lg",
                  isPopular ? "text-gray-21" : "text-gray-19",
                )}
              >
                For {forTitle}
              </p>
              <p
                className={clsx(
                  "text-xl font-semibold xsm:text-2xl",
                  isPopular ? "text-white" : "text-gray-20",
                )}
              >
                {pricingDetails?.planType} Plan
              </p>
            </div>
          </div>
          <p
            className={clsx(
              "text-base font-normal xsm:text-lg",
              isPopular ? "text-gray-21" : "text-gray-20",
            )}
          >
            {pricingDetails?.description}
          </p>
          <div className="flex items-center gap-3">
            <p
              className={clsx(
                "text-3xl font-semibold xsm:text-5xl",
                isPopular ? "text-white" : "text-gray-20",
              )}
            >
              {pricingDetails?.currency}
              {pricingDetails?.amount}
            </p>
            <p
              className={clsx(
                "text-xl font-semibold",
                isPopular ? "text-gray-21" : "text-gray-19",
              )}
            >
              /{getPriceType(pricingDetails?.planType)}
            </p>
          </div>
          <p
            className={clsx(
              "text-lg font-semibold xsm:text-xl",
              isPopular ? "text-white" : "text-gray-20",
            )}
          >
            {"What's included"}
          </p>
          <div className="flex flex-col gap-3">
            {pricingDetails?.features?.map((feature) => (
              <div key={feature} className="flex gap-4">
                {isPopular ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <CheckCircleOutlineOutlined color="primary" />
                )}
                <p
                  className={clsx(
                    "text-base font-normal xsm:text-lg",
                    isPopular ? "text-white" : "text-gray-20",
                  )}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
          <GetStartedButton
            customClassname={clsx(
              "!rounded-3xl !text-lg !flex-1 !h-14",
              isPopular ? "!bg-white !text-blue-light-17" : "!bg-primary !text-white",
            )}
            showIcon={false}
            title={forTitle === "Business" ? "Contact Sales" : "Get Started"}
            customLink={forTitle === "Business" ? URL_CONSTANTS.CONTACT_SALES : URL_CONSTANTS.SIGNUP}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualPricingCardComponent;
