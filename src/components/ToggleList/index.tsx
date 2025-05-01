import React, { useCallback, useState } from "react";
import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import ContentTypeIcon from "@/components/content-details/ContentTypeIcon";
import CourseCategories from "@/components/common/CourseCategories";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Item {
  blocked_content_id: number;
  organisation_name?: string | null;
}

interface ExpandableToggleProps {
  title: string;
  items: Item[];
  categories: string[];
  contentType: string;
  author_name: string;
  onSelect: React.Dispatch<React.SetStateAction<number[]>>;
  selectedItems: number[];
  handleSelectAll: (items: Item[]) => void;
  isAdmin: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "8px",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.3s ease",
  },
}));

const ExpandableToggle = ({
  title,
  items,
  categories,
  contentType,
  onSelect,
  selectedItems,
  handleSelectAll,
  isAdmin,
  author_name,
}: ExpandableToggleProps) => {
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
    items.every((item) => selectedItems.includes(item.blocked_content_id));
  const someSelected = items.some((item) =>
    selectedItems.includes(item.blocked_content_id),
  );

  return (
    <StyledPaper>
      <Box onClick={handleToggle} className="!flex !items-center !cursor-pointer">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={() => handleSelectAll(items)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select all items"
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <IconButton
          size="small"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <ExpandMoreIcon
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </IconButton>

        <ContentTypeIcon contentType={contentType} />
      </Box>

      <Collapse in={isExpanded} timeout={300} className="px-5">
        <Box display="flex" justifyContent="space-between" ml={6} mb={2}>
          <CourseCategories
            tags={categories}
            fontSize="sm"
            gap="2.5"
            customClass="!py-1"
          />
          {author_name && (
            <Typography variant="body2" color="textSecondary" align="right">
              Created By: {author_name}
            </Typography>
          )}
        </Box>
        {isAdmin && (
          <Box className="px-10">
            <Box className="mt-5">
              <Typography variant="body2" color="textSecondary">
                Blocked for:
              </Typography>
            </Box>
            <List
              sx={{
                overflow: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
              className="!pb-0"
            >
              {items.slice(0, organizationListCount).map((item: Item) => (
                <StyledListItem
                  key={item.blocked_content_id}
                  dense
                  onClick={() => handleItemCheck(item.blocked_content_id)}
                  className="!mb-0 !pb-0"
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedItems.includes(item.blocked_content_id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.organisation_name ?? "Individual Educator"}
                  />
                </StyledListItem>
              ))}
            </List>
            {items.length > organizationListCount && (
              <button
                onClick={toggleExpand}
                className="flex cursor-pointer items-center text-blue-500"
              >
                <span>See More</span>
                <ExpandMoreIcon className="ml-1 h-5 w-5" />
              </button>
            )}
          </Box>
        )}
      </Collapse>
    </StyledPaper>
  );
};

export default ExpandableToggle;
