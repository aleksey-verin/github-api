// export interface ResponseSearch {
//   data: Data;
// }

export interface ResponseSearch {
  search: SearchData;
}

export interface SearchData {
  edges: Edge[];
  repositoryCount: number;
  pageInfo: PageInfo;
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  name: string;
  owner: Owner;
  languages: LanguagesGraph;
  pushedAt: string;
  stargazerCount: number;
  description: string | undefined;
}

export interface Owner {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface LanguagesGraph {
  totalCount: number;
  totalSize: number;
  edges: Edge2[] | [];
}

export interface Edge2 {
  size: number;
  node: Node2;
}

export interface Node2 {
  name: string;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

//============================== after transform ==============

export interface SearchRepositoriesGraphQlType {
  repositoryCount: number;
  pageInfo: PageInfo;
  resultsRepos: ResultsItem[];
}

interface ResultsItem {
  id: string;
  name: string;
  owner: string;
  languages: LanguagesGraph;
  pushedAt: string;
  stargazerCount: number;
}
