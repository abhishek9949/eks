import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  IconButton,
  Skeleton,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { ExpandMoreOutlined, MoreVert } from "@mui/icons-material";
import {
  IndividualAccordionDetailsProps,
  IndividualAccordionInitialValues,
  IndividualAccordionProps,
} from "@/types/chats";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import GroupMoreActions from "./GroupMoreActions";
import { CustomTooltip } from "@/components/common/Tooltip";
import {
  getNameAndIdBasedOnType,
} from "@/utils/chatsReusableFunctions";
import clsx from "clsx";
import ChatIconComponent from "./ChatIconComponent";

const CustomAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  marginTop: "10px",
  backgroundColor: "rgba(239, 248, 253, 0.60)",
  maxHeight: "12.25rem",
  overflow: "hidden",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const CustomAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary expandIcon={<ExpandMoreOutlined />} {...props} />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const IndividualAccordion = ({
  title,
  details,
  type,
  handleClearGroupChat,
  handleDeleteGroup,
  userId,
  isGlobalChatHistoryLoading,
  toggleSidebar
}: IndividualAccordionProps) => {
  const [openGroupMoreActions, setOpenGroupMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const [currentRow, setCurrentRow] = useState<IndividualAccordionDetailsProps>(
    IndividualAccordionInitialValues,
  );

  const handleOpenGroupMoreActions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: IndividualAccordionDetailsProps,
  ) => {
    setOpenGroupMoreActions(event?.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseGroupMoreActions = () => {
    setOpenGroupMoreActions(null);
    setCurrentRow(IndividualAccordionInitialValues);
  };

  return (
    <>
      {isGlobalChatHistoryLoading ? (
        <Skeleton
          variant="rectangular"
          className="m-2 min-h-[calc(12.25rem-5rem)] w-full"
          data-testid="accordion-skeleton"
        />
      ) : (
        <CustomAccordion defaultExpanded className="!p-2 !shadow-none">
          <CustomAccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p className="px-3 text-xl font-semibold">{title}</p>
          </CustomAccordionSummary>
          <div className="flex max-h-[calc(12.25rem-5rem)] flex-col overflow-y-auto overflow-x-hidden">
            {details?.map((detail: IndividualAccordionDetailsProps) => {
              const { name, id } = getNameAndIdBasedOnType(
                type,
                detail,
                userId,
              );
              const obj =
                userId === detail?.sender?.user_id
                  ? detail?.recipient
                  : detail?.sender;
              return (
                <CustomAccordionDetails
                  key={detail?.updated_at}
                  className="flex items-center gap-3 !py-1"
                >
                  <div className="flex w-full justify-between items-center">
                    <div
                      className={clsx(
                        "flex items-center gap-3",
                        type === "group" ? "w-[80%]" : "w-full",
                      )}
                    >
                      <ChatIconComponent
                        type={type}
                        name={name}
                        src={obj?.profile_image}
                        width={24}
                        isAccordion
                      />
                      <Link
                        href={`${URL_CONSTANTS.CHATS}?title=${name}&messageType=${type}&id=${id}`}
                        className={clsx(
                          "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-normal text-gray-17",
                          detail?.unread_count > 0 && "!font-extrabold",
                        )}
                        data-testid="accordion-link"
                        onClick={toggleSidebar}
                      >
                        <CustomTooltip title={name}>
                          <span>{name}</span>
                        </CustomTooltip>
                      </Link>
                    </div>
                    {detail?.unread_count > 0 && (
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-17" />
                    )}
                    {type === "group" && (
                      <>
                        <IconButton
                          id={`group-action-button-${obj?.user_id}`}
                          aria-controls={
                            openGroupMoreActions ? "basic-menu" : undefined
                          }
                          aria-expanded={
                            openGroupMoreActions ? "true" : undefined
                          }
                          aria-haspopup="true"
                          onClick={(event) =>
                            handleOpenGroupMoreActions(event, detail)
                          }
                          aria-label="group action button"
                          className="!p-0"
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                        <GroupMoreActions
                          openGroupMoreActions={openGroupMoreActions}
                          handleCloseGroupMoreActions={
                            handleCloseGroupMoreActions
                          }
                          handleClearGroupChat={handleClearGroupChat}
                          currentRow={currentRow}
                          userId={userId}
                          handleDeleteGroup={handleDeleteGroup}
                        />
                      </>
                    )}
                  </div>
                </CustomAccordionDetails>
              );
            })}
          </div>
        </CustomAccordion>
      )}
    </>
  );
};

export default IndividualAccordion;
