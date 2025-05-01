import React, { useEffect, useState } from "react";
import GetStartedButton from "./GetStartedButton";
import { SocialMediaConstants } from "@/constants/landingPageConstants";
import Image from "next/image";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { API_CONSTANTS } from "@/constants/api";
import { useLazyCheckContentCreatorProfileQuery } from "@/redux/allReducer";
import { GetStartedProps } from "@/types/common";

interface CarouselItem {
  profile_picture: string;
  username: string;
}

const defaultImages: CarouselItem[] = [
  { profile_picture: "/images/1.jpg", username: "Casey Harrison" },
  { profile_picture: "/images/2.jpg", username: "Rachel Beiswanger" },
  { profile_picture: "/images/3.jpg", username: "Jake Daggett" },
];

const RenderSocialMediaIcons = () => (
  <div className="gap-2 sm:gap-4 sm:px-2 lg:flex">
    {SocialMediaConstants?.map(({ name, icon }) => (
      <IconButton key={name} aria-label={name}>
        <div className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14">
          <Image src={icon} alt={name} fill />
        </div>
      </IconButton>
    ))}
  </div>
);

function InfiniteCarousel({
  loading,
  data,
}: {
  loading: boolean;
  data: CarouselItem[];
}) {
  const displayImages = data?.length > 0 ? data : defaultImages;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const getSlide = (offset: number) => {
    const index =
      (activeIndex + offset + displayImages.length) % displayImages.length;
    return displayImages[index];
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, sm: 4, lg: 0 },
      }}
    >
      {/* Slides */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1, sm: 2 },
          flexWrap: "nowrap",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {loading
          ? [0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={320}
                height={524}
                sx={{ borderRadius: 2 }}
              />
            ))
          : [getSlide(-1), getSlide(0), getSlide(1)].map((item, i) => {
              const isActive = i === 1;

              return (
                <Box
                  key={`${item.username}-${i}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  sx={{
                    width: { xs: 260, md: 320 },
                    height: 524,
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: { xs: 0, sm: 0, md: 0, lg: 1 },
                    cursor: "pointer",
                    filter: isActive ? "brightness(1)" : "brightness(0.6)",
                    transition: "filter 0.3s ease",
                  }}
                >
                  <Image
                    src={item.profile_picture}
                    alt={item.username}
                    layout="fill"
                    objectFit="cover"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      bgcolor: hoveredIndex === i ? "white" : "transparent",
                      color: hoveredIndex === i ? "primary.main" : "white",
                      py: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography fontWeight="bold">{item.username}</Typography>
                  </Box>
                </Box>
              );
            })}
      </Box>

      {/* Dots and Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
          alignItems: "center",
        }}
      >
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>
        {displayImages.map((items, index) => (
          <FiberManualRecordIcon
            key={items.username || index}
            sx={{
              fontSize: 12,
              mx: 0.5,
              color: index === activeIndex ? "primary.main" : "grey.400",
              transition: "color 0.3s ease",
            }}
          />
        ))}
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

const FutureOfTeaching = ({ showGetStartedButton }: GetStartedProps) => {
  const endpoint = API_CONSTANTS.GET_CONTENT_CREATOR_PROFILE_PUBLIC;
  const [getCheckContentCreatorProfile] =
    useLazyCheckContentCreatorProfileQuery();
  const [apiLoading, setApiLoading] = useState(true);
  const [data, setData] = useState<CarouselItem[]>([]);

  useEffect(() => {
    getCheckContentCreatorProfile({ endpoint })
      .unwrap()
      .then((response) => {
        const results = response as unknown as CarouselItem[];
        setData(results);
        setApiLoading(false);
      })
      .catch(() => {
        setApiLoading(false);
      });
  }, [getCheckContentCreatorProfile, endpoint]);
  return (
    <div className="relative grid grid-cols-12 bg-blue-light-12 xl:py-10">
      {data && data?.length === 0 && <div className="xl:col-span-2"></div>}
      <div
        className={`order-2 col-span-12 mb-4 flex flex-col justify-center gap-4 px-8 text-center lg:mb-2 xl:gap-0 2xl:gap-4 ${
          data && data?.length === 0
            ? "xl:col-span-8 xl:items-center xl:text-center"
            : "xl:col-span-5 xl:text-left"
        }`}
      >
        <p className="hidden text-[2.125rem] font-semibold text-gray-26 xl:block">
          Welcome to the future of teaching!
        </p>
        <p className="pt-4 text-xl font-normal xl:pt-0">
          The Teachers Table is an organization on a mission to give educators
          the professional learning resources and support they need to teach all
          students.
        </p>
        <p className="text-xl font-normal">
          The Teachers Table brings together researchers, teachers in the field,
          experts in literacy, and engaging content creators. We help teachers
          bridge the gap between research and practice so they have the tools to
          teach now, tomorrow, and everyday they work with students.
        </p>
        {showGetStartedButton && (
          <GetStartedButton
            customClassname={`h-11 w-fit !rounded-[0.25rem] !m-auto !bg-white !text-sm md:!text-lg !text-blue-light-17 !border-blue-light-17${
              data && data?.length === 0 ? "!m-auto" : "!m-auto xl:!m-0"
            }`}
            title="Get Started!"
            customClassnameForGap="!gap-2 lg:!gap-3"
          />
        )}
        <p className="text-2xl font-semibold text-black">
          Introducing some of the inspiration and voices at The Teachers
          Table...
        </p>
        <p className="text-base font-normal">
          Join us to learn from teachers, coaches, district leaders, authors,
          speakers, and researchers!
        </p>
        <div className="flex items-center justify-center xl:justify-start">
          <p className=" text-base font-semibold text-black sm:text-xl">
            {"Let's connect:"}
          </p>
          <RenderSocialMediaIcons />
        </div>
      </div>
      {data && data?.length > 0 && (
        <div className="order-2 col-span-12 flex !w-full justify-center xl:col-span-7 xl:justify-end">
          <InfiniteCarousel loading={apiLoading} data={data} />
        </div>
      )}
      <div className="order-1 col-span-12 flex flex-col items-center xl:hidden">
        <p className="text-center text-[2.125rem] font-semibold text-gray-26 xl:hidden">
          Welcome to the future of teaching!
        </p>
      </div>
    </div>
  );
};

export default FutureOfTeaching;
