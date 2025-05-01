import { configureStore } from '@reduxjs/toolkit';
import emptySplitApi from './middleware/mainReducer';
import rootReducers from './slices';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ...rootReducers,
      [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false
      }).concat(emptySplitApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
