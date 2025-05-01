import Image from "next/image";
import Link from "next/link";
import React from "react";
import FooterForm from "./FooterForm";
import { FooterInitialValue } from "@/types/footerType";
import { FooterLinks } from "@/constants/footerLinks";
import { useSubscriberNewsletterMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";

const initialValues = {
  email: "",
};

const Footer = () => {
  const dispatch = useAppDispatch();

  const [subscriberNewsletter] = useSubscriberNewsletterMutation();
  const handleSubmit = (values: FooterInitialValue) => {
    subscriberNewsletter({
      endpoint: `${API_CONSTANTS.NEWS_LETTER_SUBSCRIPTION}`,
      method: "POST",
      data: {
        email: values.email,
        status: "subscribed",
      },
    })
      .unwrap()
      .then((response) => {
        const data = response as { message?: string };
        if (data?.message) {
          dispatch(
            showToastMessage({
              message: data?.message,
              severity: "success",
            }),
          );
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  return (
    <footer className="bg-primary">
      <section className="relative z-10 overflow-hidden bg-primary px-4 pb-20 pt-8 text-center">
        <div className="mx-auto max-w-[500px]">
          <span className="absolute bottom-0 left-1/2 z-[-1] h-[160vw] w-[160vw] -translate-x-1/2 rounded-full rounded-b-full bg-[#F2FAFF] sm:h-[140vw] sm:w-[140vw]"></span>
          <div className="z-10 flex flex-col items-center gap-4">
            <div className="text-center text-2xl font-semibold leading-8 text-gray-25 md:w-8/12 md:pb-2 lg:text-2xl 2xl:w-7/12">
              Come for professional learning Stay for something much bigger
            </div>
            <div className="w-10/12 text-center text-lg font-light text-black lg:pb-2 lg:text-xl xl:w-9/12 xl:text-base 2xl:w-8/12">
              Subscribe to our newsletter to get simple strategies sent straight
              to your inbox
            </div>
            <div className="w-10/12">
              <FooterForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="grid w-full grid-cols-12 bg-primary pb-10 pt-10">
        <div className="col-span-6 hidden pl-20 sm:flex">
          <div className="relative aspect-square w-50">
            <Image
              src="/images/logo/login_logo.webp"
              alt="login_page"
              priority={true}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div
          className="col-span-12 flex justify-end sm:col-span-6"
          data-testid="footer-links"
        >
          <div className="grid w-full grid-cols-12 px-4 text-white md:w-10/12 lg:w-7/12">
            <div className="col-span-12 flex justify-evenly sm:grid sm:grid-cols-12">
              <div className="col-span-6 flex flex-col">
                {FooterLinks.slice(0, Math.ceil(FooterLinks.length / 2))?.map(
                  (footerLink) => (
                    <Link
                      href={footerLink?.link}
                      className="col-span-6 w-fit transition-colors duration-300 hover:text-gray-300 hover:underline"
                      key={footerLink?.name}
                    >
                      {footerLink?.name}
                    </Link>
                  ),
                )}
              </div>
              <div className="col-span-6 flex flex-col">
                {FooterLinks.slice(Math.ceil(FooterLinks.length / 2))?.map(
                  (footerLink) => (
                    <Link
                      href={footerLink?.link}
                      className="col-span-6 w-fit transition-colors duration-300 hover:text-gray-300 hover:underline"
                      key={footerLink?.name}
                    >
                      {footerLink?.name}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div className="col-span-12 flex items-center justify-between pb-5 pt-5 sm:col-span-11">
              {[
                {
                  src: "/svg/SocialMediaIcons/instagram.svg",
                  alt: "instagram icon",
                },
                {
                  src: "/svg/SocialMediaIcons/facebook.svg",
                  alt: "facebook icon",
                },
                {
                  src: "/svg/SocialMediaIcons/twitter.svg",
                  alt: "twitter icon",
                },
                { src: "/svg/SocialMediaIcons/tiktok.svg", alt: "tiktok icon" },
                {
                  src: "/svg/SocialMediaIcons/linkedin.svg",
                  alt: "linkedin icon",
                },
                {
                  src: "/svg/SocialMediaIcons/youtube.svg",
                  alt: "youtube icon",
                },
                {
                  src: "/svg/SocialMediaIcons/pinterest.svg",
                  alt: "pinterest icon",
                },
              ].map(({ src, alt }) => (
                <Image
                  key={alt}
                  src={src}
                  alt={alt}
                  width={24}
                  height={24}
                  className="transition-transform duration-300 hover:scale-110 hover:brightness-75"
                />
              ))}
            </div>

            <div className="col-span-12 text-center sm:text-start">
              Copyright © {new Date().getFullYear()} The Teachers Table | All
              Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
