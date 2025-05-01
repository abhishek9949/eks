"use client";
import React, { useEffect, useState } from "react";
import {
  ManageMembersProps,
  RemoveMembersFromGroupDataProps,
} from "@/types/chats";
import {
  Button,
  Checkbox,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Add,
  Close,
  KeyboardBackspaceOutlined,
  Search,
} from "@mui/icons-material";
import { Column } from "@/types/table";
import AddMemberToGroupPopup from "./AddMemberToGroupPopup";
import ModalDialog from "@/components/common/ModalDialog";
import useDebounce from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CommonTableComponent } from "@/components/common/DynamicImports";

const ManageMembers = ({
  title,
  membersData,
  isLoading,
  handleAddOrRemoveMembersFromGroup,
  createdBy,
  page,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  userId
}: ManageMembersProps) => {
  const [memberSearchText, setMemberSearchText] = useState("");
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isRemoveMembersPopupOpen, setIsRemoveMembersPopupOpen] =
    useState(false);
  
  const isGroupAdmin = userId === Number(createdBy);
  const debouncedSearchText = useDebounce(memberSearchText, 500);
  const { updateSearchParams } = useUpdateSearchParams();
  const isRemoveButtonDisabled = selectedMembers?.length === 0 || !isGroupAdmin;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnSelectMember = (value: number) => {
    setSelectedMembers((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleRemoveMembersPopup = () => {
    setIsRemoveMembersPopupOpen(!isRemoveMembersPopupOpen);
  };

  const handleConfirmRemoveMembers = () => {
    const data: RemoveMembersFromGroupDataProps = {
      remove_members: selectedMembers,
    };
    handleAddOrRemoveMembersFromGroup("DELETE", data);
    setSelectedMembers([]);
    toggleRemoveMembersPopup();
  };

  const columns: Column[] = [
    {
      field: "user_id",
      label: "",
      align: "left",
      render: (value: any, row) => {
        if (row?.role === "owner") {
          return <></>;
        }
        return (
          <span>
            <Checkbox
              checked={selectedMembers.includes(value)} // Ensure checkbox is checked based on state
              color="primary"
              onChange={() => handleOnSelectMember(value)}
              sx={{
                "& .MuiCheckbox-input": {
                  "aria-label": "select content",
                },
              }}
              disabled={!isGroupAdmin}
              data-testid="member-checkbox"
            />
          </span>
        );
      },
    },
    { field: "user_name", label: "Name", align: "left" },
    { field: "email", label: "Email", align: "left" },
    { field: "role", label: "Role", align: "left" },
  ];

  const toggleAddMemberPopup = () => {
    setIsAddMemberPopupOpen(!isAddMemberPopupOpen);
  };

  useEffect(() => {
    updateSearchParams({ search: debouncedSearchText });
  }, [debouncedSearchText, updateSearchParams]);

  const handleBack = () => {
    router.replace(`${URL_CONSTANTS.CHATS}?${searchParams?.toString()}`);
  };

  return (
    <div className="flex flex-1 flex-col px-4 py-8">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-br rounded-tr shadow-newgroupbutton outline-1 outline-gray">
        <div className="sticky top-0 flex h-[4.375rem] w-full items-center gap-2 px-5 shadow-newgroupbutton">
          <KeyboardBackspaceOutlined
            onClick={handleBack}
            className="cursor-pointer"
          />
          <p className="text-lg font-medium leading-normal text-neutral-900 ">
            {title}
          </p>
        </div>
        <div className="no-scrollbar flex h-full flex-col gap-2 p-4">
          <p className="text-2xl font-normal text-neutral-700">Members</p>
          <p className="text-sm text-slate-700">{membersData?.total_members}</p>
          <div className="grid grid-cols-12 gap-3">
            <TextField
              className="col-span-8 rounded"
              placeholder="Search members"
              value={memberSearchText}
              onChange={(e) => setMemberSearchText(e?.target?.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: memberSearchText ? (
                    <InputAdornment position="end">
                      <Close
                        className="cursor-pointer"
                        onClick={() => setMemberSearchText("")}
                        fontSize="small"
                        data-testid="search-clear-button"
                      />
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
            <Button
              className={clsx(
                "col-span-2 flex gap-1 rounded",
                !isGroupAdmin && "bg-gray-10 opacity-50",
              )}
              variant="outlined"
              color="secondary"
              onClick={toggleAddMemberPopup}
              disableRipple
              disabled={!isGroupAdmin}
              data-testid="add-member-button"
            >
              <Add
                className={clsx(
                  "h-5 w-5 text-primary",
                  !isGroupAdmin && "!text-black",
                )}
              />
              <span
                className={clsx(
                  "text-lg font-normal text-primary",
                  !isGroupAdmin && "!text-black",
                )}
              >
                Add
              </span>
            </Button>
            <Button
              className={clsx(
                "col-span-2 flex gap-1 rounded",
                isRemoveButtonDisabled && "bg-gray-10 opacity-50",
              )}
              variant="outlined"
              color="secondary"
              onClick={() => setIsRemoveMembersPopupOpen(true)}
              disableRipple
              disabled={isRemoveButtonDisabled}
              data-testid="remove-member-button"
            >
              <span
                className={clsx(
                  "text-lg font-normal text-primary",
                  isRemoveButtonDisabled && "!text-black",
                )}
              >
                Remove
              </span>
            </Button>
          </div>
          <CommonTableComponent
            columns={columns}
            data={membersData?.data?.results ?? []}
            rowsPerPage={rowsPerPage}
            page={page}
            totalRows={membersData?.data?.count ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            enableSelection={false}
            loading={isLoading}
          />
        </div>
      </div>
      {isAddMemberPopupOpen && (
        <AddMemberToGroupPopup
          isAddMemberPopupOpen={isAddMemberPopupOpen}
          handleCloseAddMemberPopup={toggleAddMemberPopup}
          handleAddMembersToGroup={handleAddOrRemoveMembersFromGroup}
        />
      )}
      <ModalDialog
        dialogTitle="Remove Members from Group"
        dialogDescription="Are you sure you want to remove the selected members from this group?"
        openDialog={isRemoveMembersPopupOpen}
        handleCloseDialog={toggleRemoveMembersPopup}
        handleConfirm={handleConfirmRemoveMembers}
      />
    </div>
  );
};

export default ManageMembers;
