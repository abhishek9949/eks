import { ChatSliceProps } from "@/types/chats";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatSliceProps = {
 isChatCleared: false,
 reloadChatHistory: false
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleIsChatCleared: (state, action: PayloadAction<boolean>) => {
      state.isChatCleared = action?.payload
    },
    toggleReloadChatHistory: (state, action: PayloadAction<boolean>) => {
      state.reloadChatHistory = action?.payload
    }
  },
});

export const { toggleIsChatCleared, toggleReloadChatHistory } = chatSlice.actions;
export default chatSlice;
