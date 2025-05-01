import { Skeleton } from "@mui/material";
import React from "react";

const CourseCategoriesSkeleton = () => {
  return (
    <div className="flex gap-2 py-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index + 1}
          variant="rectangular"
          width={200}
          height={50}
        />
      ))}
    </div>
  );
};

export default CourseCategoriesSkeleton;
