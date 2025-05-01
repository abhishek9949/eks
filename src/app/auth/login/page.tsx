"use client";

import React from "react";
import PageMetaData from "@/components/common/PageMetaData";
import LoginPageComp from "@/components/Login/LoginPageComp";

const LoginPage = () => {
  return (
    <>
      <PageMetaData title="Login" />
      <LoginPageComp />
    </>
  );
};

export default LoginPage;
