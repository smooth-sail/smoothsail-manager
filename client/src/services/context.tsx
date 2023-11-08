import { ReactNode, createContext, useState } from "react";

type SearchContextProviderProps = {
  children: ReactNode;
};

export const SearchContext = createContext<{
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}>({ search: "", setSearch: () => {} });

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
