import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createSegment,
  getFlagsSegments,
  getSegments,
  updateFlagsSegment,
  updateSegment,
} from "../services/segmentsService";

export const useSegments = () => {
  return useQuery({ queryKey: ["segments"], queryFn: getSegments });
};

export const useCreateSegmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries(["segments"]);
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
      queryClient.invalidateQueries(["segments", f_key]);
    },
  });
};

export const useUpdateSegmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSegment,
    onSuccess: () => {
      queryClient.invalidateQueries(["segments"]);
    },
    // need to add optimistic updates
  });
};
