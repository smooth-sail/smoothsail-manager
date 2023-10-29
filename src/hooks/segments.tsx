import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSegmentsRule,
  createSegment,
  deleteSegment,
  deleteSegmentsRule,
  getFlagsSegments,
  getSegments,
  updateFlagsSegment,
  updateSegment,
} from "../services/segments";

export const useSegments = () => {
  return useQuery({ queryKey: ["segments"], queryFn: getSegments });
};

export const useCreateSegmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
    // need to add optimistic updates
  });
};

export const useFlagsSegments = (f_key: string) => {
  return useQuery({
    queryKey: ["segments", f_key],
    queryFn: () => getFlagsSegments(f_key),
  });
};

export const useUpdateFlagsSegmentMutation = (f_key: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFlagsSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments", f_key] });
    },
  });
};

export const useUpdateSegmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
    // need to add optimistic updates
  });
};

export const useDeleteSegmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["segments"],
        refetchType: "all",
      });
    },
  });
};

export const useAddSegmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSegmentsRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
};

export const useDeleteSegmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSegmentsRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
};
