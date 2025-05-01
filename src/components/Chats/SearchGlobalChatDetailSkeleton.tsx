import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";

const SearchGlobalChatDetailSkeleton = ({ noOfItems }: { noOfItems ?: number}) => {
  return (
    <List className="flex flex-col gap-3" data-testid="skeleton-loader">
      {Array.from({ length: noOfItems ?? 6 }).map((_, index) => (
        <ListItem key={index + 1} className="w-full !p-0">
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText>
            <Skeleton variant="text" height={50} />
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default SearchGlobalChatDetailSkeleton;
