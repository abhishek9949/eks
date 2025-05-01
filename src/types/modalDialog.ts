type ButtonSize = "small" | "medium" | "large";
export interface ModalDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  handleConfirm: () => void;
  dialogTitle?: string;
  dialogDescription?: string;
  cancelBtnLabel?: string;
  submitBtnLabel?: string;
  actionButtonClass?: string;
  buttonSize?: ButtonSize;
}
