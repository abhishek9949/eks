import React, { useRef, useState } from "react";
import Image from "next/image";
import Picker from "emoji-picker-react";
import clsx from "clsx";
import AddEmojiIcon from "@mui/icons-material/AddReactionOutlined";
import { timeDifference } from "@/utils/reusableFunctions";
import { useAppDispatch } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ReportForumUI from "@/components/CommunityTableDetails/ReportForumUI";
import {
  hideConfirmReport,
  hideOpenReport,
  showOpenReport,
} from "@/redux/slices/reportCommentSlice";
import { LikeCommentResType } from "@/types/reducer";
import { CustomTooltip } from "@/components/common/Tooltip";
import CustomAvatar from "@/components/common/CustomAvatar";


const Reply = ({
  reply,
  handleCommunityCommentReply,
  handleSetCurrentReplyPageOne,
  likeCommentByIdPromise,
  handleReportComment,
}: any) => {
  const dispatch = useAppDispatch();
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSecondLine, setIsSecondLine] = useState(false);

  // Like Comment Reply state
  const [newLikedCommentReply, setNewLikedCommentReply] = useState<
    boolean | null
  >(null);
  const [newLikeCountCommentReply, setNewLikeCountCommentReply] = useState<
    number | null
  >(null);
  const [loadingLikeCommentReply, setLoadingLikeCommentReply] = useState(false);

  // Report Reply State
  const [openReportCommentReply, setOpenReportCommentReply] = useState(false);

  const handleOpenReportCommentReply = () => {
    dispatch(showOpenReport());
    setOpenReportCommentReply(true);
  };

  const handleCloseReportCommentReply = () => {
    setOpenReportCommentReply(false);
    dispatch(hideOpenReport());
    dispatch(hideConfirmReport());
  };
  // Report Reply End

  const handleReply = () => {
    const replyPrefix = `@${reply.user_name} `;
    setReplyText(replyPrefix); // Insert the username at the start
    setShowReplyBox(true);

    // Set focus and move caret after the reply prefix
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          replyPrefix.length,
          replyPrefix.length,
        );
      }
    }, 0); // Timeout ensures the DOM update is complete before manipulating the textarea
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setReplyText((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleLikeReply = (commentId: number) => {
    setLoadingLikeCommentReply(true);
    likeCommentByIdPromise({
      endpoint: `${API_CONSTANTS.LIKE_COMMENT_BY_ID}/${commentId}/like/`,
      method: "POST",
    })
      .unwrap()
      .then((res: LikeCommentResType) => {
        setLoadingLikeCommentReply(false);
        setNewLikedCommentReply(res?.is_liked);
        setNewLikeCountCommentReply(res?.like_count);
      })
      .catch((err: LikeCommentResType) => {
        setLoadingLikeCommentReply(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error liking the reply",
            severity: "error",
          }),
        );
      });
  };

  const handleCancelComment = () => {
    setReplyText("");
    setShowReplyBox(false);
    setShowPicker(false);
    setIsSecondLine(false);
  };

  const handleReplySave = (
    commentId: number,
    replyingId: number,
    replyText: string,
  ) => {
    handleCommunityCommentReply(commentId, replyingId, replyText);
    handleSetCurrentReplyPageOne();
    setShowReplyBox(false);
    setReplyText("");
    setShowPicker(false);
    setIsSecondLine(false);
  };

  // Handle backspace to remove the whole username
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && replyText === `@${reply.user_name} `) {
      setReplyText(""); // Clear the entire username when backspace is pressed at the beginning
    }
  };

  const handleInputSecondLineChange = () => {
    const textarea = textareaRef.current;

    if (!textarea) return; // Ensure textarea is not null

    // Get the height of a single line of text
    const lineHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10,
    );

    // Calculate the number of lines based on the scrollHeight and lineHeight
    const numberOfLines = Math.floor(textarea.scrollHeight / lineHeight);

    // Check if the number of lines exceeds 1
    setIsSecondLine(numberOfLines > 1);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center">
        <div className="me-[0.8rem]">
          <CustomAvatar width={35} height={35} name={reply?.user_name}  randomColor />
        </div>
        <div className="text-md me-[0.32rem] text-black">
          {reply?.user_name}
        </div>
        <div>
          <span className="text-sm text-gray-500">•</span>
          <span className="ms-[0.32rem] text-sm text-gray-500">
            {timeDifference(reply?.created_at)}
          </span>
        </div>
      </div>
      <div className="ms-14 text-base font-light text-black">
        <span className="rounded bg-blue-light-6 px-[0.3rem] pb-[0.15rem] pt-[0.25rem] font-semibold text-primary">
          {reply?.content.split(" ")[0] === `@${reply?.reply_to}`
            ? reply?.content.split(" ")[0]?.replace(/^@/, "")
            : reply?.reply_to}
        </span>{" "}
        {reply?.content.split(" ")[0] === `@${reply?.reply_to}`
          ? reply?.content.split(" ").slice(1).join(" ")
          : reply?.content}
      </div>
      <div className="ms-14">
        <div className="flex gap-2">
          <button
            className="flex cursor-pointer items-center justify-center gap-1"
            onClick={() => handleLikeReply(reply?.comment_id)}
            disabled={loadingLikeCommentReply}
          >
            {loadingLikeCommentReply ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
            ) : (
              <>
                {newLikedCommentReply === true ||
                newLikedCommentReply === false ? (
                  <>
                    {newLikedCommentReply ? (
                      <ThumbUpAltIcon color="primary" />
                    ) : (
                      <ThumbUpAltOutlinedIcon />
                    )}
                  </>
                ) : (
                  <>
                    {reply?.is_liked ? (
                      <ThumbUpAltIcon color="primary" />
                    ) : (
                      <ThumbUpAltOutlinedIcon />
                    )}
                  </>
                )}
              </>
            )}
            <span className="font-light text-black text-black">
              {newLikeCountCommentReply ?? reply?.like_count}
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
              onClick={handleOpenReportCommentReply}
            >
              <ReportOutlinedIcon className="text-red-3" />
            </button>
          </CustomTooltip>
        </div>
      </div>
      {showReplyBox ? (
        <div className="relative ms-14 w-[calc(100%-3.5rem)] rounded-md border border-gray-1 xl:w-1/2">
          <textarea
            className={clsx(
              "w-full resize-none overflow-hidden pt-[0.7rem] placeholder-gray-400 outline-none",
              {
                "mb-7.5 h-[5rem] pe-4.5 ps-4.5": isSecondLine,
                "h-[2.4rem] pe-40 ps-10": !isSecondLine,
              },
            )}
            placeholder="Leave your comment"
            value={replyText}
            // ref={inputRef}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={textareaRef}
            onInput={handleInputSecondLineChange}
          />
          <span
            className={clsx("absolute start-2.5", {
              "bottom-0 my-2 flex items-end": isSecondLine,
              "inset-y-0 flex items-center": !isSecondLine,
            })}
          >
            <AddEmojiIcon
              className="cursor-pointer"
              onClick={() => {
                setShowPicker((val) => !val);
              }}
            />
          </span>
          {showPicker && (
            <div
              className={clsx("absolute start-2.5 top-10 z-10", {
                "top-30": isSecondLine,
              })}
            >
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <span
            className={clsx("absolute end-1 gap-2", {
              "bottom-0 my-2 flex items-end": isSecondLine,
              "inset-y-0 flex items-center": !isSecondLine,
            })}
          >
            <button
              className="action-button z-1 rounded bg-gray-9 px-2 py-1 text-sm text-black"
              onClick={handleCancelComment}
            >
              Cancel
            </button>
            {replyText.trim().length > 0 ? (
              <button
                className="action-button z-1 rounded bg-primary px-2 py-1 text-sm text-white"
                onClick={() =>
                  handleReplySave(
                    reply?.parent_comment,
                    reply?.user_id,
                    replyText,
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

      {/* REPORT A PARTICULAR REPLY */}

      <ReportForumUI
        open={openReportCommentReply}
        handleClose={handleCloseReportCommentReply}
        handleReport={handleReportComment}
        id={reply?.comment_id}
      />
    </div>
  );
};

export default Reply;
