import { CategoryList } from "./common";
import { GlobalContentListProps, IndividualContentCardProps } from "./content";

export interface CourseCategoriesProps {
  filters: { name: string; category_id: number }[];
  selectedCategoryFilter: number | null;
  handleFilterCategoryList: (filterId: number | null) => void;
  isCategoriesLoading: boolean;
}

export interface FeaturedArticleProps {
  article: any;
}
// export enum TYPE{ "Article", "Research" ,"Podcast", "Printable Resource", "Video", "Workshop"}
export interface Courses {
  id: number;
  type: string;
  tags: { name: string; color: string }[];
  title?: string;
  description?: string;
  duration?: string;
  modules?: string;
  courseColor?: string;
}

export interface IndividualCourseProps {
  courses: IndividualContentCardProps[];
  title: string;
  navigationLink?: string;
  notScrollable?: boolean;
  isDataLoading?: boolean;
  contentLoaderRef?: React.RefObject<HTMLDivElement>;
  cardNavigationLink?: string;
}

export interface CourseListProps {
  params: {
    courseType: string;
  };
}

export interface ResourceAndResearchProps {
  globalContentList: GlobalContentListProps;
  categoryList: CategoryList[];
  handleCategorySelect: (filterId: number | null) => void;
  selectedCategoryFilter: number | null;
  globalSearchContentList: IndividualContentCardProps[];
  globalSearchQuery: string | null;
  isApiLoading: boolean;
  isSearchApiLoading: boolean;
  searchLoaderRef?: React.RefObject<HTMLDivElement>;
  isCategoriesLoading: boolean;
}

export interface IndividualContentCardDetailsProps {
  params: {
    courseType: string;
    id: string;
  }
}