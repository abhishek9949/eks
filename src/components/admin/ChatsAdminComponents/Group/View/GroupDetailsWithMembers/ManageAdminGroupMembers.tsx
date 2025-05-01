"use client";
import React, { useEffect, useState } from "react";
import {
  IndividualGroupMemberData,
  ManageMembersProps,
  RemoveMembersFromGroupDataProps,
} from "@/types/chats";
import {
  Button as MemberButton,
  Checkbox as MemberCheckbox,
  InputAdornment as MemberInputAdornment,
  Skeleton as MemberSkeleton,
  Table as MemberTable,
  TableBody as MemberTableBody,
  TableCell as MemberTableCell,
  TableContainer as MemberTableContainer,
  TableHead as MemberTableHead,
  TableRow as MemberTableRow,
  TextField as MemberTextField,
  Paper,
} from "@mui/material";
import {
  Add as MemberAdd,
  Close as MemberClose,
  Search as MemberSearch,
} from "@mui/icons-material";
import { Column } from "@/types/table";
import ModalDialog from "@/components/common/ModalDialog";
import { useAppSelector } from "@/redux/hooks";
import useDebounce from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import clsx from "clsx";
import AddMemberToGroupPopup from "@/components/Chats/AddMemberToGroupPopup";

const ManageAdminGroupMembers = ({
  title,
  membersData,
  isLoading,
  handleAddOrRemoveMembersFromGroup,
  createdBy,
}: ManageMembersProps) => {
  const [memberSearchText, setMemberSearchText] = useState("");
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isRemoveMembersPopupOpen, setIsRemoveMembersPopupOpen] =
    useState(false);
  const userId =
    useAppSelector((state) => state.cookies.cookies.userCookies?.user_id) ?? 0;
  const isGroupAdmin = userId === Number(createdBy);
  const debouncedSearchText = useDebounce(memberSearchText, 500);
  const { updateSearchParams } = useUpdateSearchParams();
  const isRemoveButtonDisabled = selectedMembers?.length === 0 || !isGroupAdmin;

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
            <MemberCheckbox
              checked={selectedMembers.includes(value)}
              color="primary"
              onChange={() => handleOnSelectMember(value)}
              sx={{
                "& .MuiCheckbox-input": {
                  "aria-label": "select content",
                },
              }}
              disabled={!isGroupAdmin}
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

  return (
    <div className="px-4 py-8">
      <Paper className="relative w-full overflow-hidden rounded-br rounded-tr">
        <div className="sticky top-0 flex h-[4.375rem] w-full items-center gap-2 px-5 shadow-newgroupbutton">
          <p className="text-lg font-medium leading-normal text-neutral-900 ">
            {title}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <p className="text-2xl font-normal text-neutral-700">
            Members : {membersData?.total_members}
          </p>
          <div className="grid grid-cols-12 gap-3">
            <MemberTextField
              className="col-span-8 rounded"
              placeholder="Search members"
              value={memberSearchText}
              onChange={(e) => setMemberSearchText(e?.target?.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <MemberInputAdornment position="start">
                      <MemberSearch />
                    </MemberInputAdornment>
                  ),
                  endAdornment: memberSearchText ? (
                    <MemberInputAdornment position="end">
                      <MemberClose
                        className="cursor-pointer"
                        onClick={() => setMemberSearchText("")}
                        fontSize="small"
                      />
                    </MemberInputAdornment>
                  ) : null,
                },
              }}
            />
            <MemberButton
              className="col-span-2 flex gap-1 rounded"
              variant="outlined"
              color="secondary"
              onClick={toggleAddMemberPopup}
              disableRipple
              disabled={!isGroupAdmin}
            >
              <MemberAdd className="h-5 w-5 text-primary" />
              <span className="text-lg font-normal text-primary">Add</span>
            </MemberButton>
            <MemberButton
              className={clsx(
                "col-span-2 flex gap-1 rounded",
                isRemoveButtonDisabled && "bg-gray-10 opacity-50",
              )}
              variant="outlined"
              color="secondary"
              onClick={() => setIsRemoveMembersPopupOpen(true)}
              disableRipple
              disabled={isRemoveButtonDisabled}
            >
              <span
                className={clsx(
                  "text-lg font-normal text-primary",
                  isRemoveButtonDisabled && "!text-black",
                )}
              >
                Remove
              </span>
            </MemberButton>
          </div>
          <MemberTableContainer>
            <MemberTable>
              <MemberTableHead className="bg-blue-light-6">
                <MemberTableRow>
                  {columns?.map((column) => (
                    <MemberTableCell
                      key={column.field}
                      align={column.align || "left"}
                    >
                      <b>{column.label}</b>
                    </MemberTableCell>
                  ))}
                </MemberTableRow>
              </MemberTableHead>
              <MemberTableBody>
                {isLoading ? (
                  <MemberTableRow>
                    {columns.map((column) => (
                      <MemberTableCell key={column.field}>
                        <MemberSkeleton
                          variant="text"
                          width="80%"
                          height={24}
                        />
                      </MemberTableCell>
                    ))}
                  </MemberTableRow>
                ) : (
                  (() => {
                    if (membersData?.data?.results?.length === 0) {
                      return (
                        <MemberTableRow>
                          <MemberTableCell
                            colSpan={columns.length}
                            align="center"
                          >
                            <b>No data available</b>
                          </MemberTableCell>
                        </MemberTableRow>
                      );
                    }

                    return membersData?.data?.results?.map((row, rowIndex) => (
                      <MemberTableRow key={rowIndex + 1} hover>
                        {columns.map((column) => (
                          <MemberTableCell
                            key={column.field}
                            align={column.align || "left"}
                          >
                            {column.render
                              ? column.render(
                                  row[
                                    column.field as keyof IndividualGroupMemberData
                                  ],
                                  row,
                                )
                              : row[
                                  column.field as keyof IndividualGroupMemberData
                                ]}
                          </MemberTableCell>
                        ))}
                      </MemberTableRow>
                    ));
                  })()
                )}
              </MemberTableBody>
            </MemberTable>
          </MemberTableContainer>
        </div>
      </Paper>
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

export default ManageAdminGroupMembers;
