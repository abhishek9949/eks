import { DEFAULT_BIN_COLOR } from "@/constants/binColors";
import { darkenColor } from "@/utils/reusableFunctions";
import React from "react";

interface BinLogoProps {
  color?: string;
  className?: string;
}

const BinLogo: React.FC<BinLogoProps> = ({
  color = DEFAULT_BIN_COLOR,
  className = "w-[34px] h-[34px]",
}) => {
  return (
    <svg
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2430_9698)">
        <path
          d="M31.4835 5.2168H2.51758V29.0706H9.33967L9.89886 29.8486H23.9718L24.7546 29.0706H31.4835V5.2168Z"
          fill={color}
        />
        <path
          d="M10.998 4.41992H9.30176V29.5831H10.998V4.41992Z"
          fill={darkenColor(color, 0.15)}
        />
        <path
          d="M24.6982 4.44141H23.002V29.6046H24.6982V4.44141Z"
          fill={darkenColor(color, 0.15)}
        />
        <path
          d="M31.4823 4.44141V28.8075H24.6975L23.9892 29.6235H10.0095L9.3012 28.8075H2.51639V4.44141H1.91992V29.4148H9.00297L9.82311 30.1929H24.1756L24.9957 29.4148H32.0788V4.44141H31.4823Z"
          fill={color}
        />
        <g filter="url(#filter0_d_2430_9698)">
          <path
            d="M24.6984 3.98438L22.9276 5.06605H10.961L9.19025 3.98438H1.93945V6.12875H9.32073L10.9797 7.21042H22.9463L24.6425 6.12875H32.0983V3.98438H24.717H24.6984Z"
            fill={darkenColor(color, 0.15)}
          />
        </g>
        <path
          d="M24.6976 3.03516L22.9269 4.11683H10.9603L9.18949 3.03516H0.820312V5.17953H9.30133L10.9603 6.2612H22.9269L24.6231 5.17953H33.0668V3.03516H24.6976Z"
          fill={color}
        />
        <path
          d="M10.998 29.2995V30.1724H9.82367L9.30176 29.698V28.7871L10.998 29.2995Z"
          fill={darkenColor(color, 0.15)}
        />
        <path
          d="M23.002 29.2995V30.1724H24.1762L24.6795 29.698V28.7871L23.002 29.2995Z"
          fill={darkenColor(color, 0.15)}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2430_9698"
          x="-2.06055"
          y="0.984375"
          width="38.1587"
          height="11.2261"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2430_9698"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2430_9698"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_2430_9698">
          <rect width="34" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BinLogo;
