import { SearchContext } from "@/services/context";
import { useContext, useEffect } from "react";

export const useSearch = () => {
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, [setSearch]);

  return { search };
};
