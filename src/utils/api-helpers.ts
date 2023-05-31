import {
  querySearchRepositoriesInitial,
  querySearchRepositoriesNext,
  querySearchRepositoriesPrevious
} from '../api/repositoriesGql';
import {
  GraphQlRequestType,
  ParamsSearch,
  RepositoryItem,
  RepositorySearchCommonItem,
  SearchRepositoriesType
} from '../store/types/repoType';
import { PageInfo, ResponseSearch } from '../store/types/reposGraphQlTypes';

export const getSearchUrl = (searchValue: string, params: ParamsSearch): URL | void => {
  const _url = new URL('https://api.github.com/search/repositories');
  if (!searchValue) return;
  _url.searchParams.append('q', searchValue);
  _url.searchParams.append('page', String(params.page));
  _url.searchParams.append('per_page', String(params.per_page));
  return _url;
};

export const getCommentsUrl = (postId: string | number): string => {
  return `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
};

export function transformGraphQlData(response: ResponseSearch): RepositorySearchCommonItem[] {
  const resultsRepos = response.search.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    owner: {
      login: node.owner.login,
      html_url: node.owner.url,
      avatar_url: node.owner.avatarUrl
    },
    description: node.description,
    languageMain: node.languages.edges.length
      ? node.languages.edges[0].node.name
      : "there's no info",
    languages: node.languages,
    pushedAt: node.pushedAt,
    stargazerCount: node.stargazerCount
  }));
  return resultsRepos;
}

export function transformRESTData(response: SearchRepositoriesType): RepositorySearchCommonItem[] {
  const resultsRepos = response.items.map((item) => ({
    id: item.id,
    name: item.name,
    languageMain: item.language ? item.language : "there's no info",
    languages: item.languages_url,
    pushedAt: item.pushed_at,
    stargazerCount: item.stargazers_count,
    description: item.description,
    owner: {
      login: item.owner.login,
      html_url: item.owner.html_url,
      avatar_url: item.owner.avatar_url
    }
  }));
  return resultsRepos;
}

export function transformUserReposData(response: RepositoryItem[]): RepositorySearchCommonItem[] {
  const resultsRepos = response.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    owner: {
      login: item.owner.login,
      html_url: item.owner.html_url,
      avatar_url: item.owner.avatar_url
    },
    languageMain: item.language ? item.language : "there's no info",
    languages: item.languages_url,
    pushedAt: item.pushed_at,
    stargazerCount: item.stargazers_count
  }));
  return resultsRepos;
}

export function getVariablesByType(
  searchValue: string,
  per_request: number,
  type: GraphQlRequestType,
  pageInfo: PageInfo
): variablesForGraphInitialRequest | variablesForGraphNextRequest | variablesForGraphPrevRequest {
  const initialParams = {
    variables: { request: searchValue, first: per_request },
    query: querySearchRepositoriesInitial
  };
  const nextParams = {
    variables: { request: searchValue, first: per_request, after: pageInfo.endCursor },
    query: querySearchRepositoriesNext
  };
  const prevParams = {
    variables: { request: searchValue, last: per_request, before: pageInfo.startCursor },
    query: querySearchRepositoriesPrevious
  };
  switch (type) {
    case GraphQlRequestType.initial:
      return initialParams;
    case GraphQlRequestType.next:
      return nextParams;
    case GraphQlRequestType.previous:
      return prevParams;
    default:
      return initialParams;
  }
}

export interface variablesForGraphInitialRequest {
  variables: { request: string; first: number };
  query: string;
}
export interface variablesForGraphNextRequest {
  variables: { request: string; first: number; after: string };
  query: string;
}
export interface variablesForGraphPrevRequest {
  variables: { request: string; last: number; before: string };
  query: string;
}

export async function getLanguageForRepo(url: string) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
