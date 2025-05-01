import React, { useState } from "react";
import { FilterConstants } from "@/constants/chats";
import { CheckCircle, RadioButtonUncheckedOutlined } from "@mui/icons-material";
import { Button, Radio } from "@mui/material";
import { ChatFilterProps } from "@/types/chats";

const ChatFilter = ({ handleCloseFilter }: ChatFilterProps) => {
  const [allActivityFilter, setAllActivityFilter] = useState("");

  return (
    <div className="fixed left-[70%] z-99 ml-1 flex w-[13.4375rem] flex-col gap-5 bg-white p-4 shadow-newChatModal">
      <div className="flex flex-col gap-3">
        <p className="text-base font-medium leading-tight text-neutral-700">
          All activity
        </p>
        <div className="flex flex-col gap-3">
          {FilterConstants?.allActivity?.map((allFilter) => (
            <div className="flex items-center gap-2" key={allFilter?.id}>
              <Radio
                checked={allActivityFilter === allFilter?.title}
                onChange={() => setAllActivityFilter(allFilter?.title)}
                value={allFilter?.title}
                color="primary"
                className="!p-0"
                icon={<RadioButtonUncheckedOutlined className="!h-6 !w-6" />}
                checkedIcon={<CheckCircle className="!h-6 !w-6" />}
                id={allFilter?.title}
              />
              <label
                id={`label-${allFilter?.id}`}
                htmlFor={allFilter?.title}
                className="!whitespace-nowrap !text-sm !font-normal !leading-none !text-neutral-700"
              >
                {allFilter?.title}
              </label>
            </div>
          ))}
        </div>
        <div className="mx-auto flex gap-2 pt-3 text-sm font-medium leading-normal">
          <Button
            variant="outlined"
            color="secondary"
            className="h-[2.125rem] bg-white text-gray-700"
            onClick={handleCloseFilter}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" className="h-[2.125rem]">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatFilter;
