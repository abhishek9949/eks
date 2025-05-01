"use client"
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ContentDetailsRenderPage from "@/components/content-details/ContentDetailsRenderPage";
import { IndividualContentCardDetailsProps } from "@/types/course";

const IndividualContentCardDetails = ({ params }: IndividualContentCardDetailsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbLevelsForContentDetails = [
    {
      name: params?.courseType
        ?.split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      path: `${pathname.split("/").slice(0, -1).join("/")}?${searchParams?.toString()}`
    }
  ];

  return (
    <ContentDetailsRenderPage id={params?.id} breadcrumbDetails={breadcrumbLevelsForContentDetails} />
  );
};

export default IndividualContentCardDetails;