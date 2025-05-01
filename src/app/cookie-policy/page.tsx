"use client";

import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Link from "@mui/material/Link";

const PrivacyPolicy = () => {
  return (
    <>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Cookie Policy for The Teachers Table
        </Typography>
        <Typography sx={{ padding: 1 }}>
          This is the Cookie Policy for The Teachers Table, accessible from{" "}
          <Link href="https://theteacherstable.org">
            https://theteacherstable.org
          </Link>
        </Typography>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            What Are Cookies
          </Typography>
          <Typography>
            As is common practice with almost all professional websites this
            site uses cookies, which are tiny files that are downloaded to your
            computer, to improve your experience. This page describes what
            information they gather, how we use it and why we sometimes need to
            store these cookies. We will also share how you can prevent these
            cookies from being stored however this may downgrade or ‘break’
            certain elements of the sites functionality
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            How We Use Cookies
          </Typography>
          <Typography>
            We use cookies for a variety of reasons detailed below.
            Unfortunately, in most cases there are no industry standard options
            for disabling cookies without completely disabling the functionality
            and features they add to this site. It is recommended that you leave
            on all cookies if you are not sure whether you need them or not in
            case, they are used to provide a service that you use.
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            Disabling Cookies
          </Typography>
          <Typography>
            You can prevent the setting of cookies by adjusting the settings on
            your browser (see your browser Help for how to do this). Be aware
            that disabling cookies will affect the functionality of this and
            many other websites that you visit. Disabling cookies will usually
            result in also disabling certain functionality and features of this
            site. Therefore, it is recommended that you do not disable cookies.
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            The Cookies We Set
          </Typography>
          <Typography>
            <Box component="ul" sx={{ ml: 2 }}>
              <li className="!list-disc !text-base !font-normal">
                Account related cookies – If you create an account with us, then
                we will use cookies for the management of the signup process and
                general administration. These cookies will usually be deleted
                when you log out however in some cases, they may remain
                afterwards to remember your site preferences when logged out.
              </li>
              <li className="!list-disc !text-base !font-normal">
                Login related cookies – We use cookies when you are logged in so
                that we can remember this fact. This prevents you from having to
                log in every single time you visit a new page. These cookies are
                typically removed or cleared when you log out to ensure that you
                can only access restricted features and areas when logged in.
              </li>
              <li className="!list-disc !text-base !font-normal">
                Email newsletters related cookies – This site offers newsletter
                or email subscription services and cookies may be used to
                remember if you are already registered and whether to show
                certain notifications which might only be valid to
                subscribed/unsubscribed users.
              </li>
              <li className="!list-disc !text-base !font-normal">
                Orders processing related cookies – This site offers e-commerce
                or payment facilities, and some cookies are essential to ensure
                that your order is remembered between pages so that we can
                process it properly.
              </li>
              <li className="!list-disc !text-base !font-normal">
                Forms related cookies – When you submit data to through a form
                such as those found on contact pages or comment forms cookies
                may be set to remember your user details for future
                correspondence
              </li>
              <li className="!list-disc !text-base !font-normal">
                Site preferences cookies – In order to provide you with a great
                experience on this site we provide the functionality to set your
                preferences for how this site runs when you use it. In order to
                remember your preferences, we need to set cookies so that this
                information can be called whenever you interact with a page is
                affected by your preferences
              </li>
            </Box>
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            Third Party Cookies
          </Typography>
          <Typography>
            <Typography>
              In some special cases we also use cookies provided by trusted
              third parties. The following section details which third party
              cookies you might encounter through this site.
            </Typography>
            <Box component="ul" sx={{ ml: 2 }}>
              <li className="!list-disc !text-base !font-normal">
                From time to time, we test new features and make subtle changes
                to the way that the site is delivered. When we are still testing
                new features, these cookies may be used to ensure that you
                receive a consistent experience whilst on the site whilst
                ensuring we understand which optimizations our users appreciate
                the most.
              </li>
            </Box>
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
            More Information
          </Typography>
          <Typography>
            Hopefully that has clarified things for you and as was previously
            mentioned if there is something that you aren’t sure whether you
            need or not it’s usually safer to leave cookies enabled in case it
            does interact with one of the features you use on our site.
            <br />
            <br />
            For more general information on cookies, please read{" "}
            <Link href="https://www.cookiepolicygenerator.com/sample-cookies-policy/">
              the Cookies Policy article
            </Link>
            <br />
            <br />
            However, if you are still looking for more information then you can
            contact us through one of our preferred contact methods:
            <br />
            <br />• Email:{" "}
            <Link href="contact@theteacherstable.org">
              contact@theteacherstable.org
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
