import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PermissionProps } from "@/types/sidebar";

// Async action to fetch cookies
export const fetchCookies = createAsyncThunk("cookies/fetchCookies", async () => {
  const response = await fetch("/api/cookies/getCookies");
  if (!response.ok) throw new Error("Failed to fetch cookies");
  const data = await response.json();

  try {
    return {
      currentAccountCookie: JSON.parse(data.currentAccountCookie[0]?.accounts_json) ?? [],
      userCookies: data.userCookies ?? {},
      permissionCookie: JSON.parse(data.permissionCookie?.permissions_json) ?? [],
      currentRoleCookie: data.currentRoleCookie ?? {},
      tokenCookie: data.tokenCookie ?? {},
    };
  } catch (error) {
    console.error("Error parsing cookies:", error);
    throw new Error("Invalid JSON structure in cookies");
  }
});

interface CookieState {
  cookies: {
    currentAccountCookie?: { email: string; full_name: string; profile: string; token: string; isActiveAccount: boolean; }[];
    userCookies?: { email?: string; full_name?: string, organization_id: number, profile: string, user_id: number };
    permissionCookie?: PermissionProps[];
    currentRoleCookie?: {role_id: number; role_name: string;};
    tokenCookie?: { token: string };
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CookieState = {
  cookies: {},
  status: "idle",
  error: null,
};
const cookieSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    resetCookies: (state) => {
      state.cookies = {}; // Only reset cookies, keep status/error
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCookies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCookies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cookies = { ...action.payload };
        
      })
      .addCase(fetchCookies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load cookies";
      });
  },
});

export const { resetCookies } = cookieSlice.actions; // Export the reset actions
export default cookieSlice;
