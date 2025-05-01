import { Skeleton } from "@mui/material";
import React from "react";

const IndividualContentCardSkeleton = () => {
  return (
    <div className="relative w-full rounded-lg border border-gray-200 shadow-md flex flex-col gap-2">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={160}
      />
      <div className="flex flex-col gap-3 p-3">
        <Skeleton variant="rectangular" width={100} height={20} />
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width="100%" height={60} />
        <div className="flex justify-between">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </div>
      </div>
    </div>
  );
}

export default IndividualContentCardSkeleton;