"use client";

import React, { useState } from "react";
import SingleBin from "@/components/BinComponents/CommonBinComponent/SingleBin.tsx/SingleBin";
import BinTable from "@/components/BinComponents/CommonBinComponent/BinTable/BinTable";
import dateFormat from "@/utils/dateFormat";
import BinLogo from "@/components/common/BinLogo";
import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SingleBinMenu from "@/components/BinComponents/CommonBinComponent/SingleBin.tsx/SingleBinMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Column } from "@/types/table";
import { GetBinsData, MyBinsComponentPropType } from "@/types/bins/binsType";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomAvatar from "@/components/common/CustomAvatar";
import { capitalizeWords } from "@/utils/reusableFunctions";

const BinsListingComponent = (props: MyBinsComponentPropType) => {
  const {
    myBinsData,
    isBinDataLoading,
    initialLoading,
    alignment,
    handleUpdateBin,
    handleDeleteBin,
    handleShareBin,
    handleSortChange,
    sortColumn,
    sortDirection,
  } = props;
  const pathname = usePathname();
  const hasRecents = pathname.includes("/recents");
  const [openBinActionMenu, setOpenBinActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentBinRow, setCurrentBinRow] = useState<GetBinsData | null>(null);

  const handleOpenBinActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: GetBinsData,
  ) => {
    setOpenBinActionMenu(event.currentTarget);
    setCurrentBinRow(row);
  };
  const handleCloseBinActionMenu = () => {
    setOpenBinActionMenu(null);
    setCurrentBinRow(null);
  };

  const columns: Column[] = [
    {
      field: "bin_name",
      label: "Name",
      align: "left",
      isSortable: true,
      render: (value: string, row) => (
        <Link
          href={
            hasRecents
              ? `/bins/recents/${row?.bin_id}`
              : `/bins/mybin/${row?.bin_id}`
          }
        >
          <div className="flex items-center gap-2 text-lg font-medium text-[#272833]">
            <div className="h-[34px] w-[34px]">
              <BinLogo color={row?.bin_color} />
            </div>
            <div>{row?.bin_name}</div>
          </div>
        </Link>
      ),
    },
    {
      field: "created_by",
      label: "Owner",
      align: "left",
      width: "200px",
      render: (value: string, row) => (
        <div className="flex items-center gap-2 text-lg font-medium text-[#6b6c7e]">
          {row?.created_by?.profile_image ? (
            <CustomAvatar
              width={35}
              height={35}
              src={row?.created_by?.profile_image}
            />
          ) : null}
          {!row?.created_by?.profile_image && (
            <CustomAvatar
              width={35}
              height={35}
              icon={<PersonIcon className="!text-white" />}
            />
          )}
          {capitalizeWords(
            `${row?.created_by?.first_name} ${row?.created_by?.last_name}`,
          )}
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Last Modified",
      align: "left",
      width: "150px",
      isSortable: true,
      render: (value: string) => (
        <div className="text-lg font-medium text-[#6b6c7e]">
          {dateFormat(value)}
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      width: "100px",
      render: (value, row) => (
        <div>
          <IconButton
            id={`bin-action-long-button-${currentBinRow?.bin_id}`}
            aria-controls={openBinActionMenu ? "basic-menu" : undefined}
            onClick={(event) => handleOpenBinActionMenu(event, row)}
            disableTouchRipple
          >
            <MoreVertIcon />
          </IconButton>
          {currentBinRow && (
            <SingleBinMenu
              openBinActionMenu={openBinActionMenu}
              handleCloseBinActionMenu={handleCloseBinActionMenu}
              singleBinData={currentBinRow}
              handleUpdateBin={handleUpdateBin}
              handleDeleteBin={handleDeleteBin}
              handleShareBin={handleShareBin}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {alignment === "grid" && (
        <>
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
            {myBinsData?.map((item) => {
              return (
                <span key={item.bin_id} className="p-3">
                  <SingleBin
                    name={item?.bin_name}
                    color={item?.bin_color}
                    singleBinData={item}
                    redirectBinLink={hasRecents ? "recents" : "mybin"}
                    handleUpdateBin={handleUpdateBin}
                    handleDeleteBin={handleDeleteBin}
                    handleShareBin={handleShareBin}
                  />
                </span>
              );
            })}
          </div>
          {!initialLoading && myBinsData?.length === 0 && !isBinDataLoading && (
            <div className="flex items-center justify-center p-20">
              <div className="text-2xl text-black">No Bin Found</div>
            </div>
          )}
        </>
      )}
      {alignment === "list" && (
        <div>
          <BinTable
            columns={columns}
            data={myBinsData}
            enableSelection={false}
            onSortChange={handleSortChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />

          {!initialLoading && myBinsData?.length === 0 && !isBinDataLoading && (
            <div className="flex items-center justify-center p-20">
              <div className="text-2xl text-black">No Bin Found</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BinsListingComponent;
