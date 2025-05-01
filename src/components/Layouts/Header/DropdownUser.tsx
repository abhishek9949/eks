"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ClickOutside from "@/components/common/ClickOutside";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import {
  Divider,
  List,
  ListItem,
  ListSubheader,
  Typography,
  CircularProgress,
  Skeleton,
  Dialog,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import clsx from "clsx";
import useLocalStorage from "@/hooks/useLocalStorage";
import CustomAvatar from "@/components/common/CustomAvatar";
import { useLogout } from "@/hooks/useLogout";
import { capitalizeWords } from "@/utils/reusableFunctions";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import LoginPageComp from "@/components/Login/LoginPageComp";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const DropdownUser = () => {
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logout = useLogout(); // Use the logout hook
  const [accountList, setAccountList] = useState<
    {
      email: string;
      full_name: string;
      profile: string;
      token: string;
      isActiveAccount: boolean;
    }[]
  >([]);
  const [userinfo, setUserinfo] = useState<{
    email?: string;
    full_name?: string;
    profile?: string;
  }>({});
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const { cookies, status } = useAppSelector((state) => state.cookies);
  const [_, setPageName] = useLocalStorage("selectedMenu", "");
  const [openAddAccount, setOpenAddAccount] = useState(false);

  useEffect(() => {
    if (cookies && typeof cookies === "object") {
      setAccountList(cookies.currentAccountCookie ?? []);
      setUserinfo(cookies.userCookies ?? {});
    }
  }, [cookies]);

  if (!cookies) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  const switchAccount = async (email: string, token: string) => {
    setLoadingEmail(email);
    try {
      const res = await fetch("/api/switchAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to switch account");
      const data = await res.json();
      localStorage.setItem("access_token", data?.access_token);
      dispatch(
        showToastMessage({
          message: data?.message || "Account switched successfully!",
          severity: "success",
        }),
      );
      if (data.redirect) {
        setPageName(data.redirect.name);
        window.location.href = data.redirect.url;
      }
    } catch (error) {
      console.error("Error switching account:", error);
      dispatch(
        showToastMessage({
          message: "Error switching the account",
          severity: "error",
        }),
      );
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <>
      <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
        <button
          onClick={(e) => {
            setDropdownOpen((prev) => !prev);
          }}
          className="flex items-center gap-4"
        >
          {status === "succeeded" && userinfo.full_name && (
            <CustomAvatar
              src={userinfo.profile}
              name={userinfo.full_name ?? ""}
              randomColor
              width={40}
              height={40}
            />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-5 flex w-[320px] flex-col rounded-lg border border-stroke bg-white shadow-default">
            <nav
              aria-label="User Info"
              className="rounded-t-lg bg-primary text-white"
            >
              <Link
                href={URL_CONSTANTS.MY_PROFILE}
                onClick={() => setDropdownOpen(false)}
              >
                <div className="mx-auto my-2 w-fit">
                  <div className="group flex flex-col items-center text-center">
                    <div className="relative mb-1 rounded-full border-2 border-dashed border-white p-1">
                      <CustomAvatar
                        src={userinfo?.profile}
                        width={70}
                        height={70}
                      />
                    </div>
                    <Typography
                      variant="h6"
                      className="text-base font-semibold text-white"
                    >
                      Hey,{" "}
                      {capitalizeWords(
                        userinfo?.full_name?.split(" ")?.[0] || "Unknown",
                      )}
                    </Typography>
                  </div>
                </div>
              </Link>
            </nav>

            {/* <Divider /> */}

            {accountList.length > 1 && (
              <>
                <nav aria-label="Accounts" className="px-4 py-2">
                  <div className="mb-2">
                    <Typography
                      variant="subtitle2"
                      className="text-xs font-semibold uppercase tracking-wide text-gray-800"
                    >
                      Switch Account
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    {accountList.map(
                      (
                        { email, full_name, profile, token, isActiveAccount },
                        index,
                      ) => (
                        <React.Fragment key={email}>
                          {isActiveAccount === false && (
                            <div
                              className={clsx(
                                "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all",
                                "hover:bg-gray-50 hover:shadow-sm",
                                "border border-gray-200",
                              )}
                              onClick={() => {
                                switchAccount(email, token);
                              }}
                            >
                              <div className="relative">
                                {loadingEmail === email ? (
                                  <>
                                    <CustomAvatar
                                      src={profile}
                                      width={40}
                                      height={40}
                                    />
                                    <CircularProgress
                                      size={46}
                                      thickness={2}
                                      className="!absolute -left-[3px] -top-[3px] text-primary"
                                    />
                                  </>
                                ) : (
                                  <CustomAvatar
                                    src={profile}
                                    width={40}
                                    height={40}
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <Typography
                                  variant="body1"
                                  className="truncate text-sm font-medium text-primary"
                                >
                                  {capitalizeWords(full_name)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="truncate text-xs text-gray-700"
                                >
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </div>
                </nav>
                <Divider />
              </>
            )}

            {/* Add Account Button */}
            <div className="px-4 py-2">
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={() => setOpenAddAccount(true)}
              >
                <span>
                  <PersonAddAltOutlinedIcon />
                </span>
                <span>Add Account</span>
              </button>
            </div>

            {/* Logout Button */}
            <nav aria-label="Logout">
              <div className="px-4 py-2">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <ExitToAppOutlinedIcon
                    fontSize="small"
                    className="text-red-500"
                  />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </ClickOutside>
      <Dialog
        open={openAddAccount}
        onClose={() => setOpenAddAccount(false)}
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 5,
              overflowY: "auto",
              maxHeight: "90vh",
              // Hide scrollbar but keep scrolling
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For Internet Explorer/Edge
            },
          },
        }}
      >
        <LoginPageComp
          handleCloseAddAccountPopup={() => setOpenAddAccount(false)}
        />
      </Dialog>
    </>
  );
};

export default DropdownUser;
