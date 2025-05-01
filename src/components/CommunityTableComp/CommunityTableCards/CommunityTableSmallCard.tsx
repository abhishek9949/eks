import React from "react";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import CourseCategories from "@/components/common/CourseCategories";
import { timeDifference, truncateString } from "@/utils/reusableFunctions";
import ShowMoreLess from "@/components/common/ShowMoreLess";

const CommunityTableSmallCard = (props: any) => {
  return (
    <Link href={URL_CONSTANTS.COMMUNITY_TABLE + "/" + props?.id}>
      <div className="relative flex h-[230px] w-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 p-4 shadow-md xl:h-[220px]">
        <div>
          <div className="mb-2 text-lg text-black">
            {truncateString(props?.title, 50)}
          </div>

          <span className="text-sm text-gray-500">
            Posted {timeDifference(props?.timeAgo)}
          </span>

          <div className="mb-2">
            <CourseCategories tags={props?.tags} />
          </div>
        </div>

        {/* Description Container */}
        <div className="line-clamp-4 overflow-hidden text-base font-light text-black">
          <ShowMoreLess
            content={props?.desc}
            showButtons={false}
            wordLimit={50}
          />
        </div>
      </div>
    </Link>
  );
};

export default CommunityTableSmallCard;
