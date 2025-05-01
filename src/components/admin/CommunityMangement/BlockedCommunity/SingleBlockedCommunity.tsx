import React, { useCallback, useState } from "react";
import {
  Box as ForumBoxCont,
  Checkbox,
  List as ForumListCont,
  ListItem as MuiForumListItem,
  ListItemIcon,
  ListItemText,
  Collapse as MuiForumCollapse,
  Typography as ForumTitles,
  Paper as MuiForumPaper,
  IconButton as ForumIconBtn,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SingleBlockedCommunityPropType } from "@/types/community/BlockedCommunityType";

interface Item {
  blocked_community_id: number;
  organisation_name?: string | null;
}

const StyledCommunityPaper = styled(MuiForumPaper)(({ theme }) => ({
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledListCommunityItem = styled(MuiForumListItem)(({ theme }) => ({
  borderRadius: "8px",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.3s ease",
  },
}));

const SingleBlockedCommunity = ({
  community_title,
  items,
  onSelect,
  selectedItems,
  handleSelectAll,
}: SingleBlockedCommunityPropType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [organizationListCount, setOrganizationListCount] = useState(4);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleItemCheck = useCallback(
    (itemId: number) => {
      onSelect((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId],
      );
    },
    [onSelect],
  );

  const toggleExpand = useCallback(() => {
    setOrganizationListCount((prev) => prev + 4);
  }, []);

  const allSelected =
    items.length > 0 &&
    items.every((item) => selectedItems.includes(item.blocked_community_id));
  const someSelected = items.some((item) =>
    selectedItems.includes(item.blocked_community_id),
  );

  return (
    <StyledCommunityPaper>
      <ForumBoxCont
        onClick={handleToggle}
        className="!flex !cursor-pointer !items-center"
      >
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={() => handleSelectAll(items)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select all community"
          disableRipple
        />
        <ForumTitles variant="h6" sx={{ flexGrow: 1 }}>
          {community_title}
        </ForumTitles>

        <ForumIconBtn
          size="small"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <ExpandMoreIcon
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </ForumIconBtn>
      </ForumBoxCont>

      <MuiForumCollapse in={isExpanded} timeout={300} className="px-5">
        <ForumBoxCont className="px-10">
          <ForumBoxCont className="mt-5">
            <ForumTitles variant="body2" color="textSecondary">
              Blocked for:
            </ForumTitles>
          </ForumBoxCont>
          <ForumListCont
            sx={{
              overflow: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
            className="!pb-0"
          >
            {items.slice(0, organizationListCount).map((item: Item) => (
              <StyledListCommunityItem
                key={item.blocked_community_id}
                dense
                onClick={() => handleItemCheck(item.blocked_community_id)}
                className="!mb-0 !pb-0"
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedItems.includes(item.blocked_community_id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.organisation_name || "Individual Educator"}
                />
              </StyledListCommunityItem>
            ))}
          </ForumListCont>
          {items.length > organizationListCount && (
            <button
              onClick={toggleExpand}
              className="flex cursor-pointer items-center text-blue-500"
            >
              <span>See More</span>
              <ExpandMoreIcon className="ml-1 h-5 w-5" />
            </button>
          )}
        </ForumBoxCont>
      </MuiForumCollapse>
    </StyledCommunityPaper>
  );
};

export default SingleBlockedCommunity;
