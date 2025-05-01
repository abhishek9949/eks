import React, { useState } from "react";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import CourseCategories from "@/components/common/CourseCategories";
import { truncateString } from "@/utils/reusableFunctions";
import ShowMoreLess from "@/components/common/ShowMoreLess";
import TableRestaurantOutlinedIcon from "@mui/icons-material/TableRestaurantOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BinCommunityCardPropType } from "@/types/bins/binsType";
import BinContentMenu from "./BinContentMenu";
import { useAppSelector } from "@/redux/hooks";

const BinCommunityCard = ({
  community,
  handleRemoveBinContent,
  created_by_id,
  breadcrumbSource,
}: {
  community: BinCommunityCardPropType;
  handleRemoveBinContent: (contentId: number | string) => void;
  created_by_id: number;
  breadcrumbSource: () => void;
}) => {
  const loggedInUser = useAppSelector(
    (state) => state.cookies.cookies.userCookies,
  );

  const checkSharedBin = loggedInUser?.user_id === created_by_id;

  const [openBinCommunityActionMenu, setOpenBinCommunityActionMenu] =
    useState<HTMLElement | null>(null);

  const handleOpenBinCommunityActionMenu = (event: any) => {
    setOpenBinCommunityActionMenu(event.currentTarget);
  };

  const handleCloseBinCommunityActionMenu = () => {
    setOpenBinCommunityActionMenu(null);
  };
  return (
    <div className="relative flex h-[355px] w-full flex-col justify-between overflow-hidden rounded border border-gray-200 p-4 shadow-card">
      <div className="mb-5 w-fit rounded border border-primary px-2.5 py-1">
        <span className="align-center flex gap-2 text-xs font-light text-primary">
          <TableRestaurantOutlinedIcon className="!text-base !font-light" />
          Community Content
        </span>
      </div>
      <Link
        href={`${URL_CONSTANTS.COMMUNITY_TABLE}/${community?.forum_id}?source=${breadcrumbSource()}`}
      >
        <div>
          <div className="mb-2 text-lg text-black">
            {truncateString(community?.topic_title, 50)}
          </div>

          <div className="mb-2">
            <CourseCategories tags={community?.category} />
          </div>
        </div>

        {/* Description Container */}
        <div className="line-clamp-8 overflow-hidden text-base font-light text-black">
          <ShowMoreLess
            content={community?.topic_description}
            showButtons={false}
            wordLimit={80}
          />
        </div>
      </Link>
      {/* More Vert Icon on the Top Right Corner */}
      {checkSharedBin && (
        <>
          <div className="absolute right-3 top-3 cursor-pointer rounded border bg-white">
            <MoreVertIcon
              id={`bin-community-action-long-button-${community?.forum_id}`}
              aria-controls={
                openBinCommunityActionMenu ? "basic-menu" : undefined
              }
              onClick={(event) => handleOpenBinCommunityActionMenu(event)}
            />
          </div>
          <BinContentMenu
            openBinContentAction={openBinCommunityActionMenu}
            handleCloseBinContentAction={handleCloseBinCommunityActionMenu}
            id={community?.forum_id}
            title={community?.topic_title}
            handleRemoveBinContent={handleRemoveBinContent}
          />
        </>
      )}
    </div>
  );
};

export default BinCommunityCard;
