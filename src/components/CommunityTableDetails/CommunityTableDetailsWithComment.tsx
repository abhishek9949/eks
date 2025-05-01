import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import Comments from "./Comments";
import clsx from "clsx";
import styles from "./CommunityTableDetails.module.scss";
import SortCommentDropdown from "./SortCommentDropdown";
import SearchIcon from "@mui/icons-material/Search";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import ShowMoreLess from "@/components/common/ShowMoreLess";
import ShareWithPeople from "@/components/common/ShareWithPeople/ShareWithPeople";
import { usersData } from "@/temp/shareUserData";
import AddToBinComp from "@/components/common/AddToBin";
import { useAppDispatch } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { UserDataProps } from "@/types/shareWithPeople";
import { CommunityTableDetailsWithCommentProps } from "@/types/community/CommunityDetails";
import { LikeForumResType } from "@/types/reducer";
import CourseCategories from "@/components/common/CourseCategories";
import {
  hideConfirmAddToBin,
  hideOpenAddToBin,
  showConfirmAddToBin,
  showOpenAddToBin,
} from "@/redux/slices/addToBinSlice";
import { useSaveContentToBinMutation } from "@/redux/allReducer";

/**
 * Dont Remove this code block
 * import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
 */

const CommunityTableDetailsWithComment = ({
  forumId,
  likeForumPromise,
  handleCommunityComment,
  title,
  timeAgo,
  tags,
  desc,
  isLiked,
  likeCount,
  commentCount,
  handleSearchComment,
  handleSortComment,
  sortComment,
  commentsList,
  handleCommunityCommentReply,
  fetchRepliesList,
  repliesList,
  hasMoreReplies,
  likeCommentByIdPromise,
  handleReportComment,
  hasMoreComments,
  handleLoadMoreComments,
  searchCommentText,
  communityCommentRes,
  created_by_details,
}: CommunityTableDetailsWithCommentProps) => {
  const dispatch = useAppDispatch();
  const [saveContentToBin] = useSaveContentToBinMutation();
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const [inputComment, setInputComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentBoxRef = useRef<HTMLTextAreaElement | null>(null);
  const [isNextLine, setIsNextLine] = useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserDataProps[] | []
  >([]);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openAddBinForCommunityDetails, setOpenAddBinForCommunityDetails] =
    useState(false);
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
    const selectedData = selectedUsers.map((user) => ({
      name: user.name,
      email: user.email,
    }));
    console.log("postId==", forumId, "\n", "selectedUsers===", selectedData);
  };

  /* Dont Remove this code block */
  // NOSONAR
  // const handleClickOpenShareDialog = () => {
  //   setOpenShareDialog(true);
  // };

  const handleCloseShareDiaog = () => {
    setOpenShareDialog(false);
  };

  /**
   * Add to bin started
   */
  const handleClickOpenAddBinForCommunityDetails = () => {
    setOpenAddBinForCommunityDetails(true);
    dispatch(showOpenAddToBin());
  };

  const handleCloseAddBinForCommunityDetails = () => {
    setOpenAddBinForCommunityDetails(false);
    dispatch(hideOpenAddToBin());
    dispatch(hideConfirmAddToBin());
  };

  const handleSelectBinForCommunityDetails = () => {
    dispatch(hideOpenAddToBin());
    dispatch(showConfirmAddToBin());
  };

  const handleAddToBinForCommunityDetails = (binId: number) => {
    const payload = {
      bin_ids: [binId],
      entity_id: forumId,
      entity_type: "community",
      metadata: {
        forum_id: forumId,
        category: tags,
        topic_title: title,
        topic_description: desc,
        created_by_details: created_by_details
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
        handleCloseAddBinForCommunityDetails();
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
        handleCloseAddBinForCommunityDetails();
      });
  };

  /**
   * Add to bin ended
   */
  const handleLikeForum = (forumId: number) => {
    setLoadingLike(true);
    likeForumPromise({
      endpoint: `${API_CONSTANTS.LIKE_FORUM_BY_ID}/${forumId}/like/`,
      method: "POST",
    })
      // @ts-ignore
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

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputComment(e.target.value);
  };

  const handelPostComment = () => {
    setTimeout(() => {
      commentBoxRef.current?.focus();
    }, 0);
  };

  const handleInputNextLineChange = () => {
    const textarea: HTMLTextAreaElement | null = commentBoxRef.current;

    if (!textarea) return; // Ensure textarea is not null

    // Get the height of a single line of text
    const lineHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10,
    );

    // Calculate the number of lines based on the scrollHeight and lineHeight
    const numberOfLines = Math.floor(textarea.scrollHeight / lineHeight);

    // Check if the number of lines exceeds 1
    setIsNextLine(numberOfLines > 1);
  };

  const onEmojiSelect = (emojiObject: { emoji: string }) => {
    setInputComment((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleNewComment = (forumId: number, commentText: string) => {
    if (inputComment) {
      handleCommunityComment(forumId, commentText);
      setInputComment("");
      setShowEmojiPicker(false);
      setIsNextLine(false);
    }
  };

  const handleCancelCommentBox = () => {
    setInputComment("");
    setShowEmojiPicker(false);
    setIsNextLine(false);
  };

  useEffect(() => {
    // Check if the URL contains "#comments" and scroll to the ref
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#comments" &&
      commentSectionRef.current
    ) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div className="relative w-full rounded-lg border border-gray-200 p-4 shadow-md">
        <div className="flex justify-between">
          <div className="mb-4 flex items-center">
            <div className="me-[0.32rem] text-lg text-black">{title}</div>
            <div>
              <span className="text-sm text-gray-500">•</span>
              <span className="ms-[0.32rem] text-sm text-gray-500">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
        <div>
          <CourseCategories tags={tags} />
          <p
            className={clsx(
              "mb-8.5 mt-5 text-base font-light text-black",
              styles.descStyle,
            )}
          >
            <ShowMoreLess content={desc ?? ""} showButtons={true} wordLimit={40} />
          </p>
          {/* Corrected bottom section */}
          <div>
            <div className="flex gap-4" ref={commentSectionRef}>
              <button
                className="flex w-18 cursor-pointer items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-3"
                onClick={() =>
                  forumId !== undefined && handleLikeForum(forumId)
                }
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
                        {isLiked ? (
                          <ThumbUpAltIcon color="primary" />
                        ) : (
                          <ThumbUpAltOutlinedIcon />
                        )}
                      </>
                    )}
                  </>
                )}
                <span>{newLikeCount ?? likeCount}</span>
              </button>
              <button
                className="flex w-18 cursor-pointer items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-3"
                onClick={handelPostComment}
              >
                <Image
                  src="/svg/comments.svg"
                  width={25}
                  height={25}
                  alt="comment"
                />
                <span>{communityCommentRes ?? commentCount}</span>
              </button>
              <button
                className="flex w-18 cursor-pointer items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-3"
                onClick={handleClickOpenAddBinForCommunityDetails}
              >
                <Image src="/svg/Bin.svg" width={25} height={25} alt="bin" />
                <span>Bin</span>
              </button>

              {/* Dont Remove this code block */}

              {/* <button
                className="flex w-22 cursor-pointer items-center justify-center gap-1 rounded-lg border border-blue-light-6 bg-blue-light-6 p-3"
                onClick={handleClickOpenShareDialog}
              >
                <ShareOutlinedIcon />
                <span>Share</span>
              </button> */}
            </div>
          </div>
        </div>
        {/**
         * Comment section start from here
         */}
        <div className="mt-5">
          <div className="mb-5 grid grid-cols-6 gap-4 xl:grid-cols-12">
            <div className="col-span-6 xl:col-span-7 2xl:col-span-8">
              <div className="relative rounded-md border border-gray-1">
                <textarea
                  className={clsx(
                    "w-full resize-none overflow-hidden pt-[0.7rem] placeholder-gray-400 outline-none",
                    {
                      "mb-7.5 h-[5rem] pe-4.5 ps-4.5": isNextLine,
                      "h-[2.4rem] pe-40 ps-10": !isNextLine,
                    },
                  )}
                  placeholder="Leave your comment"
                  value={inputComment}
                  onChange={handleCommentChange}
                  ref={commentBoxRef}
                  onInput={handleInputNextLineChange}
                />
                <span
                  className={clsx("absolute start-2.5", {
                    "bottom-0 my-2 flex items-end": isNextLine,
                    "inset-y-0 flex items-center": !isNextLine,
                  })}
                >
                  <AddReactionOutlinedIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setShowEmojiPicker((val) => !val);
                    }}
                  />
                </span>
                {showEmojiPicker && (
                  <div
                    className={clsx("absolute start-2.5 top-10 z-10", {
                      "top-30": isNextLine,
                    })}
                  >
                    <EmojiPicker onEmojiClick={onEmojiSelect} />
                  </div>
                )}
                <span
                  className={clsx("absolute end-1 gap-2", {
                    "bottom-0 my-2 flex items-end": isNextLine,
                    "inset-y-0 flex items-center": !isNextLine,
                  })}
                >
                  <button
                    className="action-button rounded bg-gray-9 px-2 py-1 text-sm text-black"
                    onClick={handleCancelCommentBox}
                    style={{ zIndex: 1 }}
                  >
                    Cancel
                  </button>
                  {inputComment.trim().length > 0 ? (
                    <button
                      className="action-button rounded bg-primary px-2 py-1 text-sm text-white"
                      onClick={() =>
                        forumId !== undefined &&
                        handleNewComment(forumId, inputComment)
                      }
                    >
                      Comment
                    </button>
                  ) : (
                    <button className="action-button cursor-not-allowed rounded bg-gray-10 px-2 py-1 text-sm text-white">
                      Comment
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="col-span-4 xl:col-span-3 2xl:col-span-3">
              <div className="relative">
                <input
                  className="text-md block h-12 w-full rounded-md border border-gray-1 ps-8 placeholder-black focus:outline-none"
                  placeholder="Search Comment"
                  type="text"
                  onChange={handleSearchComment}
                />
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-1.5">
                  <SearchIcon className="text-black" />
                </span>
              </div>
            </div>
            <div className="col-span-1 xl:col-span-2 2xl:col-span-1">
              <SortCommentDropdown
                handleSortComment={handleSortComment}
                sortComment={sortComment}
              />
            </div>
          </div>
          {commentsList?.map((item) => {
            return (
              <Comments
                key={item?.comment_id}
                comment={item}
                handleCommunityCommentReply={handleCommunityCommentReply}
                forumId={forumId}
                fetchRepliesList={fetchRepliesList}
                repliesList={repliesList}
                hasMoreReplies={hasMoreReplies}
                likeCommentByIdPromise={likeCommentByIdPromise}
                handleReportComment={handleReportComment}
                searchCommentText={searchCommentText}
              />
            );
          })}
          {commentsList?.length === 0 && (
            <div className="text-center">
              <p> No comments found</p>
            </div>
          )}
          {hasMoreComments && (
            <button onClick={handleLoadMoreComments} className="underline">
              Show more comments
            </button>
          )}
        </div>
      </div>
      <ShareWithPeople
        usersData={usersData}
        open={openShareDialog}
        handleClose={handleCloseShareDiaog}
        handleChangeSelectUser={handleChangeSelectUser}
        handleShare={handleShare}
      />

      {openAddBinForCommunityDetails && (
        <AddToBinComp
          key={openAddBinForCommunityDetails ? "dialog-open" : "dialog-closed"}
          open={openAddBinForCommunityDetails}
          handleClose={handleCloseAddBinForCommunityDetails}
          handleSelectBin={handleSelectBinForCommunityDetails}
          handleAddToBin={handleAddToBinForCommunityDetails}
          isAddingBinContent={isAddingBinContent}
          contentTitle={title as string}
        />
      )}
    </>
  );
};

export default CommunityTableDetailsWithComment;
