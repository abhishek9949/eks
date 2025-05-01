export interface BinDataProps {
  id: number;
  name: string;
  color: string;
}

export interface AddToBinProps {
  open: boolean;
  handleClose: () => void;
  handleAddToBin: (binId: number) => void;
  handleSelectBin: () => void;
  isAddingBinContent: boolean;
  contentTitle: string;
}
