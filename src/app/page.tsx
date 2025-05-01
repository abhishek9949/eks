import React from "react";
import LandingPage from "@/components/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'The Teachers Table',
};

export default function Home() {
  return <LandingPage />;
}
