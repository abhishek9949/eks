"use client";
import React, { useState, useRef, useEffect } from "react";
import { TestimonialsConstants } from "@/constants/landingPageConstants";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, MobileStepper, styled } from "@mui/material";
import Image from "next/image";
import clsx from "clsx";
import styles from "./landingPage.module.scss";

const CustomStepper = styled(MobileStepper)(({ theme }) => ({
  "& .MuiMobileStepper-dots": {
    gap: "10px",
  },
  "& .MuiMobileStepper-dot": {
    width: "15px",
    height: "15px",
  },
}));

const InfiniteCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const totalItems = TestimonialsConstants.length;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isTransitioning = useRef(false);

  // Clone first and last items for infinite loop
  const carouselItems = [
    TestimonialsConstants[totalItems - 1], // Last item cloned at start
    ...TestimonialsConstants,
    TestimonialsConstants[0], // First item cloned at end
  ];

  const scrollToItem = (index: number, behavior: ScrollBehavior = "smooth") => {
    const item = itemRefs.current[index];
    if (!item || !carouselRef.current) return;

    // Center active item
    const carouselWidth = carouselRef.current.offsetWidth;
    const itemWidth = item.offsetWidth;
    const scrollLeft = item.offsetLeft - carouselWidth / 2 + itemWidth / 2;

    carouselRef.current.scrollTo({ left: scrollLeft, behavior });
  };

  useEffect(() => {
    if (isTransitioning.current) return;

    scrollToItem(activeIndex, "smooth");

    // Handle infinite loop reset (fix transition glitch)
    if (activeIndex === carouselItems.length - 1) {
      isTransitioning.current = true;
      setTimeout(() => {
        setActiveIndex(1);
        scrollToItem(1, "instant");
        isTransitioning.current = false;
      }, 500);
    } else if (activeIndex === 0) {
      isTransitioning.current = true;
      setTimeout(() => {
        setActiveIndex(totalItems);
        scrollToItem(totalItems, "instant");
        isTransitioning.current = false;
      }, 500);
    }
  }, [activeIndex]);

  const handleCarouselScroll = (isNext: boolean) => {
    if (isTransitioning.current) return;
    setActiveIndex((prev) => prev + (isNext ? 1 : -1));
  };

  return (
    <div className="flex w-full flex-col items-center gap-10 overflow-hidden bg-white py-10">
      <p className="text-center text-[2.125rem] font-semibold text-black">
        {"We've helped educators everywhere just like you!"}
      </p>

      {/* Carousel Wrapper */}
      <div className="relative w-full max-w-full overflow-hidden">
        <div
          ref={carouselRef}
          className={clsx(
            "scrollbar-hide scroll-snap-type-x mandatory flex w-full gap-4 overflow-x-scroll",
            styles.hideScrollbar,
          )}
        >
          {carouselItems.map((testimonial, index) => (
            <div
              key={testimonial?.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={clsx(
                "relative flex w-full flex-shrink-0 snap-center flex-col items-center gap-2 rounded-2xl p-5 md:w-[50%] lg:w-[33%]",
                activeIndex === index
                  ? "bg-blue-light-12"
                  : "bg-neutral-50 opacity-20",
              )}
            >
              <Image
                src={testimonial?.logo}
                alt="Testimonial image"
                height={102}
                width={102}
              />
              <p className="text-base font-normal text-gray-22">
                {testimonial?.name}
              </p>
              <p className="text-sm font-normal text-gray-23">
                {testimonial?.designation}
              </p>
              <p className="text-center text-base font-normal text-gray-22">
                {testimonial?.description}
              </p>
              {activeIndex === index && (
                <>
                  <Image
                    src={"/images/landingPageImages/Quotes.webp"}
                    alt="Quotes image"
                    className="absolute left-3 top-0 rotate-180"
                    width={39}
                    height={29}
                  />
                  <Image
                    src={"/images/landingPageImages/Quotes.webp"}
                    alt="Quotes image"
                    className="absolute bottom-0 right-3"
                    width={39}
                    height={29}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <CustomStepper
        variant="dots"
        steps={totalItems}
        position="static"
        activeStep={activeIndex - 1}
        className="gap-4"
        nextButton={
          <Button
            onClick={() => handleCarouselScroll(true)}
            onMouseDown={(e) => e.preventDefault()}
            disableRipple
          >
            <KeyboardArrowRight className="!h-10 !w-10" />
          </Button>
        }
        backButton={
          <Button
            onClick={() => handleCarouselScroll(false)}
            onMouseDown={(e) => e.preventDefault()}
            disableRipple
          >
            <KeyboardArrowLeft className="!h-10 !w-10" />
          </Button>
        }
      />
    </div>
  );
};

export default InfiniteCarousel;
