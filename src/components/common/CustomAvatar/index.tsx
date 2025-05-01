import { Avatar } from "@mui/material";
import React from "react";
import Image from "next/image";

interface CustomAvatarProps {
  name?: string;
  src?: string;
  width?: number;
  height?: number;
  bgColor?: string;
  textColor?: string;
  randomColor?: boolean;
  icon?: React.ReactNode;
}

// Function to generate a color based on the name
const generateColorFromName = (name: string) => {
  const firstWord = name.split(" ")[0] || "Default"; // Use only first word
  let hash = 0;
  for (let i = 0; i < firstWord.length; i++) {
    hash = firstWord.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  name = "",
  src,
  width = 40,
  height = 40,
  bgColor,
  textColor = "white",
  randomColor = false,
  icon,
}) => {
  // Extract only the first word from the name
  const firstName = name.split(" ")[0] || "";

  // Future enhancement: If initials should include multiple words (e.g., "Edwar John" → "EJ"),
  // replace `firstName.charAt(0)` with the commented-out logic below:
  // const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const initials = firstName.charAt(0).toUpperCase();
  const avatarBgColor =
    bgColor ?? (randomColor ? generateColorFromName(name) : "#BDBDBD");

  return (
    <Avatar
      src={src}
      data-testid="custom-avatar"
      sx={{
        width,
        height,
        bgcolor: src ? "transparent" : avatarBgColor,
        color: textColor,
        fontSize: width / 2.5,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt="User Avatar"
          layout="fill"
          objectFit="cover"
          data-testid="avatar-image"
        />
      ) : (
        icon || initials
      )}
    </Avatar>
  );
};

export default CustomAvatar;
