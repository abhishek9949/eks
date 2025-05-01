import { Skeleton } from "@mui/material";
import React from "react";

const NotificationListSkeleton = ({ listLength }: { listLength?: number }) => {
  return (
    <div data-testid="notification-skeleton">
       {Array.from({ length: listLength ?? 5 }).map((_, index) => (
        <div key={index + 1} className="border-b-solid flex items-center gap-4 border-b border-b-neutral-200 px-2 py-4">
          <Skeleton variant="rectangular" width={24} height={24} />
          <Skeleton variant="circular" width={44} height={44} />
          <div className="flex flex-col gap-1 w-full">
            <Skeleton variant="text" height={20} className="w-full" />
            <Skeleton variant="text" height={20} className="w-full" />
            <Skeleton variant="text" height={20} className="w-full" />
          </div>
        </div>
       ))}
    </div>
  )
}

export default NotificationListSkeleton;