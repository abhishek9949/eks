"use client";

import React, { useState, useRef, useEffect } from "react";
import { ContentTypeNames } from "@/constants/contentTypets";
import clsx from "clsx";
import style from "./SearchForm.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useDebounce from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import { CloseOutlined } from "@mui/icons-material";

const SearchForm = () => {
  const searchParams = useSearchParams();
  const urlSearchValue = searchParams.get("search") ?? "";
  const contentTypeSearchValue = searchParams.get("contentType");
  const defaultSelectedOptions = contentTypeSearchValue ? JSON.parse(contentTypeSearchValue) : ["All"]
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelectedOptions); // Explicitly typed
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState<string>(urlSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { updateSearchParams } = useUpdateSearchParams();

  const handleCheckboxChange = (name: string) => {
    let newOptions: string[];
    if (name === "All") {
      newOptions = ["All"];
    } else {
      newOptions = selectedOptions.includes(name)
        ? selectedOptions.filter((option) => option !== name)
        : [...selectedOptions.filter((option) => option !== "All"), name];

      if (newOptions.length === 0) {
        newOptions = ["All"];
      }
    }
    setSelectedOptions(newOptions);
    updateSearchParams({
      contentType: newOptions.includes("All") ? null : newOptions,
    });
    toggleDropdown();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchValue) {
      updateSearchParams({ search: debouncedSearchValue });
    } else {
      updateSearchParams({ search: null });
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (searchParams) {
      setSearchValue(urlSearchValue);
      setSelectedOptions(defaultSelectedOptions);
    }
  }, [searchParams]);

  const handleClearSearch = () => {
    setSearchValue("");
  }

  return (
    <li className={clsx(style.searchBar, "relative flex")}>
      <form action="#" method="POST" className="w-full ">
        {/* Search Box Container */}
        <div className="flex h-12 items-center rounded-lg border border-gray-1 bg-white">
          <button className="absolute top-1/2 ml-[6rem] hidden -translate-y-1/2 text-dark hover:text-primary lg:block">
            <SearchIcon className="text-gray-13" />
          </button>
          <input
            type="text"
            name="inline-add-on"
            className="mx-2.5 block w-full px-4 ps-20 lg:ps-29 text-black"
            onChange={(e) => setSearchValue(e?.target?.value)}
            value={searchValue}
          />
          {searchValue && (
            <CloseOutlined fontSize="medium" className="pr-2 cursor-pointer text-black"  onClick={handleClearSearch}/>
          )}
          <div
            className={clsx(
              "absolute inset-y-0 start-0 flex items-center ps-px text-gray-500",
              style.borderCheckbox,
            )}
          >
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex w-full items-center justify-between bg-white px-4 py-1.5 text-left text-sm"
              >
                <span>
                  {selectedOptions.length > 0 &&
                  !selectedOptions.includes("All")
                    ? `${selectedOptions.length} selected`
                    : "All"}
                </span>
                <span className="ml-2">
                  {isDropdownOpen ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-42.5 rounded-lg border border-gray-300 bg-white shadow-lg">
                  {ContentTypeNames.map((option) => (
                    <div key={option} className="flex items-center px-4 py-1.5">
                      <input
                        type="checkbox"
                        id={`checkbox-${option}`}
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="h-4 w-4 rounded border-gray-300 text-primary"
                      />
                      <label
                        htmlFor={`checkbox-${option}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </li>
  );
};

export default SearchForm;
