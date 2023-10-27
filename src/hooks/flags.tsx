import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFlag,
  deleteFlag,
  getFlags,
  toggleFlag,
  updateFlag,
} from "../services/flagsService";

export const useFlags = () => {
  return useQuery({ queryKey: ["flags"], queryFn: getFlags });
};

export const useCreateFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
    // need to add optimistic updates
  });
};

export const useUpdateFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
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
      queryClient.invalidateQueries({
        queryKey: ["flags"],
        refetchType: "all",
      });
    },
  });
};
