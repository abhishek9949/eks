import { List, ListItem, ListItemIcon, ListItemText, Skeleton } from "@mui/material";

const SidebarSkeleton = () => {
  return (
      <List>
        {Array.from({ length: 4 }).map((_, index) => (
          <ListItem key={index}  className="!border">
            <ListItemIcon>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <ListItemText>
              <Skeleton variant="text" width="85%" />
            </ListItemText>
          </ListItem>
        ))}
      </List>
  );
};

export default SidebarSkeleton;
