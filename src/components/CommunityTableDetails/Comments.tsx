import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EmojisPicker from "emoji-picker-react";
import Reply from "./Reply";
import clsx from "clsx";
import EmojiIcon from "@mui/icons-material/AddReactionOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { timeDifference } from "@/utils/reusableFunctions";
import { useAppDispatch } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ReportForumUI from "@/components/CommunityTableDetails/ReportForumUI";
import {
  hideOpenReport,
  hideConfirmReport,
  showOpenReport,
} from "@/redux/slices/reportCommentSlice";
import { LikeCommentResType } from "@/types/reducer";
import { ReplyDataType } from "@/types/community/CommunityDetails";
import { CustomTooltip } from "@/components/common/Tooltip";
import CustomAvatar from "@/components/common/CustomAvatar";

const Comments = ({
  comment,
  handleCommunityCommentReply,
  fetchRepliesList,
  repliesList,
  hasMoreReplies,
  likeCommentByIdPromise,
  handleReportComment,
  searchCommentText
}: any) => {
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const textareaCommentRef = useRef<HTMLTextAreaElement>(null);
  const [isSecondCommentBoxLine, setIsSecondCommentBoxLine] = useState(false);
  const [currentReplyPage, setCurrentReplyPage] = useState(0);

  // Like Comment state
  const [newLikedComment, setNewLikedComment] = useState<boolean | null>(null);
  const [newLikeCountComment, setNewLikeCountComment] = useState<number | null>(
    null,
  );
  const [loadingLikeComment, setLoadingLikeComment] = useState(false);
  // Report Comment State
  const [openReportComment, setOpenReportComment] = useState(false);

  const handleOpenReportComment = () => {
    setOpenReportComment(true);
    dispatch(showOpenReport());
  };

  const handleCloseReportComment = () => {
    setOpenReportComment(false);
    dispatch(hideOpenReport());
    dispatch(hideConfirmReport());
  };
  // Report Commennt End

  const handleSetCurrentReplyPageOne = () => {
    setCurrentReplyPage(1);
  };

  // Reset currentReplyPage when searchComment changes
  useEffect(() => {
    setCurrentReplyPage(0);
  }, [searchCommentText]);

  const onEmojiPick = (emojiObject: { emoji: string }) => {
    setCommentText((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiSelector(false);
  };

  const handleReply = () => {
    const replyPrefix = `@${comment.user_name} `;
    setCommentText(replyPrefix); // Insert the username at the start
    setShowCommentBox(true);

    // Set focus and move caret after the reply prefix
    setTimeout(() => {
      if (textareaCommentRef.current) {
        textareaCommentRef.current.focus();
        textareaCommentRef.current.setSelectionRange(
          replyPrefix.length,
          replyPrefix.length,
        );
      }
    }, 0); // Timeout ensures the DOM update is complete before manipulating the textarea
  };

  const handleLikeComment = (commentId: number) => {
    setLoadingLikeComment(true);
    likeCommentByIdPromise({
      endpoint: `${API_CONSTANTS.LIKE_COMMENT_BY_ID}/${commentId}/like/`,
      method: "POST",
    })
      .unwrap()
      .then((res: LikeCommentResType) => {
        setLoadingLikeComment(false);
        setNewLikedComment(res?.is_liked);
        setNewLikeCountComment(res?.like_count);
      })
      .catch((err: LikeCommentResType) => {
        setLoadingLikeComment(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error liking the comment",
            severity: "error",
          }),
        );
      });
  };

  const handleCancelComment = () => {
    setCommentText("");
    setShowCommentBox(false);
    setShowEmojiSelector(false);
    setIsSecondCommentBoxLine(false);
  };

  const handleReplySave = (
    commentId: number,
    replyingId: number,
    commentText: string,
  ) => {
    handleCommunityCommentReply(commentId, replyingId, commentText);
    handleSetCurrentReplyPageOne();
    setShowCommentBox(false);
    setCommentText("");
    setShowEmojiSelector(false);
    setIsSecondCommentBoxLine(false);
  };

  // Handle backspace to remove the whole username
  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && commentText === `@${comment.user_name} `) {
      setCommentText(""); // Clear the entire username when backspace is pressed at the beginning
    }
  };

  const handleCommentSecondLineChange = () => {
    const textarea = textareaCommentRef.current;

    if (!textarea) return; // Ensure textarea is not null

    // Get the height of a single line of text
    const lineHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10,
    );

    // Calculate the number of lines based on the scrollHeight and lineHeight
    const numberOfLines = Math.floor(textarea.scrollHeight / lineHeight);

    // Check if the number of lines exceeds 1
    setIsSecondCommentBoxLine(numberOfLines > 1);
  };

  const handleShowMoreReplies = (commentId: number) => {
    const nextPage = currentReplyPage + 1;
    setCurrentReplyPage(nextPage);
    fetchRepliesList(commentId, nextPage);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center">
        <div className="me-[0.8rem]">
          <div>
            <CustomAvatar
              name={comment?.user_name}
              width={35}
              height={35}
              randomColor
            />
          </div>
        </div>
        <div className="text-md me-[0.32rem] text-black">
          {comment?.user_name}
        </div>
        <div>
          <span className="text-sm text-gray-500">•</span>
          <span className="ms-[0.32rem] text-sm text-gray-500">
            {timeDifference(comment?.created_at)}
          </span>
        </div>
      </div>
      <div className="ms-14 text-base font-light text-black">
        {comment?.content}
      </div>
      <div className="ms-14">
        <div className="flex gap-2">
          <button
            className="flex cursor-pointer items-center justify-center gap-1"
            onClick={() => handleLikeComment(comment?.comment_id)}
            disabled={loadingLikeComment}
          >
            {loadingLikeComment ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
            ) : (
              <>
                {newLikedComment === true || newLikedComment === false ? (
                  <>
                    {newLikedComment ? (
                      <ThumbUpAltIcon color="primary" />
                    ) : (
                      <ThumbUpAltOutlinedIcon />
                    )}
                  </>
                ) : (
                  <>
                    {comment?.is_liked ? (
                      <ThumbUpAltIcon color="primary" />
                    ) : (
                      <ThumbUpAltOutlinedIcon />
                    )}
                  </>
                )}
              </>
            )}
            <span className="font-light text-black">
              {newLikeCountComment ?? comment?.like_count}
            </span>
          </button>

          <button
            className="flex items-center justify-center"
            onClick={handleReply}
          >
            <Image src="/svg/comments.svg" width={22} height={22} alt="reply" />
            <span className="font-light text-black">Reply</span>
          </button>
          <CustomTooltip title="Report" placement="top">
            <button
              className="flex items-center justify-center"
              onClick={handleOpenReportComment}
            >
              <ReportOutlinedIcon className="text-red-3" />
            </button>
          </CustomTooltip>
        </div>
      </div>
      {showCommentBox ? (
        <div className="relative ms-14 w-[calc(100%-3.5rem)] rounded-md border border-gray-1 xl:w-1/2">
          <textarea
            className={clsx(
              "w-full resize-none overflow-hidden pt-[0.7rem] placeholder-gray-400 outline-none",
              {
                "mb-7.5 h-[5rem] pe-4.5 ps-4.5": isSecondCommentBoxLine,
                "h-[2.4rem] pe-40 ps-10": !isSecondCommentBoxLine,
              },
            )}
            placeholder="Leave your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleCommentKeyDown} // Backspace key event
            ref={textareaCommentRef}
            onInput={handleCommentSecondLineChange}
          />
          <span
            className={clsx("absolute start-2.5", {
              "bottom-0 my-2 flex items-end": isSecondCommentBoxLine,
              "inset-y-0 flex items-center": !isSecondCommentBoxLine,
            })}
          >
            <EmojiIcon
              className="cursor-pointer"
              onClick={() => {
                setShowEmojiSelector((val) => !val);
              }}
            />
          </span>
          {showEmojiSelector && (
            <div
              className={clsx("absolute start-2.5 top-10 z-10", {
                "top-30": isSecondCommentBoxLine,
              })}
            >
              <EmojisPicker onEmojiClick={onEmojiPick} />
            </div>
          )}
          <span
            className={clsx("absolute end-1 gap-2", {
              "bottom-0 my-2 flex items-end": isSecondCommentBoxLine,
              "inset-y-0 flex items-center": !isSecondCommentBoxLine,
            })}
          >
            <button
              className="action-button z-1 rounded bg-gray-9 px-2 py-1 text-sm text-black"
              onClick={handleCancelComment}
            >
              Cancel
            </button>
            {commentText.trim().length > 0 ? (
              <button
                className="action-button z-1 rounded bg-primary px-2 py-1 text-sm text-white"
                onClick={() =>
                  handleReplySave(
                    comment?.comment_id,
                    comment?.user_id,
                    commentText,
                  )
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
      ) : null}

      <div className="mb-3 ms-14 mt-3">
        {repliesList[comment?.comment_id]?.map((item: ReplyDataType) => (
          <Reply
            key={item?.comment_id}
            reply={item}
            handleCommunityCommentReply={handleCommunityCommentReply}
            handleSetCurrentReplyPageOne={handleSetCurrentReplyPageOne}
            likeCommentByIdPromise={likeCommentByIdPromise}
            handleReportComment={handleReportComment}
          />
        ))}
        {currentReplyPage > 0 && (
          <>
            {hasMoreReplies[comment?.comment_id] && (
              <button
                onClick={() => handleShowMoreReplies(comment?.comment_id)}
                className="font-light underline"
              >
                View more replies
              </button>
            )}
          </>
        )}
        {currentReplyPage === 0 && comment?.replies?.count > 0 && (
          <button
            onClick={() => handleShowMoreReplies(comment?.comment_id)}
            className="font-light underline"
          >
            View {comment?.replies?.count} replies
          </button>
        )}
      </div>

      {/* REPORT A PARTICULAR COMMENT */}

      <ReportForumUI
        open={openReportComment}
        handleClose={handleCloseReportComment}
        handleReport={handleReportComment}
        id={comment?.comment_id}
      />
    </div>
  );
};

export default Comments;
