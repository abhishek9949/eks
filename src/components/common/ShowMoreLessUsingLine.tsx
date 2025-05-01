import React, { useState, useRef, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ShowMoreLessUsingLine = ({
  content,
  showButtons = false,
  lineLimit = 2,
}: {
  content: string;
  showButtons: boolean;
  lineLimit?: number;
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Measure the actual height of the content
      const fullHeight = contentRef.current.scrollHeight;
      // Calculate the expected height for the limited number of lines
      const lineHeight = parseInt(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * lineLimit;

      setIsTruncated(fullHeight > maxHeight);
    }
  }, [content, lineLimit]);

  return (
    <div>
      <div
        ref={contentRef}
        // Here style prop is needed for this particular component styling, with sx prop the same styles are not achivable
        style={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: showFullContent ? "unset" : lineLimit,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Show the button only if truncation is needed */}
      {showButtons && isTruncated && (
        <button
          type="button"
          onClick={() => {
            setShowFullContent(!showFullContent);
          }}
          className="text-lg font-medium text-primary"
        >
          {showFullContent ? (
            <span>
              show less <KeyboardArrowUpIcon />
            </span>
          ) : (
            <span>
              show more <KeyboardArrowDownIcon />
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ShowMoreLessUsingLine;
