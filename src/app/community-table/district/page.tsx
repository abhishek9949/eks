"use client";

import React from "react";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import Image from "next/image";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import PageMetaData from "@/components/common/PageMetaData";

export default function DistrictPage() {
  return (
    <div className="pt-5.5">
      <PageMetaData title="District Community" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Community Table",
            path: URL_CONSTANTS.COMMUNITY_TABLE,
            icon: (
              <Image
                src="/svg/community-table.svg"
                width={22}
                height={22}
                alt="CommunityTable"
              />
            ),
          },
          { name: "District" },
        ]}
      />
      <div className="text-center">No District Data Available</div>
    </div>
  );
}
