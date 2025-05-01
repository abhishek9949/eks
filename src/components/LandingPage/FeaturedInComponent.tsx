import { imagePaths } from "@/constants/landingPageConstants";
import Image from "next/image";
import React from "react";
import styles from "./FeaturedInComponent.module.scss";

const FeaturedInComponent = () => {
  const logos = [...imagePaths, ...imagePaths];

  return (
    <div className="overflow-hidden px-5 py-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-black">Featured in:</p>
        <div className="relative w-full max-w-5xl overflow-hidden">
          <div className={styles.slider}>
            <div className={styles.slideTrack}>
              {logos.map((image, i) => (
                <div className={styles.slide} key={`${image}-${i + 1}`}>
                  <Image
                    src={image}
                    height={80}
                    width={150}
                    alt="Featured In Image"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInComponent;
