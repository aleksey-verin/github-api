import { LanguagesObject, RepositorySearchCommonItem } from '../store/types/repoType';
import { LanguagesGraph } from '../store/types/reposGraphQlTypes';

export function getLanguageObject(langGraph: LanguagesGraph): LanguagesObject {
  const result: Record<string, number> = {};

  for (const item of langGraph.edges) {
    const { size, node } = item;
    const { name } = node;
    result[name] = size;
  }

  return result;
}

export function getViewedLanguages(obj: LanguagesObject): string {
  const total = Object.values(obj).reduce((sum, value) => sum + value, 0);

  const percentages = Object.entries(obj).map(([key, value]) => {
    const percentage = ((value / total) * 100).toFixed(2);
    return `${key}: ${percentage}%`;
  });

  return percentages.join(', ');
}

export function getNumberOfPages(total: number, per_page: number): number {
  return Math.ceil(total / per_page);
}

export function getPaginationArray(numberOfPages: number, currentPage: number): Array<number> {
  const maxAmount = 9;
  const halfOfMaxAmount = Math.floor(maxAmount / 2);
  const listOfNumbers = [];

  if (numberOfPages <= maxAmount) {
    for (let i = 1; i <= numberOfPages; i++) {
      listOfNumbers.push(i);
    }
  }
  if (numberOfPages > maxAmount) {
    if (currentPage <= halfOfMaxAmount) {
      for (let i = 1; i <= maxAmount; i++) {
        listOfNumbers.push(i);
      }
    } else if (currentPage > numberOfPages - halfOfMaxAmount) {
      for (let i = numberOfPages - maxAmount + 1; i <= numberOfPages; i++) {
        listOfNumbers.push(i);
      }
    } else {
      for (let i = currentPage - halfOfMaxAmount; i <= currentPage + halfOfMaxAmount; i++) {
        listOfNumbers.push(i);
      }
    }
  }
  return listOfNumbers;
}

export function getShortString(name: string, amount: number): string {
  return name.length >= amount ? `${name.slice(0, 20)}..` : name;
}

export function getViewedResultsRepos(
  repos: RepositorySearchCommonItem[],
  current_page: number,
  per_page: number,
  global_count_for_request: number,
  max_pagination_items: number
): RepositorySearchCommonItem[] {
  const lengthRepos = repos.length;
  const currentPageByOrder = current_page - (global_count_for_request - 1) * max_pagination_items;
  if (lengthRepos <= per_page) return repos;
  const start = per_page * (currentPageByOrder - 1); // 6 * (2 -1) = 6
  const viewedResults = repos.slice(start, start + per_page);
  return viewedResults;
}

export function getPaginationForGraph(
  max_pagination_items: number,
  globalCountRequest: number,
  numberOfPages: number
): Array<number> {
  const listOfNumbers = [];

  const start = (globalCountRequest - 1) * max_pagination_items + 1;
  const end =
    numberOfPages > max_pagination_items * globalCountRequest
      ? start + max_pagination_items - 1
      : numberOfPages;
  for (let i = start; i <= end; i++) {
    listOfNumbers.push(i);
  }

  return listOfNumbers;
}
