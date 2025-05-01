"use client";
import React, { useEffect, useState } from "react";
import BannerComponent from "./BannerComponent";
import PopularTopics from "./FeaturesComponent";
import FutureOfTeaching from "./FutureOfTeaching";
import GetStartedComponent from "./GetStartedComponent";
import CookieConsent from "@/components/common/CookieConsent";
import FAQComponent from "./FAQComponent";
import { fetchAndRedirectIfNeeded } from "@/utils/fetchCookies";

// NOSONAR
// import FeaturedInComponent from "./FeaturedInComponent";
// import PricingComponent from "./PricingComponent";
// import Testimonials from "./Testimonials";

const LandingPage = () => {
      const [showButton, setShowButton] = useState(false);
  
      useEffect(() => {
        const checkAndRedirect = async () => {
          const url = await fetchAndRedirectIfNeeded();

          if (!url) {
            setShowButton(true); // Show button only if no redirection is needed
          }
        };
  
        checkAndRedirect();
      }, []);
  return (
    <>
        <CookieConsent />
        <BannerComponent showGetStartedButton={showButton} />
        {/* <FeaturedInComponent /> */}
        <PopularTopics showGetStartedButton={showButton} />
        {/* <PricingComponent /> */}
        <FutureOfTeaching showGetStartedButton={showButton} />
        {/* <Testimonials /> */}
        <GetStartedComponent showGetStartedButton={showButton} />
        <FAQComponent />
    </>
  );
};

export default LandingPage;
