import React, { Suspense } from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import SearchForm from "@/components/Layouts/Header/SearchFormWithFilter";
import clsx from "clsx";
import style from "./Header.module.scss";
import Loader from "@/components/common/Loader";
import { fetchAndRedirectIfNeeded } from "@/utils/fetchCookies";
import useLocalStorage from "@/hooks/useLocalStorage";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [_, setPageName] = useLocalStorage("selectedMenu", "");

    const checkAndRedirect = async () => {
      const redirect = await fetchAndRedirectIfNeeded();
      if (redirect?.url) {
        setPageName(redirect.name);
        window.location.href = redirect.url;
      }
    };

  return (
    <AppBar
      position="sticky"
      className={clsx(
        style.header,
        "border-b border-gray-200 !bg-white !shadow-sm",
      )}
    >
      <Toolbar className="flex w-full justify-between px-4">
        {/* Left Section - Logo and Search */}
        <Box className="flex flex-grow items-center gap-2">
          {/* Small Screen: Hamburger and Logo */}
          <IconButton
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:!hidden"
          >
            <MenuIcon />
          </IconButton>
          <Link className="block lg:hidden" href="#" onClick={() => checkAndRedirect()}>
            <Image
              width={32}
              height={32}
              src="/images/logo/logo-icon.svg"
              alt="Logo"
            />
          </Link>

          {/* Large Screen: Full Logo */}
          <Link className="hidden items-center gap-2 lg:flex" href="#" onClick={() => checkAndRedirect()}>
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

          {/* Search Bar */}
          <Box className="hidden w-full lg:block">
            <Suspense fallback={<Loader />}>
              <SearchForm />
            </Suspense>
          </Box>
        </Box>

        {/* Right Section - Notification and User Menu */}
        <Box className="flex items-center gap-4">
          <DropdownNotification />
          <DropdownUser />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
