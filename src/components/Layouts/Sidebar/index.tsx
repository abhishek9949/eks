"use client";

import React, { useState, useEffect, Suspense } from "react";
import SearchForm from "@/components/Layouts/Header/SearchFormWithFilter";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  useMediaQuery,
  Theme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import SidebarSkeleton from "./SidebarSkeleton";
import { mapItemsToPermissions } from "@/utils/permissionFormate";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { PermissionProps, SidebarItemProps } from "@/types/sidebar";
import Loader from "@/components/common/Loader";
import Chats from "@/components/Chats";
import SidebarNavListComponent from "./SidebarNavListComponent";
import { ExpandMoreOutlined } from "@mui/icons-material";
import clsx from "clsx";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}
const Sidebar: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const isLaptop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const routeName = usePathname();
  const { cookies, status } = useAppSelector((state) => state.cookies);

  const [openMenu, setOpenMenu] = useState<string>("");
  const [selectedPage, setSelectedPage] = useLocalStorage("selectedMenu", "");
  const [selectedChild, setSelectedChild] = useLocalStorage(
    "selectedChild",
    "",
  );
  const [educatorMenuItems, setEducatorMenuItems] = useState<
    SidebarItemProps[]
  >([]);
  const [adminMenuItems, setAdminMenuItems] = useState<SidebarItemProps[]>([]);
  const currentRole = cookies?.currentRoleCookie?.role_id;

  useEffect(() => {
    if (cookies && typeof cookies === "object") {
      const { educatorMenuItems, adminMenuItems } = mapItemsToPermissions(
        (cookies.permissionCookie as PermissionProps[]) ?? [],
      );
      setEducatorMenuItems(educatorMenuItems ?? []);
      setAdminMenuItems(adminMenuItems ?? []);
    }
  }, [cookies]);

  if (!cookies || status === "loading") {
    return <SidebarSkeleton />;
  }

  const handleMenuClick = (
    permissionName: string,
    permissionType: "parent" | "child",
  ) => {
    if (!isLaptop) setSidebarOpen(!sidebarOpen);

    if (permissionType === "parent") {
      setSelectedPage(permissionName);
      setSelectedChild("");
    } else {
      setSelectedChild(permissionName);
    }
    setOpenMenu(permissionName === openMenu ? "" : permissionName);
  };

  const hanldeEventPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <div className="lg:hidden xl:hidden">
        <Suspense fallback={<Loader />}>
          <SearchForm />
        </Suspense>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <div className="flex flex-col gap-3">
          {adminMenuItems?.length > 0 && (
            <Accordion className="!m-0 border !shadow-none" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                onClick={hanldeEventPropagation}
                sx={{
                  "&.Mui-expanded": {
                    minHeight: 48,
                  },
                  "& .MuiAccordionSummary-content": {
                    transition: "font-weight 0.2s",
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: "12px 0",
                    fontWeight: "bold",
                  },
                }}
              >
                <Typography>
                  Admin Routes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SidebarNavListComponent
                  permissions={adminMenuItems}
                  selectedPage={selectedPage}
                  handleMenuClick={handleMenuClick}
                  routeName={routeName}
                  selectedChild={selectedChild}
                />
              </AccordionDetails>
            </Accordion>
          )}
          {currentRole === 6 || currentRole === 2 ? (
            <SidebarNavListComponent
              permissions={educatorMenuItems}
              selectedPage={selectedPage}
              handleMenuClick={handleMenuClick}
              routeName={routeName}
              selectedChild={selectedChild}
            />
          ) : (
            <>
              {educatorMenuItems?.length > 0 && (
                <Accordion
                  className="!m-0 border !shadow-none"
                  sx={{
                    "&::before": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreOutlined />}
                    onClick={hanldeEventPropagation}
                    sx={{
                      "&.Mui-expanded": {
                        minHeight: 48,
                      },
                      "& .MuiAccordionSummary-content.Mui-expanded": {
                        margin: "12px 0",
                      },
                    }}
                  >
                    <Typography className={clsx(`[&.Mui-expanded]:font-bold`)}>
                      Educator Routes
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SidebarNavListComponent
                      permissions={educatorMenuItems}
                      selectedPage={selectedPage}
                      handleMenuClick={handleMenuClick}
                      routeName={routeName}
                      selectedChild={selectedChild}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
            </>
          )}
        </div>
        {routeName?.includes("chats") && !routeName?.includes("admin") && (
          <Chats setSidebarOpen={setSidebarOpen} />
        )}
      </div>
    </>
  );
};

export default Sidebar;
