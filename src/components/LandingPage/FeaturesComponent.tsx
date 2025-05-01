import React from "react";
import Image from "next/image";
import GradesCard from "./GradesCard";
import { categories } from "@/constants/landingPageConstants";
import GetStartedButton from "./GetStartedButton";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import { GetStartedProps } from "@/types/common";

const FeaturesComponent = ({ showGetStartedButton }: GetStartedProps) => {
  return (
    <div className="xs:!mt-5 flex flex-col sm:!mt-5">
      <div className="grid min-h-full grid-cols-12">
        <div className="order-2 col-span-12 flex flex-col gap-4 bg-blue-light-9 p-10 lg:order-1 lg:col-span-6">
          <p className="text-center text-[2.125rem] font-semibold text-black lg:text-left">
            Support for teaching research-backed reading and writing
          </p>
          <div className="flex flex-wrap gap-3">
            {categories?.map((category) => (
              <div
                key={category?.name}
                className="flex h-11 items-center justify-center gap-2 rounded-3xl p-5"
                style={{ backgroundColor: category?.backgroundColor }}
              >
                <CheckCircleOutlineOutlined className="text-white" />
                <span className="text-white">{category?.name}</span>
              </div>
            ))}
          </div>
          <p className="text-lg font-normal text-black">
            Popular topics by age
          </p>
          <GradesCard />
          {showGetStartedButton && (
            <div className="mt-6.5">
            <GetStartedButton
              customClassname="h-11 w-fit !rounded-[0.25rem] !m-auto lg:!m-0 !bg-white !text-sm md:!text-lg !text-blue-light-17 !border-blue-light-17"
              title="Get Started!"
              customClassnameForGap="!gap-2 lg:!gap-3"
            />
            </div>
          )}
        </div>
        <div className="relative order-1 col-span-12 flex lg:order-2 lg:col-span-6">
          <Image
            src={"/images/landingPageImages/popularTopicsImage.webp"}
            alt="Popular Topics Image"
            height={588}
            width={740}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 items-center pt-10 xl:py-10">
        <div className="order-1 col-span-12 flex justify-center self-center lg:order-1 lg:col-span-6 lg:my-auto">
          <Image
            src="/images/landingPageImages/guessworkImage.webp"
            alt="Laptop Image"
            height={400}
            width={550}
            priority
            className="max-h-[400px] w-auto object-contain"
          />
        </div>
        <div className="order-2 col-span-12 flex flex-col gap-4 p-10 pb-0 text-center lg:order-2 lg:col-span-6 lg:px-20 lg:text-left xl:pb-10">
          <p className="text-[2.125rem] font-semibold text-gray-17">
            Take the Guesswork out of Teaching and Professional Learning
          </p>
          <p className="text-xl font-normal text-gray-17">
            The Teachers Table app effortlessly integrates into your everyday
            teaching and learning - because support should complement your
            lifestyle, not complicate it.
          </p>
          <p className="text-2xl font-semibold text-black">
            Instant Answers to Your Parenting Questions
          </p>
          <p className="text-xl font-light text-black">
            No more searching on Google - our Good Inside Chatbot is like having
            Dr. Becky on speed dial.
          </p>
          {showGetStartedButton && (
              <div className="mb-5">
            <GetStartedButton
              customClassname="h-11 w-fit !rounded-[0.25rem] !m-auto lg:!m-0 !bg-white !text-sm md:!text-lg !text-blue-light-17 !border-blue-light-17 mb:mt-24"
              title="Get Started!"
              customClassnameForGap="!gap-2 lg:!gap-3"
            />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturesComponent;
