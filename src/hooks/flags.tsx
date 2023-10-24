import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchCreateFlag,
  fetchFlags,
  fetchToggleFlag,
} from "../services/flagsService";

export const useFlags = () => {
  return useQuery({ queryKey: ["flags"], queryFn: fetchFlags });
};

export const useCreateFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchCreateFlag,
    onSuccess: () => {
      queryClient.invalidateQueries(["flags"]);
    },
    // need to add optimistic updates
  });
};

export const useFlagToggleMutation = () => {
  return useMutation({
    mutationFn: fetchToggleFlag,
    onSuccess: () => {},
  });
};
