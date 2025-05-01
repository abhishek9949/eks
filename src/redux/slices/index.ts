import toastMessageSlice from "./toastMessageSlice";
import filterSlice from "./filterSlice";
import reportCommentSlice from "./reportCommentSlice";
import cookieSlice from "./cookieSlice";
import addToBinSlice from "./addToBinSlice";
import binSlice from './binSlice';
import chatSlice from "./chatSlice";

const rootReducers = {
  [toastMessageSlice.name]: toastMessageSlice.reducer,
  [filterSlice.name]: filterSlice.reducer,
  [reportCommentSlice.name]: reportCommentSlice.reducer,
  [cookieSlice.name]: cookieSlice.reducer,
  [addToBinSlice.name]: addToBinSlice.reducer,
  [binSlice.name]: binSlice.reducer,
  [chatSlice.name]: chatSlice.reducer
};

export default rootReducers;
