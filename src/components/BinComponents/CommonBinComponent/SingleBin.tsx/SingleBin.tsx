"use client";

import React, { useState } from "react";
import BinLogo from "@/components/common/BinLogo";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SingleBinMenu from "./SingleBinMenu";
import { SingleBinPropType } from "@/types/bins/binsType";
import Link from "next/link";
import { CustomTooltip } from "@/components/common/Tooltip";

const SingleBin = ({
  color,
  name,
  bin_id,
  singleBinData,
  handleUpdateBin,
  handleDeleteBin,
  redirectBinLink,
  handleShareBin,
}: SingleBinPropType) => {
  const [openBinActionMenu, setOpenBinActionMenu] =
    useState<HTMLElement | null>(null);

  const handleOpenBinActionMenu = (event: any) => {
    setOpenBinActionMenu(event.currentTarget);
  };

  const handleCloseBinActionMenu = () => {
    setOpenBinActionMenu(null);
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[210px]">
      {/* Bin Logo (Link) */}
      <Link
        href={`/bins/${redirectBinLink}/${singleBinData?.bin_id ?? bin_id}`}
        className="block h-full w-full"
      >
        <BinLogo color={color} className="h-full w-full" />
      </Link>

      {/* Bin Name (Centered) */}
      <Link
        href={`/bins/${redirectBinLink}/${singleBinData?.bin_id ?? bin_id}`}
      >
        <div className="absolute left-1/2 top-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2 truncate rounded-sm bg-white px-2 py-1 text-center text-sm font-semibold text-[#4A4A4A] sm:text-base">
          <CustomTooltip title={name} placement="top-start">
            <span>{name}</span>
          </CustomTooltip>
        </div>
      </Link>

      {/* MoreVert Icon (Top-Right) */}
      <button
        className="absolute right-2 top-3 rounded-sm bg-white transition hover:bg-gray-100 sm:right-3 sm:top-5 sm:p-[2px]"
        onClick={handleOpenBinActionMenu}
        aria-label="Bin options"
      >
        <MoreVertIcon fontSize="small" />
      </button>

      {/* Menu Popup */}
      <SingleBinMenu
        openBinActionMenu={openBinActionMenu}
        handleCloseBinActionMenu={handleCloseBinActionMenu}
        singleBinData={singleBinData}
        handleUpdateBin={handleUpdateBin}
        handleDeleteBin={handleDeleteBin}
        handleShareBin={handleShareBin}
      />
    </div>
  );
};

export default SingleBin;
