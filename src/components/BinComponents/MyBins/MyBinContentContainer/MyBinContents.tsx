import React, { useState } from "react";
import BinCommunityCard from "@/components/BinComponents/CommonBinComponent/BinContent/BinCommunityCard";
import BinContentCard from "@/components/BinComponents/CommonBinComponent/BinContent/BinContentCard";
import BinTable from "@/components/BinComponents/CommonBinComponent/BinTable/BinTable";
import { Column } from "@/types/table";
import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CourseCategories from "@/components/common/CourseCategories";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  ArticleOutlined,
  PrintOutlined,
  HeadsetOutlined,
  FindInPageOutlined,
  SmartDisplayOutlined,
  TheatersOutlined,
} from "@mui/icons-material";
import TableRestaurantOutlinedIcon from "@mui/icons-material/TableRestaurantOutlined";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  CommunityMetadataType,
  ContentMetadataType,
  GetContentFromBinData,
  MyBinContentsPropType,
} from "@/types/bins/binsType";
import BinContentMenu from "../../CommonBinComponent/BinContent/BinContentMenu";
import CustomAvatar from "@/components/common/CustomAvatar";
import { useAppSelector } from "@/redux/hooks";
import { capitalizeWords } from "@/utils/reusableFunctions";

const MyBinContents = ({
  binContentData,
  isBinDataLoading,
  initialLoading,
  alignment,
  handleRemoveBinContent,
  breadcrumbSource,
}: MyBinContentsPropType) => {
  const loggedInUser = useAppSelector(
    (state) => state.cookies.cookies.userCookies,
  );

  const checkSharedBin = binContentData
    .map((item) => item?.created_by)
    .includes(loggedInUser?.user_id as number);

  const [openBinContentActionMenu, setOpenBinContentActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentContentRow, setCurrentContentRow] =
    useState<GetContentFromBinData | null>(null);

  const handleOpenBinContentActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: GetContentFromBinData,
  ) => {
    setOpenBinContentActionMenu(event.currentTarget);
    setCurrentContentRow(row);
  };
  const handleCloseBinContentActionMenu = () => {
    setOpenBinContentActionMenu(null);
    setCurrentContentRow(null);
  };

  const getIconBasedOnCardType = (type: string) => {
    const iconObject: { [key: string]: JSX.Element } = {
      article: <ArticleOutlined className="!text-3xl" />,
      "featured article": <ArticleOutlined className="!text-3xl" />,
      "printable resource": <PrintOutlined className="!text-3xl" />,
      podcast: <HeadsetOutlined className="!text-3xl" />,
      research: <FindInPageOutlined className="!text-3xl" />,
      workshop: <SmartDisplayOutlined className="!text-3xl" />,
      video: <TheatersOutlined className="!text-3xl" />,
    };
    return iconObject[type];
  };
  const columns: Column[] = [
    {
      field: "title",
      label: "Name",
      align: "left",
      render: (value: string, row) => (
        <div className="text-lg font-medium text-[#272833]">
          <div>
            {row?.content_type === "community" ? (
              <Link
                href={`${URL_CONSTANTS.COMMUNITY_TABLE}/${row?.content_id}?source=${breadcrumbSource()}`}
              >
                <span className="flex items-center gap-2 ">
                  <TableRestaurantOutlinedIcon className="!text-3xl" />
                  {row?.metadata?.topic_title}
                </span>
              </Link>
            ) : (
              <Link
                href={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH_PRIVIEW(row?.content_id)}?source=${breadcrumbSource()}`}
              >
                <span className="flex items-center gap-2 ">
                  {getIconBasedOnCardType(
                    row?.metadata?.content_type?.toLowerCase(),
                  )}{" "}
                  {row?.metadata?.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      ),
    },
    {
      field: "category",
      label: "Categories",
      align: "left",
      width: "200px",
      render: (value: string, row) => (
        <div className="flex flex-grow flex-col gap-2.5 p-3">
          {row?.content_type === "community" ? (
            <CourseCategories tags={row?.metadata?.category} />
          ) : (
            <CourseCategories tags={row?.metadata?.categories} />
          )}
        </div>
      ),
    },
    {
      field: "user_name",
      label: "Author",
      align: "left",
      width: "200px",
      render: (value: string, row) => (
        <div className="flex items-center gap-2 text-lg font-medium text-[#6b6c7e]">
          {row?.metadata?.created_by_details?.profile_image ? (
            <CustomAvatar
              width={35}
              height={35}
              src={row?.metadata?.created_by_details?.profile_image}
            />
          ) : null}
          {!row?.metadata?.created_by_details?.profile_image && (
            <CustomAvatar
              width={35}
              height={35}
              icon={<PersonIcon className="!text-white" />}
            />
          )}
          {capitalizeWords(row?.metadata?.created_by_details?.full_name) ||
            "Author"}
        </div>
      ),
    },
    ...((checkSharedBin
      ? [
          {
            field: "actions",
            label: "Actions",
            align: "center",
            width: "100px",
            render: (value, row) => (
              <div>
                <IconButton
                  id={`user-action-long-button-${currentContentRow?.content_id}`}
                  aria-controls={
                    openBinContentActionMenu ? "basic-menu" : undefined
                  }
                  aria-expanded={openBinContentActionMenu ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) =>
                    handleOpenBinContentActionMenu(event, row)
                  }
                >
                  <MoreVertIcon />
                </IconButton>
                {currentContentRow && (
                  <BinContentMenu
                    openBinContentAction={openBinContentActionMenu}
                    handleCloseBinContentAction={
                      handleCloseBinContentActionMenu
                    }
                    id={
                      currentContentRow?.content_type === "community"
                        ? (currentContentRow.metadata as CommunityMetadataType)
                            .forum_id
                        : (currentContentRow.metadata as ContentMetadataType)
                            ._id
                    }
                    title={
                      currentContentRow?.content_type === "community"
                        ? (currentContentRow.metadata as CommunityMetadataType)
                            .topic_title
                        : (currentContentRow.metadata as ContentMetadataType)
                            .title
                    }
                    handleRemoveBinContent={handleRemoveBinContent}
                  />
                )}
              </div>
            ),
          },
        ]
      : []) as Column[]),
  ];
  return (
    <div>
      {alignment === "grid" && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {binContentData?.map((item) => {
              return (
                <div key={item?.content_id}>
                  {item?.content_type === "content" && (
                    <BinContentCard
                      // @ts-ignore
                      course={item?.metadata}
                      created_by_id={item?.created_by}
                      handleRemoveBinContent={handleRemoveBinContent}
                      breadcrumbSource={breadcrumbSource}
                    />
                  )}
                  {item?.content_type === "community" && (
                    <BinCommunityCard
                      // @ts-ignore
                      community={item?.metadata}
                      created_by_id={item?.created_by}
                      handleRemoveBinContent={handleRemoveBinContent}
                      breadcrumbSource={breadcrumbSource}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {!initialLoading &&
            binContentData.length === 0 &&
            !isBinDataLoading && (
              <div className="flex items-center justify-center p-20">
                <div className="text-2xl text-black">No Content Found</div>
              </div>
            )}
        </>
      )}

      {alignment === "list" && (
        <div>
          <BinTable
            columns={columns}
            data={binContentData}
            enableSelection={false}
          />

          {!initialLoading &&
            binContentData.length === 0 &&
            !isBinDataLoading && (
              <div className="flex items-center justify-center p-20">
                <div className="text-2xl text-black">No Content Found</div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default MyBinContents;
