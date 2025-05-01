"use client";

import React from "react";
import PageMetaData from "@/components/common/PageMetaData";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const ChatsPageAdmin = () => {
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  return (
    <div className="pt-5.5">
      <PageMetaData title="Chats" />
      <div className="flex items-center text-2xl">
        <span>Manage Chats & Channels</span>
      </div>
      <div className="my-15">
        <div className="mb-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {checkPermissionExists(
              PERMISSIONS.CHAT_MANAGEMENT.LIST_CHANNEL,
              permissions,
            ) && (
              <Link
                href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_CHANNEL}
                className="cursor-pointer rounded border border-primary p-3 hover:bg-blue-light-6"
              >
                <p className="flex items-center gap-2 !text-xl text-primary">
                  Channel List <ArrowForwardIcon className="!text-xl" />
                </p>
                <div>
                  Retrieve the complete list of channels, including options to
                  update, delete, and block them.
                </div>
              </Link>
            )}
            {checkPermissionExists(
              PERMISSIONS.CHAT_MANAGEMENT.CREATE_CHANNEL,
              permissions,
            ) && (
              <Link
                href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_CHANNEL}
                className="cursor-pointer rounded border border-primary p-3 hover:bg-blue-light-6"
              >
                <p className="flex items-center gap-2 !text-xl text-primary">
                  Create Channel <ArrowForwardIcon className="!text-xl" />
                </p>
                <div>
                  Create private or public channels with the ability to add
                  members.
                </div>
              </Link>
            )}
            {checkPermissionExists(
              PERMISSIONS.CHAT_MANAGEMENT.BLOCKED_CHANNEL,
              permissions,
            ) && (
              <Link
                href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_BLOCKED_CHANNEL}
                className="cursor-pointer rounded border border-primary p-3 hover:bg-blue-light-6"
              >
                <p className="flex items-center gap-2 !text-xl text-primary">
                  Blocked Channel List <ArrowForwardIcon className="!text-xl" />
                </p>
                <div>
                  Retrieve a list of all blocked channels with the option to
                  unblock them.
                </div>
              </Link>
            )}
          </div>
        </div>
        {/* <div>
          <p className="text-xl">Groups :</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/admin/chats/group/view"
              className="cursor-pointer rounded border border-primary p-3 hover:bg-blue-light-6"
            >
              <p className="flex items-center gap-2 !text-xl text-primary">
                Group List <ArrowForwardIcon className="!text-xl" />
              </p>
              <div>
                Retrieve a complete list of groups with options to rename and
                delete them. Additionally, view and manage all added members
                efficiently.
              </div>
            </Link>

            <Link
              href="/admin/chats/group/create"
              className="cursor-pointer rounded border border-primary p-3 hover:bg-blue-light-6"
            >
              <p className="flex items-center gap-2 !text-xl text-primary">
                Create Group <ArrowForwardIcon className="!text-xl" />
              </p>
              <div>
                Create private or public groups with the ability to add members.
              </div>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChatsPageAdmin;
