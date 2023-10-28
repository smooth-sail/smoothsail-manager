import { useQuery } from "@tanstack/react-query";
import { getAttributes } from "../services/attributes";

export const useAttributes = () => {
  return useQuery({ queryKey: ["attributes"], queryFn: getAttributes });
};
