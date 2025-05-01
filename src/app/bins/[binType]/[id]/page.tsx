"use client";

import React from "react";
import MyBinContentContainer from "@/components/BinComponents/MyBins/MyBinContentContainer";

const MyBinContent = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="pt-4">
      <MyBinContentContainer binId={id} />
    </div>
  );
};

export default MyBinContent;
