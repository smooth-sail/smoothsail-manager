import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getFlagsSegments,
  getSegments,
  updateFlagsSegment,
} from "../services/segmentsService";

export const useSegments = () => {
  return useQuery({ queryKey: ["segments"], queryFn: getSegments });
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
