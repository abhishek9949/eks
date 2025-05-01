import { emptySplitApi } from './mainReducer';
import allReducer from '@/redux/allReducer';

export const mainEndPointCreator = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    ...allReducer(builder)
  }),
  overrideExisting: false
});

export default mainEndPointCreator;