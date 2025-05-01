import React from "react";
import { Box, Card, Paper } from "@mui/material";
import Image from "next/image";
import CustomAvatar from "@/components/common/CustomAvatar";
import Link from "next/link";
import clsx from "clsx";
import styles from "@/components/CommunityTableDetails/CommunityTableDetails.module.scss";
import { ContentCreatorFormInitialValue } from "@/types/contentCreatorProfile";
import { countWords } from "@/utils/reusableFunctions";
import ShowMoreLessUsingLine from "@/components/common/ShowMoreLessUsingLine";

const ContentCreatorFormReview = ({
  values,
}: {
  values: ContentCreatorFormInitialValue;
}) => {
  return (
    <Box>
      <Paper className="!p-5">
        {/* PROFILE SECTION */}

        <div className="mb-5 block items-center gap-5 sm:flex">
          <div className="m-auto w-fit rounded-full border-2 border-dashed border-primary p-1 sm:m-0">
            <CustomAvatar
              width={180}
              height={180}
              name="Profile"
              src={
                values?.profile_picture instanceof File
                  ? URL.createObjectURL(values?.profile_picture)
                  : (values?.profile_picture ?? undefined)
              }
            />
          </div>
          <div>
            <div className="text-center text-2xl font-semibold text-black sm:text-left">
              {values?.creator_name}
            </div>
            <div
              className={clsx(
                styles.descStyle,
                "text-center text-lg font-normal text-neutral-700 sm:text-left",
              )}
            >
              <ShowMoreLessUsingLine
                content={values?.current_job}
                showButtons={true}
                lineLimit={2}
              />
            </div>
            {values.social_media && (
              <div className="m-auto flex w-fit flex-wrap gap-2 pt-2 sm:m-0">
                {values.social_media.instagram_link && (
                  <Link
                    href={values.social_media.instagram_link}
                    target="_blank"
                  >
                    <Image
                      src="/images/landingPageImages/instagram.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="Instagram"
                    />
                  </Link>
                )}

                {values.social_media.facebook_link && (
                  <Link
                    href={values.social_media.facebook_link}
                    target="_blank"
                  >
                    <Image
                      src="/images/landingPageImages/facebook.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="fb"
                    />
                  </Link>
                )}
                {values.social_media.linkedIn_link && (
                  <Link
                    href={values.social_media.linkedIn_link}
                    target="_blank"
                  >
                    <Image
                      src="/images/landingPageImages/linkedin.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="linkedin"
                    />
                  </Link>
                )}

                {values.social_media.x_link && (
                  <Link href={values.social_media.x_link} target="_blank">
                    <Image
                      src="/svg/SocialMediaIcons/x-rounded.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="x"
                    />
                  </Link>
                )}

                {values.social_media.tiktok_link && (
                  <Link href={values.social_media.tiktok_link} target="_blank">
                    <Image
                      src="/svg/SocialMediaIcons/tiktok-rounded.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="tiktok"
                    />
                  </Link>
                )}
                {values.social_media.other_link && (
                  <Link href={values.social_media.other_link} target="_blank">
                    <Image
                      src="/svg/SocialMediaIcons/web-rounded.svg"
                      width={44}
                      height={44}
                      className="shrink-0"
                      alt="web"
                    />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Educational Experience Card */}

        <Card variant="outlined" className="!mb-5">
          <Box className="!p-5">
            <Box className="!flex !items-center !gap-2">
              <Box>
                <Image
                  src="/svg/edu-exp.svg"
                  width={44}
                  height={44}
                  alt="web"
                  className="!shrink-0"
                />
              </Box>
              <Box className="!text-base !font-semibold !text-neutral-700">
                Educational Experience
              </Box>
            </Box>

            <Box
              className={clsx(
                styles.descStyle,
                "!ml-14 !text-base !font-normal !text-neutral-700",
              )}
            >
              <ShowMoreLessUsingLine
                content={values.edu_experience}
                showButtons={true}
                lineLimit={2}
              />
            </Box>
          </Box>
        </Card>

        {/* Teaching Philosophy Card */}

        {countWords(values.teaching_reason) >= 1 && (
          <Card variant="outlined" className="!mb-5">
            <Box className="!p-5">
              <Box className="!flex !items-center !gap-2">
                <Box>
                  <Image
                    src="/svg/teaching-love.svg"
                    width={44}
                    height={44}
                    alt="web"
                    className="!shrink-0"
                  />
                </Box>
                <Box className="!text-base !font-semibold !text-neutral-700">
                  Teaching Philosophy
                </Box>
              </Box>

              <Box
                className={clsx(
                  styles.descStyle,
                  "!ml-14 !text-base !font-normal !text-neutral-700",
                )}
              >
                <ShowMoreLessUsingLine
                  content={values.teaching_reason}
                  showButtons={true}
                  lineLimit={2}
                />
              </Box>
            </Box>
          </Card>
        )}

        {/* Published Work & Resources Card */}

        {countWords(values.anything_else) >= 1 && (
          <Card variant="outlined">
            <Box className="!p-5">
              <Box className="!flex !items-center !gap-2">
                <Box>
                  <Image
                    src="/svg/book-resources.svg"
                    width={44}
                    height={44}
                    alt="web"
                    className="!shrink-0"
                  />
                </Box>
                <Box className="!text-base !font-semibold !text-neutral-700">
                  Published Work & Resources
                </Box>
              </Box>

              <Box
                className={clsx(
                  styles.descStyle,
                  "!ml-14 !text-base !font-normal !text-neutral-700",
                )}
              >
                <ShowMoreLessUsingLine
                  content={values.anything_else}
                  showButtons={true}
                  lineLimit={2}
                />
              </Box>
            </Box>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default ContentCreatorFormReview;
