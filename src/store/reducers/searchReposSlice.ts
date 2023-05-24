import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { SearchRepositoriesType } from './types/repoType';
import { getSearchUrl } from '../../utils/api-helpers';

interface initialStateTypes {
  search: string;
  resultsRepos: SearchRepositoriesType | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  search: '',
  resultsRepos: null,
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getResultsRepos = createAsyncThunk<
  SearchRepositoriesType,
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getResultsRepos', async (searchValue, thunkAPI) => {
  try {
    const url = getSearchUrl(searchValue);
    console.log(url);
    if (!url) return;
    const response = await fetch(url);
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
export const { setSearch, clearSearch } = searchReposSlice.actions;
export default searchReposSlice.reducer;
