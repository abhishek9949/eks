"use client";

import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import { IconButton } from "@mui/material";
import Image from "next/image";

interface Icon {
  type: string;
  count: number | string;
  isActive?: boolean;
}

interface GroupIconsProps {
  icons: Icon[];
  onIconClick: (type: string) => void;
}

const GroupIcons: React.FC<GroupIconsProps> = ({ icons, onIconClick }) => {
  // Local state for like toggle
  const [likeState, setLikeState] = useState(() => {
    const initialState: Record<string, boolean> = {};
    icons.forEach((icon) => {
      if (icon.type === "like") {
        initialState[icon.type] = icon.isActive || false;
      }
    });
    return initialState;
  });

  const handleToggleLike = () => {
    setLikeState((prev) => ({
      ...prev,
      like: !prev.like,
    }));
    onIconClick("like");
  };

  const renderIcon = (type: string, isActive: boolean | undefined) => {
    switch (type) {
      case "like":
        return isActive ? (
          <ThumbUpIcon className="text-3xl" />
        ) : (
          <ThumbUpOffAltIcon className="text-3xl" />
        );
      case "comments":
        return (
          <Image
            width={28}
            height={28}
            alt="comments"
            src="/svg/comments.svg"
          />
        );
      case "share":
        return <ShareIcon className="text-3xl" />;
      case "bin":
        return (
          <Image
            width={28}
            height={28}
            alt="bin"
            src="/svg/Bin_plus.svg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-4 sm:gap-2 justify-start sm:justify-center md:justify-end">
      {icons.map((icon) => (
        <div
          key={icon.type}
          className="flex items-center gap-2 rounded-md bg-blue-light-6 !p-3 sm:p-1"
        >
          <IconButton
            onClick={() =>
              icon.type === "like" ? handleToggleLike() : onIconClick(icon.type)
            }
            className="p-0"
            disableRipple
            color={
              icon.type === "like" && likeState.like ? "primary" : "default"
            }
          >
            {renderIcon(
              icon.type,
              icon.type === "like" ? likeState.like : icon.isActive
            )}
          <span className="text-lg font-medium text-gray-800 ml-2 sm:ml-1">
            {icon.type === "like" && likeState.like
              ? Number(icon.count)
              : icon.count}
          </span>
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default GroupIcons;
