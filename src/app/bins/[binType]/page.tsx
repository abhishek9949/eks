"use client";

import React from "react";
import { notFound } from "next/navigation";
import MyBinsComponent from "@/components/BinComponents/MyBins";
import ShareWithMeComp from "@/components/BinComponents/ShareWithMe";

const BinTypePage = ({ params }: { params: { binType: string } }) => {
  const { binType } = params;

  // Valid bin types
  const validBinTypes = ["mybin", "recents", "shared-with-me"];

  // If binType is invalid, trigger a 404 page
  if (!validBinTypes.includes(binType)) {
    notFound();
  }

  return (
    <div className="pt-4">
      {binType === "mybin" && <MyBinsComponent />}
      {binType === "recents" && <MyBinsComponent />}
      {binType === "shared-with-me" && <ShareWithMeComp />}
    </div>
  );
};

export default BinTypePage;
