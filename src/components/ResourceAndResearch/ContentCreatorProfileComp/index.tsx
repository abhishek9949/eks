"use client";
import PageMetaData from "@/components/common/PageMetaData";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CustomAvatar from "@/components/common/CustomAvatar";
import Link from "next/link";
import { Card, Pagination, Stack } from "@mui/material";
import {
  useLazyGetContentCreatorDataQuery,
  useLazyGetContentCreatorProfileForEducatorQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import Loader from "@/components/common/Loader";
import ContentCard from "@/components/common/Card";
import { IndividualContentCardProps } from "@/types/content";
import styles from "@/components/CommunityTableDetails/CommunityTableDetails.module.scss";
import clsx from "clsx";
import {
  contentCreatorContentDataResType,
  contentCreatorDataAdminSide,
} from "@/types/contentCreatorProfile";
import { countWords } from "@/utils/reusableFunctions";
import ShowMoreLessUsingLine from "@/components/common/ShowMoreLessUsingLine";

const ContentCreatorProfileComp = ({
  creatorId,
  pageTitle,
  breadcrumbTitle,
  breadcrumbUrl,
}: {
  creatorId: number;
  pageTitle?: string;
  breadcrumbTitle?: string;
  breadcrumbUrl?: string;
}) => {
  const [getContentCreatorProfileForEducator] =
    useLazyGetContentCreatorProfileForEducatorQuery();
  const [getContentCreatorData] = useLazyGetContentCreatorDataQuery();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingContents, setLoadingContents] = useState(false);
  const [contentCreatorProfile, setContentCreatorProfile] =
    useState<contentCreatorDataAdminSide>({} as contentCreatorDataAdminSide);
  const [contentCreatorData, setContentCreatorData] =
    useState<contentCreatorContentDataResType>();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const fetchContentCreatorProfileForEducator = () => {
    setLoadingProfile(true);
    getContentCreatorProfileForEducator({
      endpoint: `${API_CONSTANTS.GET_CONTENT_CREATOR_PROFILE_FOR_EDUCATOR}/${creatorId}`,
    })
      .unwrap()
      .then((res) => {
        setContentCreatorProfile(res);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProfile(false);
      });
  };

  const fetchContentCreatorData = () => {
    setLoadingContents(true);
    getContentCreatorData({
      endpoint: `${API_CONSTANTS.GET_CONTENT_CREATOR_DATA}/${creatorId}?page=${page}&page_size=6`,
    })
      .unwrap()
      .then((res) => {
        setContentCreatorData(res);
        setPageCount(Math.ceil(res?.data?.count / 6));
        setLoadingContents(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingContents(false);
      });
  };

  useEffect(() => {
    fetchContentCreatorProfileForEducator();
  }, [creatorId]);
  useEffect(() => {
    fetchContentCreatorData();
  }, [creatorId, page]);

  const breadcrumbLevels = [
    {
      name: breadcrumbTitle ?? "Resource and Research",
      path: breadcrumbUrl ?? URL_CONSTANTS.RESOURCE_AND_RESEARCH,
      icon: (
        <Image
          src="/svg/resourceAndResearch.svg"
          width={22}
          height={22}
          alt="Resource and Research"
        />
      ),
    },
    {
      name: "Creator Profile",
      path: breadcrumbUrl ?? URL_CONSTANTS.RESOURCE_AND_RESEARCH,
    },
    {
      name: contentCreatorProfile?.username,
    },
  ];
  return (
    <div className="mb-10">
      <PageMetaData title={pageTitle ?? "Resource And Research"} />
      <Breadcrumb levels={breadcrumbLevels} />
      {loadingProfile ? (
        <Loader />
      ) : (
        <div>
          {/* PROFILE SECTION */}

          <div className="mb-5 block items-center gap-5 sm:flex">
            <div className="m-auto w-fit rounded-full border-2 border-dashed border-primary p-1 sm:m-0">
              <CustomAvatar
                width={200}
                height={200}
                name="Profile"
                src={contentCreatorProfile?.profile_picture}
              />
            </div>
            <div>
              <div className="text-center text-2xl font-semibold text-black sm:text-left">
                {contentCreatorProfile?.username}
              </div>
              <div
                className={clsx(
                  styles.descStyle,
                  "text-center text-lg font-normal text-neutral-700 sm:text-left",
                )}
              >
                <ShowMoreLessUsingLine
                  content={contentCreatorProfile?.answers?.current_role}
                  showButtons={true}
                  lineLimit={2}
                />
              </div>
              {contentCreatorProfile?.social_links && (
                <div className="m-auto flex w-fit flex-wrap gap-2 pt-2 sm:m-0">
                  {contentCreatorProfile?.social_links?.instagram && (
                    <Link
                      href={contentCreatorProfile?.social_links?.instagram}
                      target="_blank"
                    >
                      <Image
                        src="/images/landingPageImages/instagram.svg"
                        width={45}
                        height={45}
                        className="shrink-0"
                        alt="Instagram"
                      />
                    </Link>
                  )}

                  {contentCreatorProfile?.social_links?.facebook && (
                    <Link
                      href={contentCreatorProfile?.social_links?.facebook}
                      target="_blank"
                    >
                      <Image
                        src="/images/landingPageImages/facebook.svg"
                        width={45}
                        height={45}
                        className="shrink-0"
                        alt="fb"
                      />
                    </Link>
                  )}
                  {contentCreatorProfile?.social_links?.linkedin && (
                    <Link
                      href={contentCreatorProfile?.social_links?.linkedin}
                      target="_blank"
                    >
                      <Image
                        src="/images/landingPageImages/linkedin.svg"
                        width={45}
                        height={45}
                        className="shrink-0"
                        alt="linkedin"
                      />
                    </Link>
                  )}

                  {contentCreatorProfile?.social_links?.x && (
                    <Link
                      href={contentCreatorProfile?.social_links?.x}
                      target="_blank"
                    >
                      <Image
                        src="/svg/SocialMediaIcons/x-rounded.svg"
                        width={45}
                        height={45}
                        className="shrink-0"
                        alt="x"
                      />
                    </Link>
                  )}

                  {contentCreatorProfile?.social_links?.tiktok && (
                    <Link
                      href={contentCreatorProfile?.social_links?.tiktok}
                      target="_blank"
                    >
                      <Image
                        src="/svg/SocialMediaIcons/tiktok-rounded.svg"
                        width={45}
                        height={45}
                        className="shrink-0"
                        alt="tiktok"
                      />
                    </Link>
                  )}
                  {contentCreatorProfile?.social_links?.other && (
                    <Link
                      href={contentCreatorProfile?.social_links?.other}
                      target="_blank"
                    >
                      <Image
                        src="/svg/SocialMediaIcons/web-rounded.svg"
                        width={45}
                        height={45}
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
            <div className="p-5">
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    src="/svg/edu-exp.svg"
                    width={45}
                    height={45}
                    alt="web"
                    className="shrink-0"
                  />
                </div>
                <div className="text-base font-semibold text-neutral-700">
                  Educational Experience
                </div>
              </div>

              <div
                className={clsx(
                  styles.descStyle,
                  "ml-14 text-base font-normal text-neutral-700",
                )}
              >
                <ShowMoreLessUsingLine
                  content={
                    contentCreatorProfile?.answers?.educational_experience
                  }
                  showButtons={true}
                  lineLimit={2}
                />
              </div>
            </div>
          </Card>

          {/* Teaching Philosophy Card */}

          {countWords(contentCreatorProfile?.answers?.teaching_love) >= 1 && (
            <Card variant="outlined" className="!mb-5">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src="/svg/teaching-love.svg"
                      width={45}
                      height={45}
                      alt="web"
                      className="shrink-0"
                    />
                  </div>
                  <div className="text-base font-semibold text-neutral-700">
                    Teaching Philosophy
                  </div>
                </div>

                <div
                  className={clsx(
                    styles.descStyle,
                    "ml-14 text-base font-normal text-neutral-700",
                  )}
                >
                  <ShowMoreLessUsingLine
                    content={contentCreatorProfile?.answers?.teaching_love}
                    showButtons={true}
                    lineLimit={2}
                  />
                </div>
              </div>
            </Card>
          )}
          {/* Published Work & Resources Card */}

          {countWords(contentCreatorProfile?.answers?.additional_info) >= 1 && (
            <Card variant="outlined">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src="/svg/book-resources.svg"
                      width={45}
                      height={45}
                      alt="web"
                      className="shrink-0"
                    />
                  </div>
                  <div className="text-base font-semibold text-neutral-700">
                    Published Work & Resources
                  </div>
                </div>

                <div
                  className={clsx(
                    styles.descStyle,
                    "ml-14 text-base font-normal text-neutral-700",
                  )}
                >
                  <ShowMoreLessUsingLine
                    content={contentCreatorProfile?.answers?.additional_info}
                    showButtons={true}
                    lineLimit={2}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Content Published by Creator */}

          <div>
            <div className="my-5 text-xl font-bold text-black">
              Content Published by Creator
            </div>
            <div className="grid grid-cols-12 gap-4 overflow-visible md:gap-6 2xl:gap-7.5">
              {contentCreatorData?.data?.results?.map(
                (course: IndividualContentCardProps) => (
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4"
                    key=""
                  >
                    <ContentCard course={course} />
                  </div>
                ),
              )}
            </div>
            <Stack spacing={2} className="my-5 flex items-end">
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                size="large"
                color="primary"
                shape="rounded"
              />
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreatorProfileComp;
