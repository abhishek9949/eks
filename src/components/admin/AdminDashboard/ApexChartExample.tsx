"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChart = () => {
  const state: {
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  } = {
    series: [
      {
        name: "Org Admin",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Sub Admin",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Content Creator",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
      {
        name: "Teacher",
        data: [20, 60, 45, 16, 25, 58, 62, 73, 48],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "Users",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number): string => val.toString(),
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default ApexChart;
