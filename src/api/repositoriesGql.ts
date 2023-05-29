import { gql } from 'graphql-request';

export const querySearchRepositoriesInitial = gql`
  query GetRequest($request: String!, $first: Int) {
    search(query: $request, type: REPOSITORY, first: $first) {
      edges {
        node {
          ... on Repository {
            id
            name
            owner {
              login
              avatarUrl
              url
            }
            languages(first: 10) {
              totalCount
              totalSize
              edges {
                size
                node {
                  name
                }
              }
            }
            pushedAt
            stargazerCount
          }
        }
      }
      repositoryCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
`;

export const querySearchRepositoriesNext = gql`
  query GetRequest($request: String!, $first: Int, $after: String) {
    search(query: $request, type: REPOSITORY, first: $first, after: $after) {
      edges {
        node {
          ... on Repository {
            id
            name
            owner {
              login
              avatarUrl
              url
            }
            languages(first: 10) {
              totalCount
              totalSize
              edges {
                size
                node {
                  name
                }
              }
            }
            pushedAt
            stargazerCount
          }
        }
      }
      repositoryCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
`;

export const querySearchRepositoriesPrevious = gql`
  query GetRequest($request: String!, $last: Int, $before: String) {
    search(query: $request, type: REPOSITORY, last: $last, before: $before) {
      edges {
        node {
          ... on Repository {
            id
            name
            owner {
              login
              avatarUrl
              url
            }
            languages(first: 10) {
              totalCount
              totalSize
              edges {
                size
                node {
                  name
                }
              }
            }
            pushedAt
            stargazerCount
          }
        }
      }
      repositoryCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
`;
