import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, IRootState } from '../store';
import { getCommentsUrl } from '../../utils/api-helpers';
import { IComment, IUserNewComment } from './types/commentsTypes';

interface initialStateTypes {
  comments: IComment[];
  isLoading: boolean;
  isLoadingComment: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  comments: [],
  isLoading: false,
  isLoadingComment: false,
  isSuccess: false,
  isError: false
};

export const getComments = createAsyncThunk<
  IComment[],
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getComments', async (params, thunkAPI) => {
  try {
    const url = getCommentsUrl(params);
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

export const postNewComment = createAsyncThunk<
  IComment,
  IUserNewComment,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('postNewComment', async (params, thunkAPI) => {
  try {
    const headersList = {
      Accept: '*/*',
      'Content-Type': 'application/json; charset=UTF-8'
    };

    const bodyContent = JSON.stringify({
      name: params.name,
      email: params.email,
      body: params.body
    });
    const url = getCommentsUrl(params.postId);
    const response = await fetch(url, {
      method: 'POST',
      body: bodyContent,
      headers: headersList
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

export const commentsSlice = createSlice({
  name: 'commentsSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    clearComments: (state) => {
      state.comments = initialState.comments;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(getComments.fulfilled, (state, { payload }: PayloadAction<IComment[]>) => {
      state.comments = payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getComments.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(postNewComment.pending, (state) => {
      state.isLoading = true;
      state.isLoadingComment = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(postNewComment.fulfilled, (state, { payload }: PayloadAction<IComment>) => {
      state.comments.push({ ...payload, postId: Number(payload.postId) });
      state.isLoading = false;
      state.isLoadingComment = false;
      state.isSuccess = true;
    });
    builder.addCase(postNewComment.rejected, (state) => {
      state.isLoading = false;
      state.isLoadingComment = false;
      state.isError = true;
    });
  }
});

export const selectorCommentsSlice = (state: IRootState) => state.commentsSlice;
export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
