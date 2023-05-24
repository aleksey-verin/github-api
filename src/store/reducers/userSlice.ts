import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { RepositoriesType, RepositoryItem } from './types/repoType';

interface initialStateTypes {
  user: string;
  userRepos: RepositoryItem[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  user: 'aleksey-verin',
  userRepos: [],
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getUserRepos = createAsyncThunk<
  RepositoryItem[],
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getUserRepos', async (user, thunkAPI) => {
  const url = `https://api.github.com/users/${user}/repos`;
  try {
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

export const userSlice = createSlice({
  name: 'userSlice',
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
      (state, { payload }: PayloadAction<RepositoryItem[]>) => {
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

export const selectorUserSlice = (state: IRootState) => state.userSlice;

export default userSlice.reducer;
