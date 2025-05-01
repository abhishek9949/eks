import React from "react";
import { List, ListItem, ListItemText, Skeleton } from "@mui/material";
import clsx from "clsx";

const ChatHistorySkeleton = () => {
  return (
    <List className="flex flex-col gap-3 mt-auto">
      {Array.from({ length: 7 }).map((_, index) => (
        <ListItem
          key={index + 1}
          className={clsx(
            "flex w-[50%] !p-0",
            index % 2 === 0 ? "ml-auto" : "mr-auto",
          )}
        >
          <ListItemText>
            <Skeleton variant="text" height={70} />
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default ChatHistorySkeleton;
