import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { API_CONSTANTS } from "@/constants/api";
import { useLazyGetOrganisationListQuery } from "@/redux/allReducer";
import { Organisation, BlockDialogProps } from "@/types/content";
import ModalDialog from "@/components/common/ModalDialog";
import { useAppSelector } from "@/redux/hooks";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";

const BlockDialog: React.FC<BlockDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organisation[]
  >([]);
  const [organizationList, setOrganizationList] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(false);
  const isAdmin =
    useAppSelector(
      (state) => state.cookies.cookies.userCookies?.organization_id,
    ) === 0;
  const [getOrganisationList] = useLazyGetOrganisationListQuery();

  useEffect(() => {
    if (open) {
      setSelectedOrganizations([]);
      setLoading(true);
      getOrganisationList({
        endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?pagination=false`,
      })
        .unwrap()
        .then((res) => {
          if (res.results) {
            setOrganizationList([
              ...res.results,
              {
                organisation_id: "0",
                organisation_name: "Individual Educator",
              },
            ]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch organization list:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, getOrganisationList]);

  const handleSubmit = () => {
    if (selectedOrganizations.length > 0) {
      onSubmit(selectedOrganizations);
      onClose();
    }
  };

  const handleConfirm = () => {
    onSubmit(selectedOrganizations);
    onClose();
  };

  return (
    <>
      {isAdmin ? (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>Select Organizations</DialogTitle>
          <DialogContent>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <CircularProgress />
              </div>
            ) : (
              <MultiSelectDropdown
                id="organisation-multi-select"
                value={selectedOrganizations.map((org) => ({
                  id: org.organisation_id,
                  label: org.organisation_name,
                }))}
                options={organizationList.map((org) => ({
                  id: org.organisation_id,
                  label: org.organisation_name,
                }))}
                onChange={(newValue) =>
                  setSelectedOrganizations(
                    newValue.map((v) => ({
                      organisation_id: v.id,
                      organisation_name: v.label,
                    })),
                  )
                }
                placeholder="Select Organizations"
                fullWidth
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={onClose}
              color="secondary"
              disableRipple
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={selectedOrganizations.length === 0}
              disableRipple
              sx={{ backgroundColor: "primary.main" }}
            >
              Block
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <ModalDialog
          dialogTitle="Block Content"
          dialogDescription="Are you sure you want to block this content?"
          openDialog={open}
          handleCloseDialog={onClose}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default BlockDialog;
