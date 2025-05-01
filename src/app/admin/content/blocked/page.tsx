"use client";

import React, { Suspense } from "react";
import ContentBlock from "@/components/admin/ContentManagement/ContentBlockList";
import Loader from "@/components/common/Loader";
import PageMetaData from "@/components/common/PageMetaData";
import { useCheckContentCreatorProfile } from "@/hooks/useCheckContentCreatorProfile";
import CheckContentCreatorProfileDialog from "@/components/admin/ContentManagement/CheckContentCreatorProfileDialog";

const ContentBlockWrapper = () => {
  const { checkContentCreatorRes } = useCheckContentCreatorProfile();
  
  return (
    <>
      <PageMetaData title="Blocked Content" />
      <Suspense fallback={<Loader />}>
        <ContentBlock />
        <CheckContentCreatorProfileDialog
          openDialog={checkContentCreatorRes?.is_creator_created === false}
        />
      </Suspense>
    </>
  );
};

export default ContentBlockWrapper;
