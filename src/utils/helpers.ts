import { Languages } from '../store/reducers/types/repoType';

export function extractPath(input: string): string {
  const regex = /^(\/[^/]+)(\/.*)?$/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  }

  return input;
}

export function getViewedLanguages(obj: Languages): string {
  if (!Object.keys(obj).length) return 'There is no languages';

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
  // if (!numberOfPages) return;
  console.log(numberOfPages, currentPage);
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
