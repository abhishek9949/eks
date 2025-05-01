"use client";

import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";
import ContentDetailsRenderPage from "@/components/content-details/ContentDetailsRenderPage";

const ContentDetails = ({
  params,
}: Readonly<{ params: { id: string } }>) => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <ContentDetailsRenderPage id={params?.id} />
      </Suspense>
    </div>
  )
}

export default ContentDetails;