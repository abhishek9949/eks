import BinLogoOutlined from "@/components/common/BinLogoOutlined";
import { SidebarNavListComponentProps } from "@/types/sidebar";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const SidebarNavListComponent = ({
  permissions,
  selectedPage,
  handleMenuClick,
  routeName,
  selectedChild,
}: SidebarNavListComponentProps) => {
  return (
    <nav>
      <List component="div" disablePadding>
        {permissions.map((menuItem, index) => {
          const { permission_name, navigation, subpermissions, icon } =
            menuItem;
          const isActive = selectedPage === permission_name;

          return (
            <nav
              key={`Sidebar-${index}-${permission_name}`}
              aria-label="side-menu"
              className="!border"
            >
              <ListItemButton
                component={navigation ? Link : "button"}
                href={navigation}
                onClick={() => handleMenuClick(permission_name, "parent")}
                className={clsx(
                  "!group !flex !w-full !items-center !px-3 !py-2.5 duration-300",
                  isActive
                    ? "!hover:bg-primary-dark !bg-primary !text-white"
                    : "!hover:bg-gray-200 !text-gray-17",
                )}
              >
                {icon && (
                  <ListItemIcon
                    className={clsx(isActive ? "!text-white" : "!text-gray-17")}
                  >
                    {isActive && permission_name === "Bins" ? (
                      <div className="relative h-8 w-8">
                        <BinLogoOutlined color="#FFFFFF" />
                      </div>
                    ) : (
                      icon
                    )}
                  </ListItemIcon>
                )}
                <ListItemText primary={permission_name} />
              </ListItemButton>

              {subpermissions && (
                <Collapse in={isActive} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subpermissions.map((child, idx) => {
                      const { icon: childIcon } = child;
                      const isChildActive =
                        routeName === child.navigation ||
                        selectedChild === child.navigation;
                      return (
                        <ListItemButton
                          key={`Sidebar-sub-${index}-${idx}-${child.permission_name}`}
                          component={child.navigation ? Link : "a"}
                          href={child.navigation}
                          onClick={() =>
                            handleMenuClick(child.navigation, "child")
                          }
                          className={clsx(
                            "!py-2 !pl-9",
                            isChildActive
                              ? "!hover:bg-primary-light !font-semibold !text-primary"
                              : "!text-dark-4 !hover:bg-gray-200",
                          )}
                        >
                          {childIcon && (
                            <ListItemIcon
                              className={clsx(
                                isChildActive
                                  ? "!hover:bg-primary-light font-semibold !text-primary"
                                  : "!hover:bg-gray-200 !text-gray-4",
                              )}
                            >
                              {isChildActive &&
                              child.permission_name === "My Bin" ? (
                                <div className="relative h-8 w-8">
                                  <BinLogoOutlined color="#006BA6" />
                                </div>
                              ) : (
                                childIcon
                              )}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={child.permission_name} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </nav>
          );
        })}
      </List>
    </nav>
  );
};

export default SidebarNavListComponent;
