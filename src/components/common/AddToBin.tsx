"use client";

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import BinLogo from "@/components/common/BinLogo";
import { AddToBinProps } from "@/types/addToBin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import {
  useCreateNewBinMutation,
  useLazyGetBinsQuery,
} from "@/redux/allReducer";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { GetBinsData } from "@/types/bins/binsType";
import CreateBin from "@/components/BinComponents/CommonBinComponent/CreateBin/CreateBinForm";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default function AddToBinComp({
  open,
  handleClose,
  handleAddToBin,
  handleSelectBin,
  isAddingBinContent,
  contentTitle,
}: Readonly<AddToBinProps>) {
  const dispatch = useAppDispatch();
  const [getBins] = useLazyGetBinsQuery();
  const [createNewBin] = useCreateNewBinMutation();
  const { isConfirmAddToBin } = useAppSelector((state) => state.addToBin);
  const [binsData, setBinsData] = useState<GetBinsData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBinId, setSelectedBinId] = useState<GetBinsData | null>(null);
  const [isLoadingBins, setIsLoadingBins] = useState(false);
  const [openCreateBinDialog, setOpenCreateBinDialog] = useState(false);

  const handleOpenCreateBinDialog = () => {
    setOpenCreateBinDialog(true);
  };
  const handleCloseCreateBin = () => {
    setOpenCreateBinDialog(false);
  };

  const filteredBins = binsData?.filter((bin) =>
    bin?.bin_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    if (selectedBinId) handleAddToBin(selectedBinId?.bin_id);
  };

  const handleCreateBin = (payload: {
    bin_name: string;
    bin_color: string;
  }) => {
    createNewBin({
      endpoint: API_CONSTANTS.CREATE_NEW_BIN,
      method: "POST",
      data: payload,
    })
      .unwrap()
      .then((newBin) => {
        dispatch(
          showToastMessage({ message: "New bin created", severity: "success" }),
        );
        handleGetAllBins();
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleGetAllBins = () => {
    setIsLoadingBins(true);
    getBins({
      endpoint: `${API_CONSTANTS.GET_BINS}?pagination=false`,
    })
      .unwrap()
      .then((result) => {
        // @ts-ignore
        setBinsData(result?.data);
        setIsLoadingBins(false);
      })
      .catch((error) => {
        setIsLoadingBins(false);
        dispatch(
          showToastMessage({
            message: error?.data?.error || "Error while fetching bins",
            severity: "error",
          }),
        );
      });
  };

  useEffect(() => {
    handleGetAllBins();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
      aria-labelledby="alert-add-bin-title"
      aria-describedby="alert-add-bin-description"
      maxWidth="sm"
      fullWidth
      key={open ? "bin-dialog-open" : "bin-dialog-closed"}
    >
      {isConfirmAddToBin ? (
        <DialogContent className="min-w-120">
          <Box className="relative !py-5 text-center">
            <Box className="flex justify-center">
              <BinLogo
                color={selectedBinId?.bin_color}
                className="h-[65px] w-[65px]"
              />
            </Box>
            <Box className="text-2xl">
              Are you sure you want to add this to the{" "}
              {`"${selectedBinId?.bin_name}"`} bin?
            </Box>
            <Box className="flex justify-center gap-2 pt-5">
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleClose}
                disableRipple
                disabled={isAddingBinContent}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "primary.main",
                  "&.Mui-disabled": {
                    backgroundColor: "primary.main",
                    color: "white",
                    cursor: "not-allowed",
                  },
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={handleAdd}
                disableRipple
                disabled={isAddingBinContent}
                startIcon={
                  isAddingBinContent && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                  )
                }
              >
                Yes
              </Button>
            </Box>
          </Box>
        </DialogContent>
      ) : (
        <>
          <DialogTitle className="text-base">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-20">
              Add file to Bin - {contentTitle}
            </div>

            <div className="!absolute !right-2 !top-3 flex items-center">
              <div>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<AddOutlinedIcon />}
                  disableRipple
                  onClick={handleOpenCreateBinDialog}
                >
                  <span className="pt-1">New</span>
                </Button>
                <CreateBin
                  openCreateBinDialog={openCreateBinDialog}
                  handleCloseCreateBin={handleCloseCreateBin}
                  handleCreateBin={handleCreateBin}
                />
              </div>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                className="!text-gray-8"
                size="small"
              >
                <CloseIcon className="!text-lg" />
              </IconButton>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent className="h-[400px] overflow-y-auto">
            <Box p={2}>
              <TextField
                fullWidth
                placeholder="Search bin"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isLoadingBins ? (
                <div className="mt-5 flex justify-center">
                  <div className="h-16 w-16 animate-spin justify-center rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {filteredBins?.length === 0 && (
                    <div className="mt-5 text-center">No Bins Found</div>
                  )}
                  <List>
                    {filteredBins?.map((bin) => (
                      <ListItem key={bin.bin_id} className="flex items-center">
                        <Box className="mr-2">
                          <BinLogo color={bin.bin_color} />
                        </Box>
                        <ListItemText primary={bin.bin_name} />
                        <Button
                          variant="outlined"
                          className="!px-10 !text-gray-700"
                          size="large"
                          color="secondary"
                          onClick={() => {
                            setSelectedBinId(bin);
                            handleSelectBin();
                          }}
                          disableRipple
                        >
                          Add
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
