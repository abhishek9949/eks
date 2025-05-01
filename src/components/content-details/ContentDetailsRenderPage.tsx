"use client";

import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CourseTag from "@/components/common/CourseTag";
import CourseCategories from "@/components/common/CourseCategories";
import GroupIcons from "@/components/GroupIcons";
import ContentTypeIcon from "@/components/content-details/ContentTypeIcon";
import ContentRenderer from "@/components/content-details/ContentRenderer";
import TextCard from "@/components/content-details/TextCard";
import IndividualCourse from "@/components/ResourceAndResearch/IndividualCourse";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PageMetaData from "@/components/common/PageMetaData";
import {
  useLazyGetContentByIdQuery,
  useLazyGetRelatedContentQuery,
  useLikeContentMutation,
  useSaveContentToBinMutation,
} from "@/redux/allReducer";
import {
  hideConfirmAddToBin,
  hideOpenAddToBin,
  showConfirmAddToBin,
  showOpenAddToBin,
} from "@/redux/slices/addToBinSlice";
import AddToBinComp from "@/components/common/AddToBin";
import {
  ContentDetailsRenderPageProps,
  IndividualContentCardProps,
} from "@/types/content";
import { CustomAudioPlayer } from "@/components/common/DynamicImports";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

const ContentDetailsRenderPage = ({
  id,
  breadcrumbDetails,
}: ContentDetailsRenderPageProps) => {
  const [saveContentToBin] = useSaveContentToBinMutation();
  const [getContentById] = useLazyGetContentByIdQuery();
  const [getRelatedContent] = useLazyGetRelatedContentQuery();
  const dispatch = useAppDispatch();
  const [fileUrls, setFileUrls] = useState<{
    fileUrl?: string;
    thumbnailUrl?: string;
  }>({});
  const [likeContent] = useLikeContentMutation();
  const [contentDetails, setContentDetails] = useState<any>(null); // Initialize as `null`
  const [relatedContent, setRelatedContent] =
    useState<IndividualContentCardProps[]>();
  const [likeCount, setLikeCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const preview = searchParams.get("preview") === "true";
  const myBinsSource = searchParams.get("source") === "mybin";
  const recentBinsSource = searchParams.get("source") === "recents";
  const sharedBinsSource = searchParams.get("source") === "shared-with-me";

  const globalSearchQuery = useMemo(
    () => searchParams.get("search") ?? "",
    [searchParams],
  );
  const [openAddBinForContentDetails, setOpenAddBinForContentDetails] =
    useState(false);
  const [isAddingBinContent, setIsAddingBinContent] = useState(false);

  const getContentByIdDetails = () => {
    getContentById({
      endpoint: preview
        ? `${API_CONSTANTS.GET_CONTENT_PREVIEW}${id}/`
        : `${API_CONSTANTS.API_CONTENT}${id}/details`,
    })
      .unwrap()
      .then((response) => {
        setContentDetails(response);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  const handleGetRelatedContent = () => {
    getRelatedContent({
      endpoint: `${API_CONSTANTS.GET_RELATED_CONTENT}${id}`,
    })
      .unwrap()
      .then((result) => {
        setRelatedContent(result?.results);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    getContentByIdDetails();
    if (!preview) handleGetRelatedContent();
  }, []);

  useEffect(() => {
    setFileUrls({
      fileUrl: contentDetails?.file?.url,
      thumbnailUrl: contentDetails?.thumbnail_url,
    });
    setLikeCount(contentDetails?.likes);
  }, [contentDetails]);

  useEffect(() => {
    if (globalSearchQuery && !preview) {
      router.replace(
        `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/?search=${globalSearchQuery}`,
      );
    }
  }, [globalSearchQuery]);

  // If contentDetails is null or undefined, show a loading or fallback UI
  if (!contentDetails) {
    return <Loader />;
  }

  const {
    content_type,
    tags,
    title,
    description,
    views,
    categories,
    is_liked,
    watch_duration,
    published_by,
    created_by,
    file,
  } = contentDetails;

  const breadcrumbLevels = [
    {
      name: preview ? "Content List" : "Resource and Research",
      path: preview
        ? URL_CONSTANTS.ADMIN_CONTENT_LIST
        : URL_CONSTANTS.RESOURCE_AND_RESEARCH,
      icon: preview ? (
        <MenuBookOutlined color="secondary" />
      ) : (
        <DescriptionIcon color="secondary" />
      ),
    },
    ...(breadcrumbDetails?.length ? breadcrumbDetails : []),
    {
      name: title,
    },
  ];

  const handleLikeContent = () => {
    likeContent({
      endpoint: `${API_CONSTANTS.API_CONTENT}${id}/like/`,
      method: "POST",
    })
      .unwrap()
      .then((result) => {
        if (result) {
          dispatch(
            showToastMessage({ message: result?.message, severity: "success" }),
          );
          setLikeCount(result?.like_count);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  /**
   * Add to bin started
   */
  const handleClickOpenAddBinForContentDetails = () => {
    setOpenAddBinForContentDetails(true);
    dispatch(showOpenAddToBin());
  };

  const handleCloseAddBinForContentDetails = () => {
    setOpenAddBinForContentDetails(false);
    dispatch(hideOpenAddToBin());
    dispatch(hideConfirmAddToBin());
  };

  const handleSelectBinForContentDetails = () => {
    dispatch(hideOpenAddToBin());
    dispatch(showConfirmAddToBin());
  };

  const handleAddToBinForContentDetails = (binId: number) => {
    const payload = {
      bin_ids: [binId],
      entity_id: id,
      entity_type: "content",
      metadata: {
        _id: id,
        title: contentDetails?.title,
        categories: contentDetails?.categories,
        description: contentDetails?.description,
        file: {
          duration: contentDetails?.file?.duration,
        },
        thumbnail_url: contentDetails?.thumbnail_url,
        content_type: contentDetails?.content_type,
        watch_duration: contentDetails?.watch_duration,
        created_by_details: contentDetails?.created_by_details,
      },
    };
    setIsAddingBinContent(true);
    saveContentToBin({
      endpoint: `${API_CONSTANTS.SAVE_CONTENT_TO_BIN}/`,
      method: "POST",
      data: payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Data added successfully",
            severity: "success",
          }),
        );
        setIsAddingBinContent(false);
        handleCloseAddBinForContentDetails();
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message:
              error?.data?.error || "Error while adding the community to Bin.",
            severity: "error",
          }),
        );
        setIsAddingBinContent(false);
        handleCloseAddBinForContentDetails();
      });
  };

  /**
   * Add to bin ended
   */

  const handleIconClick = (type: string) => {
    if (type === "like") {
      handleLikeContent();
    } else if (type === "bin") {
      handleClickOpenAddBinForContentDetails();
    }
  };

  /**
   * Dynamic breadcrumb chnage
   */

  const chnageBreadcrumbLavels = () => {
    let breadcrumbData = breadcrumbLevels;
    const breadcrumbImg = `<Image width={30} height={30} alt="Bin" src="/svg/Bin.svg" />`;
    if (myBinsSource) {
      const myBinsBreadcrumb = [
        {
          name: "My Bin",
          path: `${URL_CONSTANTS.BINS}/mybin`,
          icon: (
            <div
              className="align-center flex h-4 w-4 text-gray-breadcrumb"
              dangerouslySetInnerHTML={{ __html: breadcrumbImg }}
            ></div>
          ),
        },
        ...(breadcrumbDetails?.length ? breadcrumbDetails : []),
        {
          name: title,
        },
      ];
      breadcrumbData = myBinsBreadcrumb;
    } else if (recentBinsSource) {
      const recentBinsBreadcrumb = [
        {
          name: "Recents",
          path: `${URL_CONSTANTS.BINS}/recents`,
          icon: (
            <AccessTimeIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
          ),
        },
        ...(breadcrumbDetails?.length ? breadcrumbDetails : []),
        {
          name: title,
        },
      ];
      breadcrumbData = recentBinsBreadcrumb;
    } else if (sharedBinsSource) {
      const sharedBinsBreadcrumb = [
        {
          name: "Shared with me",
          path: `${URL_CONSTANTS.BINS}/shared-with-me`,
          icon: (
            <PeopleAltOutlinedIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
          ),
        },
        ...(breadcrumbDetails?.length ? breadcrumbDetails : []),
        {
          name: title,
        },
      ];
      breadcrumbData = sharedBinsBreadcrumb;
    }
    return breadcrumbData;
  };

  return (
    <div className="pt-6">
      <PageMetaData title="Resource and Research" />
      <Breadcrumb levels={chnageBreadcrumbLavels()} />
      <div className="mb-3 ">
        <div className="relative">
          {content_type !== "Article" &&
            content_type !== "Research" &&
            content_type !== "Printable Resource" && (
              <div className="absolute right-5.5 top-5.5 z-9 flex h-9 gap-2">
                <ContentTypeIcon contentType={content_type} />
              </div>
            )}

          <ContentRenderer
            contentType={content_type}
            url={
              content_type === "Podcast"
                ? (fileUrls?.thumbnailUrl ?? "")
                : (fileUrls?.fileUrl ?? "")
            }
            contentId={id}
            isPreview={preview}
            watchedDuration={watch_duration}
            fileDuration={file?.duration}
          />
        </div>

        <div className="py-6">
          <CourseCategories
            tags={categories}
            fontSize="sm"
            gap="2.5"
            customClass="!py-1"
          />

          <div className="mt-3 grid grid-cols-4 items-center gap-6">
            <div className="col-span-4 md:col-span-2">
              <h1 className="text-xl text-black">{title}</h1>
              <CourseTag
                tags={tags}
                fontSize="sm"
                gap="2.5"
                customClass="!py-1"
              />
            </div>
            {!preview && (
              <div className="col-span-4 flex md:col-span-2 md:justify-end">
                <GroupIcons
                  icons={[
                    { type: "like", count: likeCount, isActive: is_liked },
                    { type: "share", count: "share" },
                    { type: "bin", count: "Bin" },
                  ]}
                  onIconClick={handleIconClick}
                />
              </div>
            )}
          </div>

          {content_type === "Podcast" && (
            <CustomAudioPlayer
              contentId={id}
              fileUrls={fileUrls}
              isPreview={preview}
              watchedDuration={watch_duration}
              fileDuration={file?.duration}
            />
          )}

          <TextCard
            text={description}
            createdBy={published_by}
            createdById={created_by}
            viewsCount={views as number}
          />
        </div>
      </div>
      {!preview && relatedContent && (
        <div className="mb-6">
          <IndividualCourse courses={relatedContent} title="Related topic's" />
        </div>
      )}
      {openAddBinForContentDetails && (
        <AddToBinComp
          key={openAddBinForContentDetails ? "dialog-open" : "dialog-closed"}
          open={openAddBinForContentDetails}
          handleClose={handleCloseAddBinForContentDetails}
          handleSelectBin={handleSelectBinForContentDetails}
          handleAddToBin={handleAddToBinForContentDetails}
          isAddingBinContent={isAddingBinContent}
          contentTitle={contentDetails?.title}
        />
      )}
    </div>
  );
};

export default ContentDetailsRenderPage;
