import { useState, MouseEvent, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Typography,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  getTimeFromTimestamp,
  timeDifference,
} from "@/utils/reusableFunctions";
import {
  useLazyGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
} from "@/redux/allReducer";
import {
  InitialNotificationListDataProps,
  NotificationListDataProps,
} from "@/types/notifications";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const DropdownNotification = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [getNotificationList] = useLazyGetNotificationListQuery();
  const [notificationData, setNotificationData] =
    useState<NotificationListDataProps>(InitialNotificationListDataProps);
  const dispatch = useAppDispatch();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetNotificationList = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", "1");
    queryParams.set("page_size", "5");
    getNotificationList({
      endpoint: `${API_CONSTANTS.GET_NOTIFICATION_LIST}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((res) => {
        setNotificationData(res?.data);
        setUnreadCount(res?.unread_count);
      })
      .catch((error) => {
        setNotificationData(InitialNotificationListDataProps);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  }, [dispatch, getNotificationList]);

  useEffect(() => {
    handleGetNotificationList();
    const intervalId = setInterval(() => {
      handleGetNotificationList();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [handleGetNotificationList]);

  const handleMarkNotificationAsRead = (notificationId: number) => {
    markNotificationAsRead({
      endpoint: API_CONSTANTS.MARK_NOTIFICATION_AS_READ,
      method: "POST",
      data: {
        notification_ids: [notificationId],
      },
    }).unwrap();
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={unreadCount}
          color="primary"
          className="rounded-2xl"
        >
          <NotificationsIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { width: 320 } }}
      >
        <Box
          px={2}
          py={1}
          display="flex"
          alignItems="center"
          gap={3}
          className="shadow-default"
        >
          <Typography
            variant="h6"
            className="text-base font-medium leading-normal text-gray-30"
          >
            Notifications
          </Typography>
          <Badge
            badgeContent={unreadCount}
            color="primary"
            className="rounded-2xl"
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          marginBottom={1}
          marginTop={1}
        >
          {notificationData?.results?.length === 0 ? (
            <div className="flex items-center justify-center p-20">
              <p className="text-xl text-black">No notifications</p>
            </div>
          ) : (
            <>
              {notificationData?.results?.slice(0, 5)?.map((item) => (
                <Link href={item?.target_url} key={item?.notification_id} onClick={() => handleMarkNotificationAsRead(item?.notification_id)}>
                  <MenuItem onClick={handleClose} className="w-full">
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      justifyContent="space-between"
                      className="w-full"
                    >
                      <Box
                        display="flex"
                        className="w-full"
                        gap={2}
                        alignItems="center"
                      >
                        <Image
                          width={32}
                          height={32}
                          src={item.icon_url || "/svg/account_circle.svg"}
                          alt="notification image"
                          className="!h-8 !w-8"
                        />
                        <Box
                          display="flex"
                          flexDirection="column"
                          className="w-full gap-1"
                        >
                          <Typography className="w-[90%] overflow-hidden text-ellipsis text-sm font-medium leading-tight text-neutral-700">
                            {item.title}
                          </Typography>
                          <Typography className="w-[90%] overflow-hidden text-ellipsis text-xs font-normal leading-tight text-gray-500">
                            {item.body}
                          </Typography>
                          <Typography className="text-xs font-normal leading-none text-neutral-700">
                            {timeDifference(item?.created_at)} |{" "}
                            {getTimeFromTimestamp(item?.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      {!item?.is_read && (
                        <Box
                          data-testid={`unread-indicator-${item.notification_id}`}
                          className="h-2.5 w-2.5 rounded-full bg-orange-600"
                        />
                      )}
                    </Box>
                  </MenuItem>
                </Link>
              ))}
            </>
          )}
        </Box>
        <MenuItem
          onClick={handleClose}
          className="border-t border-solid border-[#DCDEE4]"
        >
          <Link href={URL_CONSTANTS.NOTIFICATIONS} className="w-full">
            <Typography
              textAlign="center"
              width="100%"
              className="pt-1 text-xs font-medium leading-normal text-gray-32"
            >
              Go to all notifications
            </Typography>
          </Link>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DropdownNotification;
