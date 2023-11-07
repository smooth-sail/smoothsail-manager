import { getKey, regenerateKey } from "@/services/sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useKey = () => {
  return useQuery({ queryKey: ["key"], queryFn: getKey });
};

export const useGenerateKeyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["key"] });
    },
  });
};
