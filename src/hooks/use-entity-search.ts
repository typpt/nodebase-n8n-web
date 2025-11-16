import { PAGINATION } from '@/constant/pagination';
import { useEffect, useState } from 'react';

type ParamsProps = {
  page: number;
  search: string;
};

type UseEntitySearchProps<T extends ParamsProps> = {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
};

export function useEntitySearch<T extends ParamsProps>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (params.search !== localSearch) {
        setParams({
          ...params,
          page: PAGINATION.DEFAULT_PAGE,
          search: localSearch,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, debounceMs, params, setParams]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
