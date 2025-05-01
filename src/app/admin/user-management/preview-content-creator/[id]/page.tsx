"use client";
import ContentCreatorProfileComp from "@/components/ResourceAndResearch/ContentCreatorProfileComp";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import React from "react";

const ContentCreatorProfilePage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="pt-5.5">
      <ContentCreatorProfileComp
        breadcrumbTitle="User Management"
        breadcrumbUrl={URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER}
        pageTitle="Content Creator Profile"
        creatorId={id}
      />
    </div>
  );
};

export default ContentCreatorProfilePage;
