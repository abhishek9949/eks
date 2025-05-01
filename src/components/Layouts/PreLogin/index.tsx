"use client";
import React, { useEffect, useState, ReactNode } from "react";
import HomeHeader from "@/components/Layouts/PreLogin/Header";
import HeaderLinksComponent from "@/components/Layouts/PreLogin/HeaderLinksComponent";
import { Drawer, Toolbar, Container } from "@mui/material";

export default function CommonHeader({ children }: Readonly<{ children: ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedHeaderLink, setSelectedHeaderLink] = useState("Home");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);    
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleHeaderLinkSelect = (headerLink: string) => {
    setSelectedHeaderLink(headerLink);
    setSidebarOpen(false);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <>
      <HomeHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={toggleSidebar}
        showNotification={showNotification}
        toggleNotification={toggleNotification}
      />

      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <HeaderLinksComponent
          selectedHeaderLink={selectedHeaderLink}
          handleHeaderLinkSelect={handleHeaderLinkSelect}
          isSidebar
        />
      </Drawer>
      <Container
        maxWidth={false}
        sx={{ width: "100%", padding: 0, "@media (min-width: 600px)": { paddingLeft: 0, paddingRight: 0 } }}
      >
        <Toolbar />
        <main>{children}</main>
      </Container>
    </>
  );
}
