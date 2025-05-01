import { FilterState } from "@/types/filterSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FilterState = {
  organisationFilters: {
    organisationName: "",
    organisationType: "",
    createdAt: "",
    isActive: "",
    searchText: "",
    sortColumn: "",
    sortDirection: ""
  },
  roleFilters: {
    roleName: "",
    roleDescription: "",
    createdAt: "",
    searchText: "",
    sortColumn: "",
    sortDirection: ""
  },
  subscriptionFilters: {
    planName: "",
    planType: "",
    planStatus: "",
    createdAt: "",
    searchText: "",
    sortColumn: "",
    sortDirection: ""
  },
  usersFilters: {
    searchText:"",
    searchFirstName:"",
    searchLastName:"",
    searchByEmail:"",
    page:1,
    rowsPerPage:5,
    tabValue: 0,
  },
  communityFilters: {
    communityTitle: "",
    createdAt: "",
    isActive: "",
    searchText: "",
    page: 1,
    rowsPerPage: 5
  },
  contentFilters: {
    contentTags: "",
    contentType: "",
    createdAt: "",
    createdBy: "",
    contentStatus: "",
    contentCategory: [],
    searchText: "",
    sortColumn: "",
    sortDirection: ""
  }
};

const filterSlice = createSlice({
  name: "filterSlice",
  initialState,
  reducers: {
    setOrganisationFilters: (state, action: PayloadAction<Partial<FilterState["organisationFilters"]>>) => {
      state.organisationFilters = { ...state.organisationFilters, ...action.payload };
    },
    resetOrganisationFilters: (state) => {
      state.organisationFilters = initialState.organisationFilters;
    },
    setRoleFilters: (state, action: PayloadAction<Partial<FilterState["roleFilters"]>>) => {
      state.roleFilters = { ...state.roleFilters, ...action.payload };
    },
    resetRoleFilters: (state) => {
      state.roleFilters = initialState.roleFilters;
    },
    setSubscriptionFilters: (state, action: PayloadAction<Partial<FilterState["subscriptionFilters"]>>) => {
      state.subscriptionFilters = { ...state.subscriptionFilters, ...action.payload };
    },
    resetSubscriptionFilters: (state) => {
      state.subscriptionFilters = initialState.subscriptionFilters;
    },
    setUsersFilters: (state, action: PayloadAction<Partial<FilterState["usersFilters"]>>) => {
      state.usersFilters = { ...state.usersFilters, ...action.payload };
    },
    resetUsersFilters: (state) => {
      state.usersFilters = {
        ...initialState.usersFilters,
        tabValue: state.usersFilters.tabValue,
      };
    },
    setCommunityFilters: (state, action: PayloadAction<Partial<FilterState["communityFilters"]>>) => {
      state.communityFilters = { ...state.communityFilters, ...action.payload };
    },
    resetCommunityFilters: (state) => {
      state.communityFilters = initialState.communityFilters;
    },
    setContentFilters: (state, action: PayloadAction<Partial<FilterState["contentFilters"]>>) => {
      state.contentFilters = { ...state.contentFilters, ...action.payload };
    },
    resetContentFilters: (state) => {
      state.contentFilters = initialState.contentFilters;
    },
  },
});

export const {
  setOrganisationFilters,
  resetOrganisationFilters,
  setRoleFilters,
  resetRoleFilters,
  setSubscriptionFilters,
  resetSubscriptionFilters,
  setUsersFilters,
  resetUsersFilters,
  setCommunityFilters,
  resetCommunityFilters,
  setContentFilters,
  resetContentFilters
} = filterSlice.actions;
export default filterSlice;
