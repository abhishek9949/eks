import React, { useState, useRef, useEffect } from "react";
import CommunityTableSmallCard from "./CommunityTableCards/CommunityTableSmallCard";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import Draggable, {
  DraggableRef,
} from "@/components/ResourceAndResearch/Draggable";
import clsx from "clsx";
import { IndividualCommunityProps } from "@/types/community/CommunityDetails";
import CommunityTableSmallCardSkeleton from "./CommunityTableCards/CommunityTableSmallCardSkeleton";

/**
 * I have to work on this file in this sprint
 * For now adding any Type
 */

const IndividualCommunity = ({
  communityData,
  title,
  notScrollable,
  isArrowsVisbale = true,
  isLoadingRelatedData,
}: IndividualCommunityProps) => {
  const [disablePrev, setDisablePrev] = useState<boolean>(true);
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const [maxItems, setMaxItems] = useState<number>(3);
  const draggableRef = useRef<DraggableRef>(null);

  useEffect(() => {
    const updateMaxItems = () => {
      if (window.matchMedia("(max-width: 399px)").matches) {
        setMaxItems(1);
      } else if (
        window.matchMedia("(min-width: 399px) and (max-width: 1109.98px)")
          .matches
      ) {
        setMaxItems(2);
      } else {
        setMaxItems(3);
      }
    };

    updateMaxItems();
    window.addEventListener("resize", updateMaxItems);
    return () => window.removeEventListener("resize", updateMaxItems);
  }, []);

  const handleChevronClick = (direction: string) => {
    if (draggableRef.current) {
      draggableRef.current.scroll(direction);
    }
  };

  const handleScrollChange = (isAtStart: boolean, isAtEnd: boolean) => {
    setDisablePrev(isAtStart);
    setDisableNext(isAtEnd);
  };

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <p className="text-2xl text-black">{title}</p>
        </div>
        {isArrowsVisbale && communityData?.length > maxItems && (
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2",
                disablePrev ? "border-gray-11" : "border-primary",
              )}
            >
              <ChevronLeftOutlined
                onClick={() => handleChevronClick("left")}
                className="h-6 w-6"
                color={disablePrev ? "disabled" : "primary"}
              />
            </div>
            <div
              className={clsx(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2",
                disableNext ? "border-gray-11" : "border-primary",
              )}
            >
              <ChevronRightOutlined
                onClick={() => handleChevronClick("right")}
                className="h-6 w-6"
                color={disableNext ? "disabled" : "primary"}
              />
            </div>
          </div>
        )}
      </div>

      {isLoadingRelatedData ? (
        <div className="flex gap-4">
          {[...Array(3)]?.map((_, index) => (
            <CommunityTableSmallCardSkeleton key={index + 1} />
          ))}
        </div>
      ) : (
        <>
          {communityData?.length === 0 ? (
            <div className="text-center">
              {"No Related topic’s for this Community"}
            </div>
          ) : (
            <>
              {" "}
              {notScrollable ||
              !communityData?.length ||
              communityData?.length <= maxItems ? (
                <div className="grid grid-cols-12 gap-4 overflow-visible md:gap-6 2xl:gap-7.5">
                  {communityData?.map((item) => (
                    <div
                      className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4"
                      key={item?.forum_id}
                    >
                      <CommunityTableSmallCard
                        id={item?.forum_id}
                        title={item?.topic_title}
                        desc={item?.topic_description}
                        tags={item?.categories}
                        timeAgo={item?.created_at}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Draggable
                  ref={draggableRef}
                  rootClass={"drag"}
                  onScrollChange={handleScrollChange}
                >
                  {communityData?.map((item) => (
                    <div key={item?.forum_id}>
                      <CommunityTableSmallCard
                        id={item?.forum_id}
                        title={item?.topic_title}
                        desc={item?.topic_description}
                        tags={item?.categories}
                        timeAgo={item?.created_at}
                      />
                    </div>
                  ))}
                </Draggable>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IndividualCommunity;
