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
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    if (params.search !== '' && localSearch === '') {
      setParams({
        ...params,
        page: PAGINATION.DEFAULT_PAGE,
        search: '',
      });
      return;
    }

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
  }, [debounceMs, localSearch, params, setParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
