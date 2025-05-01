import { GroupOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import clsx from "clsx";
import React from "react";
import CustomAvatar from "@/components/common/CustomAvatar";
import { ChatIconComponentProps } from "@/types/chats";

const ChatIconComponent = ({
  type,
  width,
  isChatPopup = false,
  isAccordion = false,
  src,
  name,
}: ChatIconComponentProps) => {
  return (
    <>
      {type === "group" && (
        <>
          {isAccordion ? (
            <GroupOutlined className="h-6 w-6" data-testid="group-accordion-icon" />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="rounded-full bg-sky-100"
              sx={{ width, height: width }}
            >
              <GroupOutlined
                className={clsx(isChatPopup ? "h-6 w-6" : "h-8 w-8")}
                data-testid="group-icon"
              />
            </Box>
          )}
        </>
      )}
      {type === "private" && (
        <CustomAvatar
          key={name}
          name={name}
          width={width ?? 24}
          height={width ?? 24}
          src={src}
          randomColor
        />
      )}
      {type === "channel" && (
        <>
          {isAccordion ? (
            <span className="text-xl">#</span>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="rounded-full bg-sky-100"
              sx={{ width, height: width }}
              data-testid="channel-icon"
            >
              <span
                className={clsx(
                  "font-bold",
                  isChatPopup ? "text-xl" : "text-2xl",
                )}
              >
                #
              </span>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ChatIconComponent;
