"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChart2 = () => {
  const state: {
    series: number[];
    options: ApexOptions;
  } = {
    series: [44, 55, 41, 17],
    options: {
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
        />
      </div>
    </div>
  );
};

export default ApexChart2;
