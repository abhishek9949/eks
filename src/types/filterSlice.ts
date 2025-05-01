export interface FilterState {
  organisationFilters: {
    organisationName: string,
    organisationType: string,
    createdAt: string,
    isActive: string,
    searchText: string,
    sortColumn: string,
    sortDirection: string
  },
  roleFilters: {
    roleName: string,
    roleDescription: string,
    createdAt: string,
    searchText: string,
    sortColumn: string,
    sortDirection: string
  },
  subscriptionFilters: {
    planName: string,
    planType: string,
    planStatus: string,
    createdAt: string,
    searchText: string,
    sortColumn: string,
    sortDirection: string
  },
  usersFilters: {
    searchText:string,
    searchFirstName:string,
    searchLastName:string,
    searchByEmail:string,
    page: number,
    rowsPerPage: number,
    tabValue: number,
  },
  communityFilters: {
    communityTitle: string,
    createdAt: string,
    isActive: string,
    searchText: string,
    page: number,
    rowsPerPage: number
  },
  contentFilters: {
    contentTags: string,
    contentType: string,
    createdAt: string,
    createdBy: string,
    contentStatus: string,
    contentCategory: number[],
    searchText: string,
    sortColumn: string,
    sortDirection: string
  }
}
