export interface CategoryList {
  category_id: number;
  name: string;
  color: string;
}
export type PageProps = {
  params: {
    id: string;
  };
}
export interface AutocompleteProps {
  id: string;
  value: CategoryList[];
  onChange: (newValue: CategoryList[]) => void;
  options: CategoryList[];
  getOptionLabel: (option: CategoryList) => string;
  isOptionEqualToValue?: (option: CategoryList, value: CategoryList) => boolean;
  placeholder?: string;
  size?: "small" | "medium";
}

export interface GetStartedProps {
  showGetStartedButton: boolean;
}
