import React, { useEffect, useRef, useState } from "react";
import { getDateAndTimeFromTimestamp } from "@/utils/reusableFunctions";
import {
  DeleteOutline,
  EditOutlined,
  MoreVert,
  TurnLeftOutlined,
} from "@mui/icons-material";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import clsx from "clsx";
import StyledMenu from "@/components/common/StyledMenu";
import {
  IndividualMessageComponentProps,
  MessageEditComponentProps,
  ReplyOrNormalMessageComponentProps,
} from "@/types/chats";
import ModalDialog from "@/components/common/ModalDialog";
import CustomAvatar from "@/components/common/CustomAvatar";

const MessageEdit = ({
  updatedMessage,
  setUpdatedMessage,
  editMessageRef,
  setIsMessageEdit,
  message,
}: MessageEditComponentProps) => {
  return (
    <div className="ml-auto flex min-w-80 max-w-[50%] flex-col gap-3">
      <TextField
        value={updatedMessage}
        onChange={(e) => setUpdatedMessage(e.target.value)}
        multiline
        className="h-auto"
        autoFocus={true}
        ref={editMessageRef}
      />
      <div className="flex justify-end gap-3">
        <Button
          variant="outlined"
          color="secondary"
          className="rounded"
          onClick={() => setIsMessageEdit(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="rounded"
          disabled={message?.text === updatedMessage}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

const ReplyMessage = ({
  isSelf,
  message,
  individualMessageMoreActions,
  setIndividualMessageMoreActions,
  messageType,
}: ReplyOrNormalMessageComponentProps) => {
  const showName = messageType !== "private" && !isSelf;
  return (
    <div
      className={clsx(
        "flex min-w-48 md:min-w-80 max-w-[50%] gap-2",
        isSelf ? "ml-auto" : "mr-auto",
      )}
    >
      <div className={clsx(!message?.status && showName && "pt-5")}>
        <CustomAvatar
          key={message?.sender?.id}
          name={message?.sender?.name}
          width={46}
          height={46}
          randomColor
          src={message?.sender?.profile_image}
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        {showName && (
          <span className="pl-2 text-xs">{message?.sender?.name}</span>
        )}
        <div
          className="group relative w-full rounded-bl-lg rounded-br-lg rounded-tl-lg border border-neutral-200"
          key={message?.id}
          id={String(message?.id)}
        >
          <div className="bg-zinc-100 px-3 py-1.5">
            <p className="max-w-[90%] text-sm font-normal text-stone-950 break-normal">
              {message?.parent_message}
            </p>
          </div>
          <div className="px-3">
            <p className="text-sm font-normal text-stone-950 break-normal">
              {message?.text}
            </p>
            <p className="text-end text-[0.625rem] font-normal text-stone-500">
              {getDateAndTimeFromTimestamp(message?.timestamp)}
            </p>
          </div>
          <div className={clsx("absolute right-0 top-0 flex")}>
            <IconButton
              id="individual-message-more-actions"
              aria-controls={
                individualMessageMoreActions ? "basic-menu" : undefined
              }
              aria-expanded={individualMessageMoreActions ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) =>
                setIndividualMessageMoreActions(event?.currentTarget)
              }
              aria-label="individual message more actions"
              data-testid="individual-message-more-actions"
              className="!py-2"
            >
              <MoreVert className="!w-4 !h-4" />
            </IconButton>
          </div>
        </div>
        {message?.status && (
          <p
            className={clsx("ml-auto text-sm", message?.isError && "text-red")}
          >
            {message?.status}
          </p>
        )}
      </div>
    </div>
  );
};

const NormalMessage = ({
  isSelf,
  message,
  individualMessageMoreActions,
  setIndividualMessageMoreActions,
  messageType,
}: ReplyOrNormalMessageComponentProps) => {
  const showName = messageType !== "private" && !isSelf;
  return (
    <div
      className={clsx(
        "flex min-w-48 md:min-w-80 max-w-[50%] gap-2",
        isSelf ? "ml-auto" : "mr-auto",
      )}
    >
      {message?.isDeleted ? (
        <div
          className={clsx(
            "w-full px-3 py-2",
            isSelf ? "bg-zinc-100" : "border border-gray-200",
          )}
        >
          <p>This message is deleted</p>
        </div>
      ) : (
        <div
          className={clsx(
            "flex w-full gap-2",
            !message?.status && showName && "!items-center",
          )}
        >
          <CustomAvatar
            key={message?.sender?.id}
            name={message?.sender?.name}
            width={46}
            height={46}
            randomColor
            src={message?.sender?.profile_image}
          />
          <div className="flex w-full flex-col gap-1">
            {showName && (
              <span className="pl-2 text-xs">{message?.sender?.name}</span>
            )}
            <div
              className={clsx(
                "group relative w-full rounded-bl-lg rounded-br-lg rounded-tl-lg px-3 py-1.5",
                isSelf ? "bg-zinc-100" : "border border-gray-200",
              )}
              key={message?.id}
              id={String(message?.id)}
            >
              <p className="max-w-[90%] text-sm font-normal text-stone-950 break-normal">
                {message?.text}
              </p>
              <p className="text-end text-[0.625rem] font-normal text-stone-500">
                {getDateAndTimeFromTimestamp(message?.timestamp)}
              </p>
              <div
                className={clsx("absolute right-0 top-0 flex")}
                key={message?.id}
              >
                <IconButton
                  id="individual-message-more-actions"
                  aria-controls={
                    individualMessageMoreActions ? "basic-menu" : undefined
                  }
                  aria-expanded={
                    individualMessageMoreActions ? "true" : undefined
                  }
                  aria-haspopup="true"
                  onClick={(event) =>
                    setIndividualMessageMoreActions(event?.currentTarget)
                  }
                  aria-label="individual message more actions"
                  data-testid="individual-message-more-actions"
                  className="!py-2"
                >
                  <MoreVert className="!w-4 !h-4" />
                </IconButton>
              </div>
            </div>
            {message?.status && (
              <p
                className={clsx(
                  "ml-auto text-sm",
                  message?.isError && "text-red",
                )}
              >
                {message?.status}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const IndividualMessageComponent = ({
  message,
  userId,
  setIsReplyMessage,
  setSelectedMessage,
  handleDeleteMessage,
  messageType,
}: IndividualMessageComponentProps) => {
  const [individualMessageMoreActions, setIndividualMessageMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message?.text);
  const [isDeleteMessagePopupOpen, setIsDeleteMessagePopupOpen] =
    useState(false);
  const editMessageRef = useRef<HTMLInputElement | null>(null);

  const handleCloseIndividualMessageMoreActions = () => {
    setIndividualMessageMoreActions(null);
  };

  const isSelf = userId === Number(message?.sender?.id);

  const handleOnClickEditMessage = () => {
    setIsMessageEdit(true);
    handleCloseIndividualMessageMoreActions();
  };

  const toggleDeleteMessagePopup = () => {
    handleCloseIndividualMessageMoreActions();
    setIsDeleteMessagePopupOpen(!isDeleteMessagePopupOpen);
  };

  const handleConfirmDeleteMessage = () => {
    toggleDeleteMessagePopup();
    handleDeleteMessage(message?.uniqueId);
  };

  useEffect(() => {
    if (isMessageEdit) {
      setTimeout(() => {
        editMessageRef?.current?.focus();
      }, 100);
    }
  }, [isMessageEdit]);

  const handleOnReplyMessage = () => {
    handleCloseIndividualMessageMoreActions();
    setIsReplyMessage(true);
    setSelectedMessage(message);
  };

  return (
    <>
      <div className="flex">
        {isMessageEdit ? (
          <MessageEdit
            updatedMessage={updatedMessage}
            setUpdatedMessage={setUpdatedMessage}
            editMessageRef={editMessageRef}
            setIsMessageEdit={setIsMessageEdit}
            message={message}
          />
        ) : (
          <>
            {message?.parent_id && message?.parent_message ? (
              <ReplyMessage
                isSelf={isSelf}
                message={message}
                individualMessageMoreActions={individualMessageMoreActions}
                setIndividualMessageMoreActions={
                  setIndividualMessageMoreActions
                }
                messageType={messageType}
              />
            ) : (
              <NormalMessage
                isSelf={isSelf}
                message={message}
                individualMessageMoreActions={individualMessageMoreActions}
                setIndividualMessageMoreActions={
                  setIndividualMessageMoreActions
                }
                messageType={messageType}
              />
            )}
          </>
        )}
        <StyledMenu
          id="basic-menu"
          anchorEl={individualMessageMoreActions}
          open={Boolean(individualMessageMoreActions)}
          onClose={handleCloseIndividualMessageMoreActions}
          slotProps={{
            root: {
              "aria-labelledby": "individual-message-more-actions",
            },
          }}
          sx={{
            "& .MuiPaper-root": {
              boxShadow: "0px 0px 4px 4px rgba(0, 0, 0, 0.1)", // Custom box shadow
            },
          }}
        >
          <MenuItem onClick={handleOnReplyMessage}>
            <TurnLeftOutlined className="h-5 w-5" />
            <span className="text-xs font-normal text-neutral-700">Reply</span>
          </MenuItem>
          {isSelf && (
            <>
              <MenuItem onClick={handleOnClickEditMessage}>
                <EditOutlined className="h-5 w-5" />
                <span className="text-xs font-normal text-neutral-700">
                  Edit
                </span>
              </MenuItem>
              <MenuItem onClick={toggleDeleteMessagePopup}>
                <DeleteOutline className="h-5 w-5" />
                <span className="text-xs font-normal text-neutral-700">
                  Delete
                </span>
              </MenuItem>
            </>
          )}
        </StyledMenu>
      </div>
      <ModalDialog
        dialogTitle="Delete Message"
        dialogDescription="Are you sure you want to delete this message?"
        openDialog={isDeleteMessagePopupOpen}
        handleCloseDialog={toggleDeleteMessagePopup}
        handleConfirm={handleConfirmDeleteMessage}
      />
    </>
  );
};

export default IndividualMessageComponent;
