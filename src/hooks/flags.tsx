import { useMutation, useQuery } from "react-query";
import { fetchFlags, fetchToggleFlag } from "../services/flagsService";

export const useFlags = () => {
  return useQuery({ queryKey: ["flags"], queryFn: fetchFlags });
};

export const useFlagToggleMutation = () => {
  return useMutation({
    mutationFn: fetchToggleFlag,
    onSuccess: () => {},
  });
};
