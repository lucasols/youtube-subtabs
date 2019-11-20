import { FilterProps } from 'settingsApp/state/filtersState';

export function getFilterName(filter: FilterProps) {
  return (
    filter.name
    || (filter.userId || filter.videoNameRegex
      ? `${filter.userId ? `user: "${filter.userId}"` : ''} ${
        filter.videoNameRegex ? `video: "${filter.videoNameRegex}"` : ''
      }`
      : 'Invalid Filter')
  );
}
