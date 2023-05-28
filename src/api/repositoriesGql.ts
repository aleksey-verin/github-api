import { gql } from 'graphql-request';

export const querySearchRepositoriesFirstRequest = gql`
  query GetRequest($request: String!, $first: Int) {
    search(query: $request, type: REPOSITORY, first: $first) {
      edges {
        node {
          ... on Repository {
            id
            name
            owner {
              login
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
