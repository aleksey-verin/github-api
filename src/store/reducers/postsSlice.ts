import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, IRootState } from '../store';
import { IPost } from './types/postsTypes';
import { getPostsUrl } from '../../utils/api-helpers';

interface initialStateTypes {
  posts: IPost[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  posts: [],
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getPosts = createAsyncThunk<
  IPost[],
  string | void,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getPosts', async (params, thunkAPI) => {
  try {
    const url = getPostsUrl(params);
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

export const postsSlice = createSlice({
  name: 'postsSlice',
  initialState: initialState as initialStateTypes,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(getPosts.fulfilled, (state, { payload }: PayloadAction<IPost[]>) => {
      state.posts = payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorPostsSlice = (state: IRootState) => state.postsSlice;

export default postsSlice.reducer;
