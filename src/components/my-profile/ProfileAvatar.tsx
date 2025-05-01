"use client";

import { useState, useEffect } from "react";
import { Box, Badge, IconButton, useMediaQuery, useTheme  } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import CustomAvatar from "@/components/common/CustomAvatar";

const Input = styled("input")({
  display: "none",
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#006BA6",
    color: "white",
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 5px rgba(0,0,0,0.3)`,
    cursor: "pointer",
  },
}));

interface ProfileAvatarProps {
  name: string;
  image?: File | string;
  onImageChange?: (image: File) => void;
  isEditButton?: boolean;
  customAvatarWidth?: number;
  customAvatarHeight?: number;
}
export default function ProfileAvatar({
  name,
  image,
  onImageChange,
  isEditButton = true,
  customAvatarWidth,
  customAvatarHeight,

}: ProfileAvatarProps) {
  const [profileImage, setProfileImage] = useState<File | string | null>(
    image ?? null,
  );
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      onImageChange?.(file); // Send File object instead of Base64
    }
  };

    useEffect(() => {
      setProfileImage(image ?? null);
    }, [image]);

    const theme = useTheme();
const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const avatarSize = isSmall ? 80 : isMedium ? 120 : 161; // Adjust sizes based on screen

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {isEditButton ? (
        <label htmlFor="upload-button">
          <Input
            accept="image/*"
            id="upload-button"
            type="file"
            onChange={handleImageChange}
          />

          <StyledBadge
            overlap="circular"
            badgeContent={
              <IconButton component="span" sx={{ p: 0 }}>
                <Image
                  src="/svg/edit-icon-fill.svg"
                  width={27}
                  height={27}
                  alt="Edit"
                />
              </IconButton>
            }
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <CustomAvatar
              name={name}
              src={
                profileImage instanceof File
                  ? URL.createObjectURL(profileImage)
                  : profileImage ?? undefined
              }
              width={customAvatarWidth || avatarSize}
              height={customAvatarHeight || avatarSize}
              randomColor
            />
          </StyledBadge>
        </label>
      ) : (
        <CustomAvatar
          name={name}
          src={
            profileImage instanceof File
              ? URL.createObjectURL(profileImage)
              : profileImage ?? undefined
          }
          width={customAvatarWidth || avatarSize}
          height={customAvatarHeight || avatarSize}
          randomColor
        />
      )}
    </Box>
  );
}
