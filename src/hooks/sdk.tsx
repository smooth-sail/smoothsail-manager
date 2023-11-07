import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getKey, regenerateKey } from "@/services/sdk";

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
