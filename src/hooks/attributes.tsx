import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAttribute,
  deleteAttribute,
  getAttributes,
  updateAttribute,
} from "../services/attributes";

export const useAttributes = () => {
  return useQuery({ queryKey: ["attributes"], queryFn: getAttributes });
};

export const useCreateAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

export const useDeleteAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

export const useUpdateAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};
