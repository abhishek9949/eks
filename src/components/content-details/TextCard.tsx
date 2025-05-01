import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Link from "next/link";
import clsx from "clsx";
import { capitalizeWords } from "@/utils/reusableFunctions";
import { URL_CONSTANTS } from "@/constants/routingUrl";
interface TextCardProps {
  text: string;
  createdBy: string;
  viewsCount: number;
  createdById: number;
}

const TextCard: React.FC<TextCardProps> = ({ text, createdBy, viewsCount, createdById }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [text]);

  return (
    <Card className={clsx("mt-5 p-5 Shadow-articlecard")}>
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-3">Published by : <Link href={`${URL_CONSTANTS.CONTENT_CREATOR_PROFILE_FOR_EDUCATOR}/${createdById}`} className="font-semibold text-primary">{capitalizeWords(createdBy)}</Link></div>
        <div className="col-span-2 col-start-5 flex justify-end">
          {viewsCount} Views
        </div>
      </div>
      <hr className="mb-3 mt-3" />
      <CardContent className="!p-0">
      <Typography
        ref={textRef}
        variant="body2"
        className={`${isExpanded ? "line-clamp-none" : "line-clamp-2"} text-gray-4 text-lg`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {isOverflowing && (
        <button
          onClick={toggleExpand}
          className="mt-2 flex items-center text-blue-500 cursor-pointer"
        >
          <span>{isExpanded ? "See Less" : "See More"}</span>
          {isExpanded ? (
            <ExpandLessIcon className="ml-1 h-5 w-5" />
          ) : (
            <ExpandMoreIcon className="ml-1 h-5 w-5" />
          )}
        </button>
      )}
    </CardContent>
    </Card>
  );
};

export default TextCard;
