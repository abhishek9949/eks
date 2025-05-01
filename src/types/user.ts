export interface GlobalUsersList {
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  organisation_id: number;
  profile_picture: string;
  user_id: number;
  username: string;
}

export interface GlobalUsersListReponse {
  message: string;
  data: GlobalUsersList[]
}