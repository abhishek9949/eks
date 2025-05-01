import React from "react";
import UpdateChannel from "@/components/admin/ChatsAdminComponents/Channel/Edit";

interface EditChannelPropType {
  params: {
    id: number;
  };
}

const ChannelEditPage = ({ params }: EditChannelPropType) => {
  const { id } = params;
  return (
    <div className="pt-5.5">
      <UpdateChannel id={id} />
    </div>
  );
};

export default ChannelEditPage;
