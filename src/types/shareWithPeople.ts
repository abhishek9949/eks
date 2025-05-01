export interface UserDataProps {
  id: number,
  name: string,
  email: string
}

export interface ShareWithPeopleProps {
  usersData: UserDataProps[],
  open: boolean,
  handleClose: () => void,
  handleChangeSelectUser: (event: React.SyntheticEvent<Element, Event>, newValue: UserDataProps[]) => void,
  handleShare: () => void,
}