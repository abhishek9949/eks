import { FormikHelpers } from "formik";
import { IndividualContentCardProps } from "./content";

export interface ContentCreatorFormInitialValue {
  profile_picture: string | File;
  creator_name: string;
  edu_experience: string;
  current_job: string;
  teaching_reason: string;
  anything_else: string;
  social_media: {
    instagram_link: string | null;
    tiktok_link: string | null;
    facebook_link: string | null;
    x_link: string | null;
    linkedIn_link: string | null;
    other_link: string | null;
  };
}

export interface ContentCreatorFormProps {
  initialValues: ContentCreatorFormInitialValue;
  onSubmit: (
    values: ContentCreatorFormInitialValue,
    formikHelpers: FormikHelpers<ContentCreatorFormInitialValue>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
  contentCreatorData: contentCreatorDataAdminSide;
  handleDeleteContentCreatorProfile: () => void;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface contentCreatorDataAdminSide {
  creator_id: number;
  user_id: number;
  username: string;
  profile_picture: string;
  social_links: {
    instagram: string | null;
    tiktok: string | null;
    facebook: string | null;
    x: string | null;
    linkedin: string | null;
    other: string | null;
  };
  answers: {
    educational_experience: string;
    current_role: string;
    teaching_love: string;
    additional_info: string;
  };
}

export interface contentCreatorContentDataResType {
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: IndividualContentCardProps[];
  };
}
