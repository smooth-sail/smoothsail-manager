import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFlag,
  deleteFlag,
  getFlags,
  toggleFlag,
  updateFlag,
} from "../services/flags";

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
  });
};

export const useUpdateFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });
};

export const useFlagToggleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
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
