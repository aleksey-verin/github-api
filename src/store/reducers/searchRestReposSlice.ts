import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { ParamsSearch, RepositorySearchCommonItem, SearchRepositoriesType } from './types/repoType';
import { getSearchUrl, transformRESTData } from '../../utils/api-helpers';
import { getNumberOfPages } from '../../utils/helpers';
import { storage, storageGetItem } from '../../utils/storage';

// const defaultValues = {
//   resultsRepos: null,
//   totalCountRepos: null,
//   params: {
//     per_page: 9,
//     page: 1
//   },
//   numberOfPages: 0
// };

interface initialStateTypes {
  resultsRepos: RepositorySearchCommonItem[] | null;
  totalCountRepos: number | null;
  params: ParamsSearch;
  numberOfPages: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = storageGetItem(storage.searchStoreREST) ?? {
  resultsRepos: null,
  totalCountRepos: null,
  params: {
    per_page: 9,
    page: 1
  },
  numberOfPages: 0,
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getResultsRepos = createAsyncThunk<
  SearchRepositoriesType,
  { searchValue: string; oAuthToken: string | undefined; params?: ParamsSearch },
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>(
  'getResultsRepos',
  async ({ searchValue, oAuthToken, params = initialState.params }, thunkAPI) => {
    try {
      const url = getSearchUrl(searchValue, params);
      const headersList = {
        Accept: '*/*',
        Authorization: `Bearer ${oAuthToken}`
      };
      if (!url) return;
      const response = await fetch(url, {
        method: 'GET',
        headers: oAuthToken ? headersList : {}
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data?.message);
      }
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const searchRestReposSlice = createSlice({
  name: 'searchRestReposSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    clearSearchData: (state) => {
      state.resultsRepos = initialState.resultsRepos;
      state.numberOfPages = initialState.numberOfPages;
      state.params.page = initialState.params.page;
    },
    setParamsPage: (state, { payload }: PayloadAction<number>) => {
      state.params.page = payload;
    },
    resetParamsPage: (state) => {
      state.params.page = initialState.params.page;
    },
    setParamsPerPage: (state, { payload }: PayloadAction<number>) => {
      state.params.per_page = payload;
    },
    resetParamsPerPage: (state) => {
      state.params.per_page = initialState.params.per_page;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getResultsRepos.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(
      getResultsRepos.fulfilled,
      (state, { payload }: PayloadAction<SearchRepositoriesType>) => {
        state.resultsRepos = transformRESTData(payload);
        state.totalCountRepos = payload.total_count;
        state.numberOfPages = getNumberOfPages(payload.total_count, state.params.per_page);
        state.isLoading = false;
        state.isSuccess = true;
      }
    );
    builder.addCase(getResultsRepos.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorSearchReposSlice = (state: IRootState) => state.searchRestReposSlice;
export const {
  clearSearchData,
  setParamsPage,
  resetParamsPage,
  setParamsPerPage,
  resetParamsPerPage
} = searchRestReposSlice.actions;
export default searchRestReposSlice.reducer;
