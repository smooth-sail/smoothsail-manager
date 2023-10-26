import { useQuery } from "react-query";
import { getFlagsSegments, getSegments } from "../services/segmentsService";

export const useSegments = () => {
  return useQuery({ queryKey: ["segments"], queryFn: getSegments });
};

export const useFlagsSegments = (f_key: string) => {
  return useQuery({
    queryKey: ["segments", f_key],
    queryFn: () => getFlagsSegments(f_key),
  });
};
