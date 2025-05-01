import React from "react";
import { HeaderLinks } from "@/constants/landingPageConstants";
import clsx from "clsx";
import Link from "next/link";
import { HeaderLinksProps } from "@/types/landingPage";

const HeaderLinksComponent = ({
  selectedHeaderLink,
  handleHeaderLinkSelect,
  isSidebar
}: HeaderLinksProps) => {
  return (
    <>
      {HeaderLinks?.map((headerLink) => (
        <div key={headerLink?.name} className={clsx(isSidebar && 'p-2')}>
          <Link
            href={headerLink?.link} 
            className={clsx('text-lg', selectedHeaderLink === headerLink?.name ? 'text-primary font-bold' : 'font-medium')}
            onClick={() => handleHeaderLinkSelect(headerLink?.name)}
          >
              {headerLink?.name}
          </Link>
        </div>
      ))}
    </>
  );
};

export default HeaderLinksComponent;