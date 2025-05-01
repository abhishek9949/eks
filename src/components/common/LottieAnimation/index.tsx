"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationData: any; // Supports JSON file or fetched JSON
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: 1 | -1; // Forward (1) or Reverse (-1)
  renderer?: "svg" | "canvas" | "html"; // Render method
  className?: string; // Tailwind or custom styles
}

const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  renderer = "svg",
  className = "",
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer,
        loop,
        autoplay,
        animationData,
      });

      animationRef.current.setSpeed(speed);
      animationRef.current.setDirection(direction);
    }

    return () => {
      animationRef.current?.destroy(); // Clean up animation on unmount
    };
  }, [animationData, loop, autoplay, speed, direction, renderer]);

  return <div ref={containerRef} className={className} />;
};

export default LottieAnimation;
