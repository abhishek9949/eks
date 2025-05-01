import React, { useCallback, useState } from "react";
import {
  Box as BoxCont,
  Checkbox,
  List as ListCont,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  Collapse as MuiCollapse,
  Typography as ChannelTitles,
  Paper as MuiPaper,
  IconButton as IconBtn,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SingleBlockedChannelPropType } from "@/types/chatAdminTypes";

interface Item {
  blocked_channel_id: number;
  organisation_name?: string | null;
}

const StyledChannelPaper = styled(MuiPaper)(({ theme }) => ({
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledListChannelItem = styled(MuiListItem)(({ theme }) => ({
  borderRadius: "8px",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.3s ease",
  },
}));

const SingleBlockedChannel = ({
  channel_name,
  items,
  onSelect,
  selectedItems,
  handleSelectAll,
}: SingleBlockedChannelPropType) => {
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
    items.every((item) => selectedItems.includes(item.blocked_channel_id));
  const someSelected = items.some((item) =>
    selectedItems.includes(item.blocked_channel_id),
  );

  return (
    <StyledChannelPaper>
      <BoxCont
        onClick={handleToggle}
        className="!flex !cursor-pointer !items-center"
      >
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={() => handleSelectAll(items)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select all channels"
          disableRipple
        />
        <ChannelTitles variant="h6" sx={{ flexGrow: 1 }}>
          {channel_name}
        </ChannelTitles>

        <IconBtn size="small" aria-label={isExpanded ? "Collapse" : "Expand"}>
          <ExpandMoreIcon
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </IconBtn>
      </BoxCont>

      <MuiCollapse in={isExpanded} timeout={300} className="px-5">
        <BoxCont className="px-10">
          <BoxCont className="mt-5">
            <ChannelTitles variant="body2" color="textSecondary">
              Blocked for:
            </ChannelTitles>
          </BoxCont>
          <ListCont
            sx={{
              overflow: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
            className="!pb-0"
          >
            {items.slice(0, organizationListCount).map((item: Item) => (
              <StyledListChannelItem
                key={item.blocked_channel_id}
                dense
                onClick={() => handleItemCheck(item.blocked_channel_id)}
                className="!mb-0 !pb-0"
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedItems.includes(item.blocked_channel_id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.organisation_name || "Individual Educator"}
                />
              </StyledListChannelItem>
            ))}
          </ListCont>
          {items.length > organizationListCount && (
            <button
              onClick={toggleExpand}
              className="flex cursor-pointer items-center text-blue-500"
            >
              <span>See More</span>
              <ExpandMoreIcon className="ml-1 h-5 w-5" />
            </button>
          )}
        </BoxCont>
      </MuiCollapse>
    </StyledChannelPaper>
  );
};

export default SingleBlockedChannel;
