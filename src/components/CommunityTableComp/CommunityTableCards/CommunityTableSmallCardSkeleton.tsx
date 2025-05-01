import React from "react";
import { Skeleton } from "@mui/material";

const CommunityTableSmallCardSkeleton = () => {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-lg border border-gray-200 p-4 shadow-md">
      <Skeleton variant="text" width={200} height={24} className="mb-2" />
      <Skeleton variant="text" width={100} height={16} className="mb-4" />
      <div className="flex flex-col justify-between">
        <div>
          <div className="block xl:flex">
            <Skeleton
              variant="rectangular"
              width={150}
              height={24}
              className="mb-2"
            />
          </div>
          <Skeleton variant="text" width="100%" height={110} />
        </div>
      </div>
    </div>
  );
};

export default CommunityTableSmallCardSkeleton;
