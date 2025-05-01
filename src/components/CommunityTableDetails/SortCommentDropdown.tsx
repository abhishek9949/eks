import { useState } from "react";
import ClickOutside from "@/components/common/ClickOutside";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const sortOptions = [
  { label: "All", value: "all" },
  { label: "Popular", value: "popular" },
  { label: "New", value: "new" },
  { label: "Oldest", value: "oldest" },
];
interface SortCommentDropdownPropsType {
  handleSortComment: (option: string) => void;
  sortComment: string;
}
const SortCommentDropdown = ({
  handleSortComment,
  sortComment,
}: SortCommentDropdownPropsType) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (option: string) => {
    handleSortComment(option);
    setDropdownOpen(false);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <div>
        <button
          className="flex h-12 w-max cursor-pointer items-center rounded-md border border-gray-300 px-0 md:w-full xl:px-1"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FilterListIcon className="text-black" />
          <span className="text-md hidden flex-1 text-black md:inline">
            {sortComment?.charAt(0).toUpperCase() + sortComment?.slice(1)}
          </span>
          <ArrowDropDownIcon className="text-black" />
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute end-0 z-10 mt-1 flex w-[6rem] flex-col rounded-lg border-[0.03rem] border-stroke bg-white shadow-default">
          {sortOptions.map((option) => (
            <div
              key={option.value}
              className="border-b-[0.03rem] border-stroke last:border-0"
            >
              <button
                className="w-full p-1.5 text-left text-sm text-dark duration-300 ease-in-out hover:bg-gray-2 lg:text-base"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </ClickOutside>
  );
};

export default SortCommentDropdown;
