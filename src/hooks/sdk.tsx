import { getKey } from "@/services/sdk";
import { useQuery } from "@tanstack/react-query";

export const useKey = () => {
  return useQuery({ queryKey: ["key"], queryFn: getKey });
};
