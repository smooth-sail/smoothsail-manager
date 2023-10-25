import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createFlag,
  deleteFlag,
  getFlags,
  toggleFlag,
} from "../services/flagsService";

export const useFlags = () => {
  return useQuery({ queryKey: ["flags"], queryFn: getFlags });
};

export const useCreateFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFlag,
    onSuccess: () => {
      queryClient.invalidateQueries(["flags"]);
    },
    // need to add optimistic updates
  });
};

export const useFlagToggleMutation = () => {
  return useMutation({
    mutationFn: toggleFlag,
    onSuccess: () => {},
  });
};

export const useDeleteFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlag,
    onSuccess: () => {
      queryClient.invalidateQueries(["flags"]);
    },
  });
};
