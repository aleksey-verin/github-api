import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';

import { PageInfo, ResponseSearch } from './types/reposGraphQlTypes';
import { GraphQLClient, Variables } from 'graphql-request';
import { getVariablesByType, transformGraphQlData } from '../../utils/api-helpers';
import { GraphQlRequestType, RepositorySearchCommonItem } from './types/repoType';
import { getNumberOfPages } from '../../utils/helpers';
import { storage, storageGetItem } from '../../utils/storage';

interface initialStateTypes {
  resultsReposGraphQl: RepositorySearchCommonItem[] | null;
  totalCountReposGraphQl: number | null;
  paramsGraph: {
    per_request: number;
  };
  pageInfo: PageInfo;
  pagination: {
    per_page: number;
    max_pagination_items: number;
    current_page: number;
    numberOfPages: number;
    global_count_for_request: number;
  };
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = storageGetItem(storage.searchStoreGraphQL) ?? {
  resultsReposGraphQl: null,
  totalCountReposGraphQl: null,
  paramsGraph: {
    per_request: 45
  },
  pageInfo: {
    startCursor: '',
    endCursor: '',
    hasPreviousPage: false,
    hasNextPage: false
  },
  pagination: {
    per_page: 9,
    max_pagination_items: 5,
    current_page: 1,
    numberOfPages: 0,
    global_count_for_request: 1
  },
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const searchGraphQlRepos = createAsyncThunk<
  ResponseSearch,
  {
    searchValue: string;
    oAuthToken: string;
    per_request: number;
    type: GraphQlRequestType;
    pageInfo: PageInfo;
  },
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>(
  'searchGraphQlRepos',
  async ({ searchValue, oAuthToken, per_request, type, pageInfo }, thunkAPI) => {
    try {
      const endpoint = `https://api.github.com/graphql`;
      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${oAuthToken}`
        }
      });
      const variables = getVariablesByType(searchValue, per_request, type, pageInfo);
      const data = (await graphQLClient.request(
        variables.query,
        variables.variables as Variables
      )) as ResponseSearch;
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const searchGraphQlReposSlice = createSlice({
  name: 'searchReposSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    setCurrentPage: (state, { payload }: PayloadAction<number>) => {
      state.pagination.current_page = payload;
    },
    setGlobalCountForRequest: (state, { payload }: PayloadAction<number>) => {
      state.pagination.global_count_for_request = payload;
    },
    resetRequestParamsGraphQl: (state) => {
      state.pagination.global_count_for_request = initialState.pagination.global_count_for_request;
      state.pagination.current_page = initialState.pagination.current_page;
      state.pagination.numberOfPages = initialState.pagination.numberOfPages;
    },
    clearResultsGraphQl: (state) => {
      state.resultsReposGraphQl = initialState.resultsReposGraphQl;
      state.totalCountReposGraphQl = initialState.totalCountReposGraphQl;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(searchGraphQlRepos.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(
      searchGraphQlRepos.fulfilled,
      (state, { payload }: PayloadAction<ResponseSearch>) => {
        state.resultsReposGraphQl = transformGraphQlData(payload);
        state.totalCountReposGraphQl = payload.search.repositoryCount;
        state.pagination.numberOfPages = getNumberOfPages(
          payload.search.repositoryCount,
          state.pagination.per_page
        );
        state.pageInfo = payload.search.pageInfo;
        state.isLoading = false;
        state.isSuccess = true;
      }
    );
    builder.addCase(searchGraphQlRepos.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorSearchGraphQlReposSlice = (state: IRootState) => state.searchGraphQlReposSlice;
export const {
  setCurrentPage,
  setGlobalCountForRequest,
  resetRequestParamsGraphQl,
  clearResultsGraphQl
} = searchGraphQlReposSlice.actions;
export default searchGraphQlReposSlice.reducer;
