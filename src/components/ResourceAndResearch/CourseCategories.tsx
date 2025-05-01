"use client";
import React, { useRef, useState } from "react";
import { CourseCategoriesProps } from "@/types/course";
import clsx from "clsx";
import styles from "./CourseCategories.module.scss";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import CourseCategoriesSkeleton from "./CourseCategoriesSkeleton";

const CourseCategories = ({
  filters,
  selectedCategoryFilter,
  handleFilterCategoryList,
  isCategoriesLoading
}: CourseCategoriesProps) => {
  const { updateSearchParams } = useUpdateSearchParams();

  const handleOnClickFilter = (filterId: number | null) => {
    if (filterId !== selectedCategoryFilter) handleFilterCategoryList(filterId);
    updateSearchParams({ categoryId: filterId });
  };

  const scrollRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for sensitivity
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isCategoriesLoading) {
    return <CourseCategoriesSkeleton />
  }

  return (
    <button
      type="button"
      className={clsx(
        "sticky z-9 w-full cursor-grab overflow-x-auto bg-white py-5",
        styles.hideScrollbar,
        isDragging && "cursor-grabbing",
      )}
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex min-w-max flex-row gap-3">
        <button
          className={clsx(
            "min-w-16 cursor-pointer rounded border border-gray p-2.5 text-center",
            selectedCategoryFilter === null
              ? "bg-primary text-white"
              : "bg-white text-black",
          )}
          onClick={() => handleOnClickFilter(null)}
        >
          <span className="text-lg font-medium">All</span>
        </button>
        {filters?.map((filter: any) => (
          <button
            key={filter?.category_id}
            className={clsx(
              "min-w-16 cursor-pointer rounded border border-gray p-2.5 text-center",
              selectedCategoryFilter === filter?.category_id
                ? "bg-primary text-white"
                : "bg-white text-black",
            )}
            onClick={() => handleOnClickFilter(filter?.category_id)}
          >
            <span className="text-lg font-medium">{filter?.name}</span>
          </button>
        ))}
      </div>
    </button>
  );
};

export default CourseCategories;
