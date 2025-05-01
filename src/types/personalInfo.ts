export interface UserProfile {
  name?: string;
  email?: string;
  phone?: string | null;
  bio?: string | null;
  profile_picture?: string | File;
  country_code?: string;
  roles?: string[];
}


export interface Answer {
  id: number;
  answer: string;
  isSelected: boolean;
}

export interface Question {
  id: number;
  question: string;
  custom_answer: Answer;
  answers: Answer[];
}

export interface ChangedPassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export type Questionnaire = Question[];
