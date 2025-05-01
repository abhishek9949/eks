"use client";
import React, { useState, useRef } from "react";
import Card from "@/components/common/Card";
import Link from "next/link";
import {
  AccessTime,
  StarPurple500,
  TrendingUp,
  FavoriteBorder,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import { IndividualCourseProps } from "@/types/course";
import Draggable, { DraggableRef } from "./Draggable";
import clsx from "clsx";
import { IndividualContentCardProps } from "@/types/content";
import IndividualContentCardSkeleton from "./IndividualContentCardSkeleton";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { getMaximumContentCards } from "@/utils/reusableFunctions";

const IndividualCourse = ({
  courses,
  title,
  navigationLink,
  notScrollable,
  isDataLoading,
  contentLoaderRef,
  cardNavigationLink
}: IndividualCourseProps) => {
  const [disablePrev, setDisablePrev] = useState<boolean>(true);
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const draggableRef = useRef<DraggableRef>(null);
  const MAX_ITEM = getMaximumContentCards()?.cards;

  const getIconBasedOnTitle = (title: string): JSX.Element => {
    const iconObject: { [key: string]: JSX.Element } = {
      [CONSTANT_MESSAGE.NEW_COURSES]: (
        <StarPurple500 className="text-xl sm:text-2xl text-gray-14" />
      ),
      [CONSTANT_MESSAGE.POPULAR_COURSES]: (
        <TrendingUp className="text-xl sm:text-2x text-gray-14" />
      ),
      [CONSTANT_MESSAGE.PERSONALISED_COURSES]: (
        <FavoriteBorder className="text-xl sm:text-2x text-gray-14" />
      ),
      [CONSTANT_MESSAGE.CONTINUE_WATCHING]: (
        <AccessTime className="text-xl sm:text-2x text-gray-15" />
      ),
    };
    return iconObject[title];
  };

  const handleChevronClick = (direction: string) => {
    if (draggableRef.current) {
      draggableRef?.current?.scroll(direction);
    }
  };

  const handleScrollChange = (isAtStart: boolean, isAtEnd: boolean) => {
    setDisablePrev(isAtStart);
    setDisableNext(isAtEnd);
  };

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xl sm:text-2xl font-bold text-black whitespace-nowrap">{title}</p>
          {getIconBasedOnTitle(title)}
        </div>
        {!notScrollable && courses?.length > MAX_ITEM && (
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                `flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2`,
                disablePrev ? "border-gray-11" : "border-primary",
              )}
            >
              <ChevronLeftOutlined
                onClick={() => handleChevronClick("left")}
                className="h-5 w-5 sm:h-6 sm:w-6"
                color={disablePrev ? "disabled" : "primary"}
              />
            </div>
            <div
              className={clsx(
                `flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2`,
                disableNext ? "border-gray-11" : "border-primary",
              )}
            >
              <ChevronRightOutlined
                onClick={() => handleChevronClick("right")}
                className="h-5 w-5 sm:h-6 sm:w-6"
                color={disableNext ? "disabled" : "primary"}
              />
            </div>
            {navigationLink && (
              <Link href={navigationLink} scroll={false}>
                <span className="text-lg sm:text-xl font-medium text-primary underline whitespace-nowrap">
                  View All
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
      {courses?.length === 0 && !isDataLoading ? (
        <div className="flex items-center justify-center p-20">
          <p className="text-2xl text-black">No content found</p>
        </div>
      ) : (
        <>
          {notScrollable || !courses?.length || courses?.length <= MAX_ITEM ? (
            <div className="grid grid-cols-12 gap-4 overflow-visible md:gap-6 2xl:gap-7.5">
              {courses?.map((course: IndividualContentCardProps) =>
                course ? (
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                    key=""
                  >
                    <Card course={course} cardNavigationLink={cardNavigationLink} />
                  </div>
                ) : (
                  <div
                    key=""
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                  >
                    <IndividualContentCardSkeleton />
                  </div>
                ),
              )}
              <div ref={contentLoaderRef} className="h-1 w-full" />
            </div>
          ) : (
            <Draggable
              ref={draggableRef}
              rootClass={"drag"}
              onScrollChange={handleScrollChange}
            >
              {courses?.map((course) => (
                <div className="col-span-10" key={course?._id}>
                  <Card course={course} cardNavigationLink={cardNavigationLink} />
                </div>
              ))}
            </Draggable>
          )}
        </>
      )}
    </div>
  );
};

export default IndividualCourse;
