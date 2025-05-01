import React from "react";
import { Skeleton } from "@mui/material";

const CommunityTableCardSkeleton = () => {
  return (
    <div className="relative w-full rounded-lg border border-gray-200 p-4 shadow-md">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton variant="text" width={180} height={24} />
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>
      <Skeleton
        variant="rectangular"
        width="20%"
        height={20}
        className="mt-2"
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={60}
        className="mt-2"
      />
      <div className="mt-2 flex items-center gap-2">
        {[...Array(3)].map((_, index) => (
          <div key={index + 1}>
            <Skeleton variant="circular" width={35} height={35} />
          </div>
        ))}
        <Skeleton variant="text" width={120} height={20} />
      </div>
      <div className="mt-2 flex flex-wrap justify-end gap-2 sm:gap-3 md:gap-4">
        <Skeleton variant="rectangular" width={50} height={35} />
        <Skeleton variant="rectangular" width={50} height={35} />
      </div>
    </div>
  );
};

export default CommunityTableCardSkeleton;
