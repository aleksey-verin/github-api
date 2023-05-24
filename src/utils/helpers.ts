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
  const total = Object.values(obj).reduce((sum, value) => sum + value, 0);

  const percentages = Object.entries(obj).map(([key, value]) => {
    const percentage = ((value / total) * 100).toFixed(2);
    return `${key}: ${percentage}%`;
  });

  return percentages.join(', ');
}
