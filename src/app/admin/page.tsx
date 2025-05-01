"use client";

import DataCard1 from "@/components/admin/AdminDashboard/DataCard1";
import { Typography, Box, Card, CardContent } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";
import ApexChart from "@/components/admin/AdminDashboard/ApexChartExample";
import ApexChart2 from "@/components/admin/AdminDashboard/ApexChartExample2";
import PageMetaData from "@/components/common/PageMetaData";
export default function Home() {
  return (
    <>
      <PageMetaData title="Admin Dashboard" />
      <div className="pt-5.5">
        <Typography variant="h6" className="mb-5.5">
          Hi, Welcome to Admin Dashboard 👋
        </Typography>
        {/* This is temporary, Ignore it for now, I have used apex chart for now */}
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 3 }}>
              <DataCard1
                count={24}
                active={18}
                inactive={6}
                label={"Organization Admin"}
                cardIconColor={"#008FFB"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 3 }}>
              <DataCard1
                count={34}
                active={30}
                inactive={4}
                label={"Sub Admin"}
                cardIconColor={"#00E396"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 3 }}>
              <DataCard1
                count={12}
                active={8}
                inactive={4}
                label={"Content Creator"}
                cardIconColor={"#FEB019"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 3 }}>
              <DataCard1
                count={46}
                active={40}
                inactive={6}
                label={"Teacher"}
                cardIconColor={"#FF4560"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-5.5">
                    Users data
                  </Typography>
                  <ApexChart />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-5.5">
                    Sample User data
                  </Typography>
                  <ApexChart2 />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
