"use client";
import ContentCreatorProfileComp from "@/components/ResourceAndResearch/ContentCreatorProfileComp";
import React from "react";

const ContentCreatorProfilePage = ({
  params,
}: {
  params: { creatorId: number };
}) => {
  const { creatorId } = params;
  return (
    <div className="pt-5.5">
      <ContentCreatorProfileComp creatorId={creatorId} />
    </div>
  );
};

export default ContentCreatorProfilePage;
