"use client";
import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";
import GroupDetailsWithMembers from "@/components/admin/ChatsAdminComponents/Group/View/GroupDetailsWithMembers";

const GroupDetailsWithMembersWrapper = ({
  params,
}: {
  params: { groupId: number };
}) => {
  const { groupId } = params;
  return (
    <div className="pt-5.5">
      <Suspense fallback={<Loader />}>
        <GroupDetailsWithMembers groupId={groupId} />
      </Suspense>
    </div>
  );
};

export default GroupDetailsWithMembersWrapper;
