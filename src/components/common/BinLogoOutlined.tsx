import React from "react";

interface BinLogoProps {
  color?: string;
  className?: string;
}

const BinLogoOutlined: React.FC<BinLogoProps> = ({
  color = "#3E3E3E",
  className = "w-[28px] h-[28px]",
}) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 38 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M13 4H10V29H13V4Z" fill={color} />
      <path d="M26 4H23V29H26V4Z" fill={color} />
      <path
        d="M32.1986 4.00358H31.8486V4.35358V27.892H25.5468H25.3871L25.2825 28.0125L24.6927 28.6919H11.3064L10.7167 28.0125L10.612 27.892H10.4524H4.15059V4.35358V4.00358H3.80059H3.21582H2.86582V4.35358V28.8373V29.1873H3.21582H10.0204L10.7232 29.854L10.8244 29.9501H10.964H25.0351H25.1747L25.276 29.854L25.9788 29.1873H32.7833H33.1333V28.8373V4.35358V4.00358H32.7833H32.1986Z"
        fill={color}
        stroke={color}
        strokeWidth="0.7"
      />
      <path
        d="M25.6391 4L23.8776 5.34118H11.974L10.2126 4H3V6.65882H10.3424L11.9926 8H23.8962L25.5834 6.65882H33V4H25.6576H25.6391Z"
        fill={color}
      />
      <path
        d="M26.1757 2L24.3087 3.34118H11.6913L9.82428 2H1V4.65882H9.9422L11.6913 6H24.3087L26.0971 4.65882H35V2H26.1757Z"
        fill={color}
      />
      <path
        d="M12.1161 28.726V29.5818H10.9648L10.4531 29.1167V28.2236L12.1161 28.726Z"
        fill={color}
      />
      <path
        d="M23.8848 28.726V29.5818H25.036L25.5294 29.1167V28.2236L23.8848 28.726Z"
        fill={color}
      />
    </svg>
  );
};

export default BinLogoOutlined;
