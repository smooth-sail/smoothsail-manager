import { useContext, useEffect } from "react";

import { SearchContext } from "@/services/context";

export const useSearch = () => {
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, [setSearch]);

  return { search };
};
