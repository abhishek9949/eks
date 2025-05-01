"use client";

import { AblyProvider } from "ably/react";
import * as Ably from "ably";
import PageMetaData from "@/components/common/PageMetaData";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_KEY });
  return (
    <AblyProvider client={client}>
      <PageMetaData title="Chats" />
      {children}
    </AblyProvider>
  );
}
