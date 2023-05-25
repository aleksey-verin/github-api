import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { ParamsSearch, SearchRepositoriesType } from './types/repoType';
import { getSearchUrl } from '../../utils/api-helpers';
import { getNumberOfPages } from '../../utils/helpers';

interface initialStateTypes {
  search: string;
  resultsRepos: SearchRepositoriesType | null;
  params: ParamsSearch;
  numberOfPages: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  search: '',
  resultsRepos: null,
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
  { searchValue: string; oAuthToken: string | undefined; params: ParamsSearch },
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getResultsRepos', async ({ searchValue, oAuthToken, params }, thunkAPI) => {
  try {
    const url = getSearchUrl(searchValue, params);
    const headersList = {
      Accept: '*/*',
      Authorization: `Bearer ${oAuthToken}`
    };
    console.log(url);
    if (!url) return;
    const response = await fetch(url, {
      method: 'GET',
      headers: oAuthToken ? headersList : {}
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      return thunkAPI.rejectWithValue(error?.message);
    }
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const searchReposSlice = createSlice({
  name: 'searchReposSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    setSearch: (state, { payload }: PayloadAction<string>) => {
      state.search = payload;
    },
    clearSearch: (state) => {
      state.search = initialState.search;
      state.resultsRepos = initialState.resultsRepos;
    },
    setParamsPage: (state, { payload }: PayloadAction<number>) => {
      state.params.page = payload;
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
        state.resultsRepos = payload;
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

export const selectorSearchReposSlice = (state: IRootState) => state.searchReposSlice;
export const { setSearch, clearSearch, setParamsPage } = searchReposSlice.actions;
export default searchReposSlice.reducer;
