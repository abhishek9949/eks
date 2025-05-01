import { AppBar, Toolbar, IconButton, Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import style from "@/components/Layouts/Header/Header.module.scss";
import GetStartedButton from "@/components/LandingPage/GetStartedButton";
import { fetchAndRedirectIfNeeded } from "@/utils/fetchCookies";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import useLocalStorage from "@/hooks/useLocalStorage";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  showNotification: boolean;
  toggleNotification?: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  showNotification,
  toggleNotification
}) => {
  const [showButton, setShowButton] = useState<boolean | null>(null);
  const [_, setPageName] = useLocalStorage("selectedMenu", "");
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPath = pathname.includes(URL_CONSTANTS.LOGIN);

  const checkAndRedirect = async (flag?: number) => {
    const redirect = await fetchAndRedirectIfNeeded();
    if (redirect) {
      if (flag === 1) {
        setShowButton(false);
      } else if (flag === 2) {
        setPageName(redirect.name);
        window.location.href = redirect.url;
      }
    } else {
      setShowButton(true);
      // if its not login then landing page
      if (flag === 2) {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    checkAndRedirect(1);
  }, []);

  return (
    <AppBar
      position="sticky"
      className={clsx(
        style.header,
        "border-b border-gray-200 !bg-white !shadow-sm",
      )}
    >
      {showNotification && (
        <div className="relative flex w-full justify-center bg-primary/20 p-3">
          <p className="text-lg font-normal text-black">
            {
              "The Teacher's Table is coming soon! Educators join the waitlist for free access!"
            }
          </p>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <CloseIcon className="absolute right-3 cursor-pointer" />
          </IconButton>
        </div>
      )}
      <Toolbar className="flex w-full justify-between px-4">
        {/* Left Section - Logo and Search */}
        <Box className="flex flex-grow items-center gap-2">
          {/* Small Screen: Hamburger and Logo */}
          <IconButton
            edge="start"
            className="!hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Link
            className="block lg:hidden"
            href="#"
            onClick={() => checkAndRedirect(2)}
          >
            <Image
              width={32}
              height={32}
              src="/images/logo/logo_icon.jpg"
              alt="Logo"
            />
          </Link>

          {/* Large Screen: Full Logo */}
          <Link
            className="hidden items-center gap-2 lg:flex"
            href="#"
            onClick={() => checkAndRedirect(2)}
          >
            <Image
              width={32}
              height={32}
              src="/images/logo/logo_icon.jpg"
              alt="Logo"
              quality={100}
              unoptimized={false}
              priority
            />
            <Image
              width={236}
              height={36}
              src="/images/logo/logo_text.jpg"
              alt="Logo"
              quality={100}
              unoptimized={false}
              priority
            />
          </Link>
        </Box>

        {/* Right Section - Notification and User Menu */}
        <Box className="flex items-center gap-4">
          {showButton && (
            <>
              {isLoginPath === false && (
                <>
                  <Button
                    color="primary"
                    component={Link}
                    href={URL_CONSTANTS.LOGIN}
                  >
                    Log In
                  </Button>

                  <Box sx={{ display: { xs: "none", lg: "block" } }}>
                    <GetStartedButton
                      title="Get Started"
                      showIcon={false}
                      isBlue
                      customClassname="!bg-primary !text-white !px-3 !text-lg !h-11"
                    />
                  </Box>
                </>
              )}
            </>
          )}
          {showButton === false && (
            <Button
              type="button"
              color="primary"
              variant="contained"
              onClick={() => checkAndRedirect(2)}
            >
              Continue
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
