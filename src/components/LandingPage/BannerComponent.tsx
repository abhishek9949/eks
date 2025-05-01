import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import GetStartedButton from "./GetStartedButton";
import { BannerLinks } from "@/constants/landingPageConstants";
import { GetStartedProps } from "@/types/common";

const BannerComponent = ({ showGetStartedButton }: GetStartedProps) => {
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full">
        <Image
          src="/images/landingPageImages/bannerImage.webp"
          alt="Banner Image"
          width={1920}
          height={1080}
          priority
          className={`h-auto w-full object-cover`}
        />
      </div>
      <div className="absolute left-2/4 top-2 flex flex-col gap-1 sm:top-10 md:gap-3 lg:left-[40%] xl:left-2/4">
        <p className="text-base font-semibold text-black sm:text-2xl md:text-3xl xl:text-5xl xl:leading-[4.25rem] 2xl:text-6xl">
          Meet your 24/7
          <br /> Professional Learning Hub
        </p>
        <p className="xs:text-xl text-sm font-medium text-black md:text-2xl">
          for educators of grade Pre-k to 8
        </p>
        <div className="hidden items-stretch gap-3 pr-3 lg:flex">
          <div className="flex w-fit max-w-sm items-center  rounded-[1.5rem_1.5rem_1.5rem_1.5rem] bg-blue-light-15 p-6 lg:p-4 xl:p-5">
            <p className="text-center text-white">
              <span className="block text-lg font-bold lg:text-[1.325rem]">
                The Teachers Table
              </span>
              <span className="block text-base font-normal lg:text-lg xl:text-xl">
                brings together research, practice, and community...
              </span>
            </p>
          </div>
          <div className="flex w-fit max-w-md items-center rounded-[1.5rem_1.5rem_1.5rem_1.5rem] bg-pink p-5">
            <p className="text-center text-base text-white lg:text-lg xl:text-lg">
              to help you solve current teaching challenges and get ahead of
              future ones...
            </p>
          </div>
          <div className="flex w-fit max-w-xs items-center justify-center rounded-3xl bg-orange p-5">
            <p className="text-center text-base text-white lg:text-lg xl:text-lg">
              in just <span className="font-bold">5 minutes</span> a day
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-6 pt-6 text-center lg:hidden">
        <div className="rounded-[0.5rem_0.5rem_0.5rem_0.5rem] bg-blue-light-15 p-2">
          <p className="text-white">
            <span className="text-xs font-bold md:text-base">
              The Teachers Table
            </span>
            <br />
            <span className="text-xs font-normal md:text-base">
              brings together research practice and community...
            </span>
          </p>
        </div>
        <div className="rounded-[0.5rem_0.5rem_0.5rem_0.5rem] bg-pink p-4">
          <p className="text-[0.8125rem] text-white md:text-base">
            to help you solve current teaching challenges...
            <br />
            and get ahead of future ones...
          </p>
        </div>
        <div className="rounded-[0.5rem_0.5rem_0.5rem_0.5rem] bg-orange p-4 text-center">
          <p className="text-[0.8125rem] text-white md:text-base">
            in just 5 minutes a day
          </p>
        </div>
      </div>
      <div className="xs:gap:3 bottom-0 flex gap-1 p-6 lg:absolute lg:p-10">
        {BannerLinks?.map((bannerLink) => (
          <Button
            key={bannerLink?.name}
            variant="contained"
            className="!lg:flex-grow-0 !flex-grow rounded-[0.25rem] !bg-primary/90  !px-4 !text-[0.75rem] !font-normal sm:!px-4 md:!px-8 md:!text-lg lg:!h-[4rem] lg:!rounded-2xl lg:!px-10 lg:!text-[1.5rem] xl:!px-19"
          >
            {bannerLink?.name}
          </Button>
        ))}
        {showGetStartedButton && (
          <GetStartedButton
            customClassname="!h-[4rem] !rounded-2xl !bg-white md:!text-[1.5rem] !text-blue-light-8 !border-text-blue-light-8"
            customClassnameForLink="!hidden lg:!block"
            title="Get Started!"
            customClassnameForGap="!gap-[1.875rem]"
            customClassnameForArrow="lg:!w-8 lg:!h-8"
          />
        )}
      </div>
      {showGetStartedButton && (
        <div className="mb-5 px-6 lg:hidden">
          <GetStartedButton
            customClassname="py-1 w-full !bg-white !text-sm md:!text-lg !text-blue-light-8 !border-text-blue-light-8"
            title="Get Started!"
            customClassnameForGap="!gap-2"
          />
        </div>
      )}
    </div>
  );
};

export default BannerComponent;
