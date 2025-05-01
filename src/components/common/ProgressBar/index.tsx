"use client";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { darkenColor, formatDuration } from "@/utils/reusableFunctions";
import { CardProps } from "@/types/card";

const ProgressBar = ({ course }: CardProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [arrowLeft, setArrowLeft] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const courseColor = course?.categories?.[0]?.color ?? "#CCCCCC";
  const watchDuration = course?.watch_duration || 0;
  const totalDuration = course?.file?.duration || 0;

  const progressPercentage = totalDuration
    ? (watchDuration / totalDuration) * 100
    : 0;
  const minutesLeft = formatDuration(totalDuration - watchDuration);

  const handleMouseEnter = () => setIsTooltipVisible(true);
  const handleMouseLeave = () => setIsTooltipVisible(false);

  useEffect(() => {
    if (!isTooltipVisible) return;
    if (!containerRef.current || !tooltipRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const tooltipWidth = tooltipRef.current.offsetWidth;

    const rawAnchorX = (progressPercentage / 100) * containerWidth;

    const edgeGap = 12;
    const anchorX = Math.max(
      edgeGap,
      Math.min(containerWidth - edgeGap, rawAnchorX),
    );

    let newTooltipLeft = anchorX - tooltipWidth / 2;
    if (newTooltipLeft < 0) {
      newTooltipLeft = 0;
    } else if (newTooltipLeft + tooltipWidth > containerWidth) {
      newTooltipLeft = containerWidth - tooltipWidth;
    }

    const arrowShift = 8;
    let newArrowLeft = anchorX - newTooltipLeft - arrowShift;

    if (newArrowLeft < edgeGap) {
      newArrowLeft = edgeGap;
    } else if (newArrowLeft > tooltipWidth - edgeGap) {
      newArrowLeft = tooltipWidth - edgeGap;
    }

    setTooltipLeft(newTooltipLeft);
    setArrowLeft(newArrowLeft);
  }, [isTooltipVisible, progressPercentage]);

  return (
    <div ref={containerRef} className="relative h-2 w-full rounded-md">
      {/* Full progress bar background */}
      <div className="h-full w-full" style={{ backgroundColor: courseColor }} />

      {/* Completed portion of the progress bar (darker shade) */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{
          width: `${progressPercentage}%`,
          backgroundColor: darkenColor(courseColor, 0.4),
        }}
      />

      {/* Hover area over the completed portion */}
      {watchDuration > 0 && watchDuration < totalDuration && (
        <button
          className="absolute left-0 top-0 h-full"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: "transparent",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isTooltipVisible && minutesLeft !== "0 sec" && (
            <div
              ref={tooltipRef}
              className={clsx(
                "absolute w-auto whitespace-nowrap rounded-lg bg-gray-7 px-3.5 py-1 text-sm font-normal text-white",
              )}
              style={{
                left: `${tooltipLeft}px`,
                top: "1rem",
              }}
            >
              {minutesLeft} left
              {/* The arrow */}
              <div
                className="absolute bottom-full h-0 w-0"
                style={{
                  left: `${arrowLeft}px`,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: "6px solid black",
                }}
              />
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default ProgressBar;
