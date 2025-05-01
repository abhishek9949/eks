"use client";

import React, { useState } from "react";
import ImageComponent from "@/components/common/ImageComponent";
import CourseCategories from "@/components/common/CourseCategories";
import RightArrowIcon from "@mui/icons-material/EastOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProgressBar from "@/components/common/ProgressBar";
import Link from "next/link";
import ShowMoreLess from "@/components/common/ShowMoreLess";
import { formatDuration } from "@/utils/reusableFunctions";
import BinContentMenu from "./BinContentMenu";
import { BinContentCardPropType } from "@/types/bins/binsType";
import { useAppSelector } from "@/redux/hooks";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const BinContentCard = ({
  course,
  handleRemoveBinContent,
  created_by_id,
  breadcrumbSource,
}: BinContentCardPropType) => {
  const loggedInUser = useAppSelector(
    (state) => state.cookies.cookies.userCookies,
  );

  const checkSharedBin = loggedInUser?.user_id === created_by_id;

  const [openBinContentActionMenu, setOpenBinContentActionMenu] =
    useState<HTMLElement | null>(null);

  const handleOpenBinContentActionMenu = (event: any) => {
    setOpenBinContentActionMenu(event.currentTarget);
  };

  const handleCloseBinContentActionMenu = () => {
    setOpenBinContentActionMenu(null);
  };

  return (
    <div className="relative flex h-[355px] flex-col rounded shadow-card">
      <ImageComponent course={course} showBinIcon={false} />
      <ProgressBar course={course} />
      <Link
        href={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH_PRIVIEW(course?._id)}?source=${breadcrumbSource()}`}
      >
        <div className="flex flex-grow flex-col gap-2.5 p-3">
          <CourseCategories tags={course?.categories} />
          <p className="text-base font-medium text-black">{course?.title}</p>
          <p className="line-clamp-2 h-[2lh] text-lg font-normal text-gray-4">
            <ShowMoreLess content={course?.description} showButtons={false} />
          </p>
          <div className="mt-auto flex justify-between">
            {Boolean(course?.file?.duration) && (
              <span className="text-base font-normal text-gray-5">
                {formatDuration(course?.file?.duration)}
              </span>
            )}

            <RightArrowIcon />
          </div>
        </div>
      </Link>
      {/* More Vert Icon on the Top Right Corner */}
      {checkSharedBin && (
        <>
          <div className="absolute right-3 top-3 cursor-pointer rounded border bg-white">
            <MoreVertIcon
              id={`bin-content-action-long-button-${course?._id}`}
              aria-controls={
                openBinContentActionMenu ? "basic-menu" : undefined
              }
              onClick={(event) => handleOpenBinContentActionMenu(event)}
            />
          </div>
          <BinContentMenu
            openBinContentAction={openBinContentActionMenu}
            handleCloseBinContentAction={handleCloseBinContentActionMenu}
            id={course?._id}
            title={course?.title}
            handleRemoveBinContent={handleRemoveBinContent}
          />
        </>
      )}{" "}
    </div>
  );
};

export default BinContentCard;
