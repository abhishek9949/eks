"use client";

import React, { useState } from "react";
import Image from "next/image";
import CardType from "./CardType";
import clsx from "clsx";
import { ImageComponentProps } from "@/types/card";
import {
  hideConfirmAddToBin,
  hideOpenAddToBin,
  showConfirmAddToBin,
  showOpenAddToBin,
} from "@/redux/slices/addToBinSlice";
import AddToBinComp from "@/components/common/AddToBin";
import { useAppDispatch } from "@/redux/hooks";
import { useSaveContentToBinMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";

const ImageComponent = ({
  course,
  height = "15.9vh",
  imageCustomClass,
  cardTypeBg = "light",
  isFeatured,
  showBinIcon = true,
}: ImageComponentProps) => {
  const dispatch = useAppDispatch();
  const [saveContentToBin] = useSaveContentToBinMutation();
  const [openAddBinForContent, setOpenAddBinForContent] = useState(false);
  const [isAddingBinContent, setIsAddingBinContent] = useState(false);
  
  const getThumbnailUrl = () => {
    if (isFeatured) {
      return "/svg/course.svg";
    } else if (
      course?.thumbnail_url !== "none" &&
      course?.thumbnail_url !== null
    ) {
      return course?.thumbnail_url;
    } else {
      return "/svg/course.svg";
    }
  };

  /**
   * Add to bin started
   */
  const handleClickOpenAddBinForContent = () => {
    setOpenAddBinForContent(true);
    dispatch(showOpenAddToBin());
  };

  const handleCloseAddBinForContent = () => {
    setOpenAddBinForContent(false);
    dispatch(hideOpenAddToBin());
    dispatch(hideConfirmAddToBin());
  };

  const handleSelectBinForContent = () => {
    dispatch(hideOpenAddToBin());
    dispatch(showConfirmAddToBin());
  };

  const handleAddToBinForContent = (binId: number) => {
    const payload = {
      bin_ids: [binId],
      entity_id: course?._id,
      entity_type: "content",
      metadata: {
        _id: course?._id,
        title: course?.title,
        categories: course?.categories,
        description: course?.description,
        file: {
          duration: course?.file?.duration,
        },
        thumbnail_url: course?.thumbnail_url,
        content_type: course?.content_type,
        watch_duration: course?.watch_duration,
        created_by_details: course?.created_by_details
      },
    };
    setIsAddingBinContent(true);
    saveContentToBin({
      endpoint: `${API_CONSTANTS.SAVE_CONTENT_TO_BIN}/`,
      method: "POST",
      data: payload,
    })
      .unwrap()
      .then(() => {
        setIsAddingBinContent(false);
        dispatch(
          showToastMessage({
            message: "Content added successfully",
            severity: "success",
          }),
        );
        handleCloseAddBinForContent();
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message:
            error?.data?.error ||
              "Error while adding the content to Bin.",
            severity: "error",
          }),
        );
        setIsAddingBinContent(false);
        handleCloseAddBinForContent();
      });
  };

  /**
   * Add to bin ended
   */

  return (
    <div className="relative h-full rounded">
      <div className="max-w-100" style={{ minHeight: height }}>
        <Image
          src={getThumbnailUrl()}
          alt="Course Image"
          fill
          sizes="100vw"
          objectFit="cover"
          className={clsx("rounded-t", imageCustomClass)}
        />
      </div>
      <div className="absolute top-3 flex w-full min-w-max justify-between gap-1 px-2">
        <div>
          <CardType course={course} cardTypeBg={cardTypeBg} />
        </div>
        {showBinIcon && (
          <div>
            <button
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full",
                cardTypeBg === "light" ? "bg-white" : "bg-gray-6",
              )}
              onClick={handleClickOpenAddBinForContent}
            >
              <Image
                src={
                  cardTypeBg === "light"
                    ? "/svg/AddToBinDark.svg"
                    : "/svg/AddToBinLight.svg"
                }
                alt="Bin Image"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}
      </div>
      {openAddBinForContent && (
        <AddToBinComp
          key={openAddBinForContent ? "dialog-open" : "dialog-closed"}
          open={openAddBinForContent}
          handleClose={handleCloseAddBinForContent}
          handleSelectBin={handleSelectBinForContent}
          handleAddToBin={handleAddToBinForContent}
          isAddingBinContent={isAddingBinContent}
          contentTitle={course?.title}
        />
      )}
    </div>
  );
};

export default ImageComponent;
