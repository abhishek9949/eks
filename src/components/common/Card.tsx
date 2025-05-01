import React from "react";
import ImageComponent from "./ImageComponent";
import CourseCategories from "./CourseCategories";
import RightArrowIcon from "@mui/icons-material/EastOutlined";
import ProgressBar from "./ProgressBar";
import { CardProps } from "@/types/card";
import Link from "next/link";
import ShowMoreLess from "./ShowMoreLess";
import { formatDuration } from "@/utils/reusableFunctions";
import { CustomTooltip } from "./Tooltip";

const Card = ({ course, cardNavigationLink }: CardProps) => {
  const navigationLink = cardNavigationLink
    ? `${cardNavigationLink}/${course?._id}`
    : `/content-details/${course?._id}`;
  return (
    <div className="flex flex-col rounded shadow-card">
      <ImageComponent course={course} />
      <ProgressBar course={course} />
      <Link href={navigationLink}>
        <div className="flex flex-grow flex-col gap-2.5 p-3">
          <CourseCategories tags={course?.categories} />
          <CustomTooltip title={course?.title}>
            <p className="line-clamp-1 h-[1lh] text-base font-medium text-black max-w-fit">
              {course?.title}
            </p>
          </CustomTooltip>
          <p className="line-clamp-2 h-[2lh] text-lg font-normal text-gray-4">
            <ShowMoreLess content={course?.description} showButtons={false} />
          </p>
          <div className="mt-auto flex justify-between">
            {Boolean(course?.file?.duration) && (
              <span className="text-base font-normal text-gray-5">
                {formatDuration(course?.file?.duration)}
              </span>
            )}
            <RightArrowIcon className="ml-auto" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
