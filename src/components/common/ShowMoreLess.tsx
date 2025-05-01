import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ShowMoreLess = ({
  content,
  showButtons = false,
  wordLimit = 50,
}: {
  content: string;
  showButtons: boolean;
  wordLimit?: number;
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const decodeHTMLAndTruncate = (htmlContent: string, wordLimit: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent ?? (tempDiv.innerText || ""); // Decode HTML to plain text
    const words = text.split(/\s+/); // Split text into words

    // Check if truncation is needed
    if (words.length <= wordLimit) {
      return { truncated: htmlContent, isTruncated: false };
    }

    // Truncate plain text and re-wrap in HTML
    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
    const truncatedHTML = `<div>${truncatedText}</div>`;
    return { truncated: truncatedHTML, isTruncated: true };
  };

  const { truncated, isTruncated } = decodeHTMLAndTruncate(content, wordLimit);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: showFullContent ? content : truncated,
        }}
      />

      {/* Show the button only if truncation is needed */}
      {showButtons && (
        <>
          {isTruncated && (
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
        </>
      )}
    </>
  );
};

export default ShowMoreLess;
