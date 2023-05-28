import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { RepositoryItem, RepositorySearchCommonItem } from './types/repoType';
import { transformUserReposData } from '../../utils/api-helpers';

interface initialStateTypes {
  userRepos: RepositorySearchCommonItem[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  userRepos: [],
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getUserRepos = createAsyncThunk<
  RepositorySearchCommonItem[],
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getUserRepos', async (user, thunkAPI) => {
  try {
    const url = `https://api.github.com/users/${user}/repos`;
    const response = await fetch(url);
    const data = (await response.json()) as RepositoryItem[];
    // if (response.ok) {
    return transformUserReposData(data);
    // } else {
    //   return thunkAPI.rejectWithValue('Error');
    // }
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const userReposSlice = createSlice({
  name: 'userReposSlice',
  initialState: initialState as initialStateTypes,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserRepos.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(
      getUserRepos.fulfilled,
      (state, { payload }: PayloadAction<RepositorySearchCommonItem[]>) => {
        state.userRepos = payload;
        state.isLoading = false;
        state.isSuccess = true;
      }
    );
    builder.addCase(getUserRepos.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorUserSlice = (state: IRootState) => state.userReposSlice;

export default userReposSlice.reducer;
