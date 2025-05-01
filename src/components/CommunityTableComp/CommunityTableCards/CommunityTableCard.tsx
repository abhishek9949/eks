import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ShareWithPeople from "@/components/common/ShareWithPeople/ShareWithPeople";
import { usersData } from "@/temp/shareUserData";
import AddToBinComp from "@/components/common/AddToBin";
import ShowMoreLess from "@/components/common/ShowMoreLess";
import { useAppDispatch } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { UserDataProps } from "@/types/shareWithPeople";
import { LikeForumResType } from "@/types/reducer";
import { AvatarGroup } from "@mui/material";
import CourseCategories from "@/components/common/CourseCategories";
import {
  hideConfirmAddToBin,
  hideOpenAddToBin,
  showConfirmAddToBin,
  showOpenAddToBin,
} from "@/redux/slices/addToBinSlice";
import { useSaveContentToBinMutation } from "@/redux/allReducer";
import CustomAvatar from "@/components/common/CustomAvatar";

/* Dont Remove this code block */
// NOSONAR  import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"; */

const CommunityTableCard = (props: any) => {
  const dispatch = useAppDispatch();
  const [saveContentToBin] = useSaveContentToBinMutation();
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserDataProps[] | []
  >([]);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openAddBinForCommunityCard, setOpenAddBinForCommunityCard] = useState(false);
  const [isAddingBinContent, setIsAddingBinContent] = useState(false);
  const [newLiked, setNewLiked] = useState<boolean | null>(null);
  const [newLikeCount, setNewLikeCount] = useState<number | null>(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const handleChangeSelectUser = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: UserDataProps[],
  ) => {
    setSelectedUsers(newValue);
  };

  const handleShare = () => {
    const selectedData = selectedUsers?.map((user: UserDataProps) => ({
      name: user.name,
      email: user.email,
    }));
    // Keeping it for debugging until API gets integrated
    console.log(selectedData);
  };

  /* Dont Remove this code block */
  // NOSONAR
  // const handleClickOpenShareDialog = () => {
  // setOpenShareDialog(true);
  // };
  const handleCloseShareDiaog = () => {
    setOpenShareDialog(false);
  };

  /**
   * Add to bin started
   */
  const handleClickOpenAddBinForCommunityCard = () => {
    setOpenAddBinForCommunityCard(true);
    dispatch(showOpenAddToBin());
  };

  const handleCloseAddBinForCommunityCard = () => {
    setOpenAddBinForCommunityCard(false);
    dispatch(hideOpenAddToBin());
    dispatch(hideConfirmAddToBin());
  };

  const handleSelectBinForCommunityCard = () => {
    dispatch(hideOpenAddToBin());
    dispatch(showConfirmAddToBin());
  };

  const handleAddToBinForCommunityCard = (binId: number) => {
    const payload = {
      bin_ids: [binId],
      entity_id: props?.id,
      entity_type: "community",
      metadata: {
        forum_id: props?.id,
        category: props?.tags,
        topic_title: props?.title,
        topic_description: props?.desc,
        created_by_details: props?.created_by_details
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
            message: "Community added successfully",
            severity: "success",
          }),
        );
        setIsAddingBinContent(false);
        handleCloseAddBinForCommunityCard();
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message:
              error?.data?.error ||
              "Error while adding the community to Bin.",
            severity: "error",
          }),
        );
        setIsAddingBinContent(false);
        handleCloseAddBinForCommunityCard();
      });
  };

  /**
   * Add to bin ended
   */

  const handleLikeForum = (forumId: number) => {
    setLoadingLike(true);
    props
      .likeForumPromise({
        endpoint: `${API_CONSTANTS.LIKE_FORUM_BY_ID}/${forumId}/like/`,
        method: "POST",
      })
      .unwrap()
      .then((res: LikeForumResType) => {
        setLoadingLike(false);
        setNewLiked(res?.is_liked);
        setNewLikeCount(res?.like_count);
      })
      .catch((err: LikeForumResType) => {
        setLoadingLike(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error liking the forum",
            severity: "error",
          }),
        );
      });
  };

  return (
    <>
      <div className="relative w-full rounded-lg border border-gray-200 p-4 shadow-md">
        <div className="flex justify-between">
          <Link
            href={URL_CONSTANTS.COMMUNITY_TABLE + "/" + props.id}
            className="mb-4 flex items-center"
          >
            <div className="me-[0.32rem] text-lg text-black hover:underline">
              {props?.title}
            </div>
            <div>
              <span className="text-sm text-gray-500">•</span>
              <span className="ms-[0.32rem] text-sm text-gray-500">
                {props?.timeAgo}
              </span>
            </div>
          </Link>
        </div>
        <div>
          <CourseCategories tags={props?.tags} />
          <p className="mb-8 text-base font-light text-black">
            <ShowMoreLess content={props?.desc} showButtons={false} wordLimit={40} />
          </p>
          {/**
           * Bottom section
           */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 md:gap-8">
              {/**
               * Left
               */}
              <div className="flex items-center gap-1">
                <AvatarGroup spacing="medium">
                  {props.avatars?.map((item: string) => (
                   <CustomAvatar 
                   key={item}
                   name={item} 
                   width={35} 
                   height={35} 
                   randomColor
                 />
                 
                  ))}
                </AvatarGroup>

                <div className="text-black">
                  {props.avatars?.length === 1 &&
                    `Commented by ${props.avatars[0]}`}
                  {props.avatars?.length === 2 &&
                    `Commented by ${props.avatars[0]} and ${props.avatars[1]}`}
                  {props.avatars?.length > 2 &&
                    `Commented by ${props.avatars[0]}, ${props.avatars[1]} and others`}
                </div>
              </div>
              {/**
               * Right
               */}
              <div className="flex flex-wrap justify-end gap-2 sm:gap-3 md:gap-4">
                <button
                  className="flex items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-2 sm:p-3"
                  onClick={() => handleLikeForum(props.id)}
                  disabled={loadingLike}
                >
                  {loadingLike ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                  ) : (
                    <>
                      {newLiked === true || newLiked === false ? (
                        <>
                          {newLiked ? (
                            <ThumbUpAltIcon color="primary" />
                          ) : (
                            <ThumbUpAltOutlinedIcon />
                          )}
                        </>
                      ) : (
                        <>
                          {props?.isLiked ? (
                            <ThumbUpAltIcon color="primary" />
                          ) : (
                            <ThumbUpAltOutlinedIcon />
                          )}
                        </>
                      )}
                    </>
                  )}
                  <span>{newLikeCount ?? props.likeCount}</span>
                </button>
                <Link
                  href={`${URL_CONSTANTS.COMMUNITY_TABLE}/${props.id}#comments`}
                >
                  <div className="flex items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-2 sm:p-3">
                    <Image
                      src="/svg/comments.svg"
                      width={25}
                      height={25}
                      alt="comment"
                    />
                    <span>{props.commentCount}</span>
                  </div>
                </Link>

                <button
                  className="flex items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-2 sm:p-3"
                  onClick={handleClickOpenAddBinForCommunityCard}
                >
                  <Image src="/svg/Bin.svg" width={25} height={25} alt="bin" />
                  <span>Bin</span>
                </button>
                {/* Dont Remove this code block */}

                {/* <button
                  className="flex items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-2 sm:p-3"
                  onClick={handleClickOpenShareDialog}
                >
                  <ShareOutlinedIcon />
                  <span>Share</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareWithPeople
        usersData={usersData}
        open={openShareDialog}
        handleClose={handleCloseShareDiaog}
        handleChangeSelectUser={handleChangeSelectUser}
        handleShare={handleShare}
      />
      {openAddBinForCommunityCard && (
        <AddToBinComp
          key={openAddBinForCommunityCard ? "dialog-open" : "dialog-closed"}
          open={openAddBinForCommunityCard}
          handleClose={handleCloseAddBinForCommunityCard}
          handleSelectBin={handleSelectBinForCommunityCard}
          handleAddToBin={handleAddToBinForCommunityCard}
          isAddingBinContent={isAddingBinContent}
          contentTitle={props?.title}
        />
      )}
    </>
  );
};

export default CommunityTableCard;
