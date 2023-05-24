import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { IUsers } from './types/usersTypes';

interface initialStateTypes {
  users: IUsers[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getUsers = createAsyncThunk<
  IUsers[],
  void,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getUsers', async (_, thunkAPI) => {
  const url = 'https://jsonplaceholder.typicode.com/users';
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

export const usersSlice = createSlice({
  name: 'usersSlice',
  initialState: initialState as initialStateTypes,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }: PayloadAction<IUsers[]>) => {
      state.users = payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorUsersSlice = (state: IRootState) => state.usersSlice;

export default usersSlice.reducer;
