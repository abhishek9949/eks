import { IndividualContentCardProps } from "./content";

export interface CardProps {
  course: IndividualContentCardProps;
  cardNavigationLink?: string;
}

export interface CardTypeProps {
  course: IndividualContentCardProps;
  cardTypeBg: string;
}

export interface CourseTagProps {
  tags: { name: string; color: string }[] | string[];
  fontWeight?: string;
  fontSize?: string;
  fontColor?: string;
  gap?: string;
  customClass?: string;
}

export interface ImageComponentProps {
  course: IndividualContentCardProps,
  height?: string,
  imageCustomClass?: string,
  cardTypeBg?: string,
  isFeatured?: boolean,
  showBinIcon?: boolean
}
