import { createContext, ReactNode, useContext, useState } from 'react';

export type SortKey = 'none' | 'priceAsc' | 'priceDesc' | 'timeAsc';

export interface Filters {
  search: string;
  categoryId: string; // '' = tất cả
  onlyAvailable: boolean;
  minPrice: string;
  maxPrice: string;
  sort: SortKey;
}

export const defaultFilters: Filters = {
  search: '',
  categoryId: '',
  onlyAvailable: false,
  minPrice: '',
  maxPrice: '',
  sort: 'none',
};

interface Ctx {
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  reset: () => void;
}

const FilterContext = createContext<Ctx>(null as unknown as Ctx);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setState] = useState<Filters>(defaultFilters);
  const setFilters = (patch: Partial<Filters>) => setState((prev) => ({ ...prev, ...patch }));
  const reset = () => setState(defaultFilters);
  return (
    <FilterContext.Provider value={{ filters, setFilters, reset }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => useContext(FilterContext);