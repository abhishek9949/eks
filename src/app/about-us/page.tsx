"use client";

import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
        About The Teachers Table
        </Typography>
        <Typography sx={{ padding: 1 }}>
        Welcome to our Teacher Community &ndash; a dedicated platform created by educators, for educators. We believe in the power of collaboration, continuous learning, and shared experiences to shape the future of education. Our mission is to build a supportive, engaging, and resourceful space where teachers from around the world can connect, grow, and thrive.
        </Typography>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
          Whether you&apos;re a seasoned educator or just starting your journey, our community offers:
          </Typography>
          <Typography>
            <Box component="ul" sx={{ ml: 2 }}>
              <li className="!list-disc !text-base !font-normal">
              Discussion Forums - to exchange ideas, tips, and teaching strategies  
              </li>
              <li className="!list-disc !text-base !font-normal">
              Resource Sharing - for lesson plans, tools, and educational content 
              </li>
              <li className="!list-disc !text-base !font-normal">
              Networking Opportunities - to connect with fellow teachers across disciplines  
              </li>
              <li className="!list-disc !text-base !font-normal">
              Professional Development - through webinars, expert talks, and workshops  
              </li>
              <li className="!list-disc !text-base !font-normal">
              Support & Encouragement - during challenges both inside and outside the classroom 
              </li>
            </Box>
          </Typography>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h6" className="!text-lg !font-bold">
          We understand the unique challenges educators face, and we&apos;re here to ensure you never feel alone in your journey. Together, we&apos;re creating a culture of collaboration over competition and growth over perfection.
          </Typography>
          <Typography>
          Join us and be a part of a community that celebrates your passion and amplifies your impact.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
