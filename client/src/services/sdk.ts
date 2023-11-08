import axios from "axios";

import { GET_KEY, REGENERATE_KEY } from "@/constants/routes";

type KeyResponse = {
  payload: string;
};

export const getKey = async (): Promise<string> => {
  const { data } = await axios.get<KeyResponse>(GET_KEY);
  return data.payload;
};

export const regenerateKey = async (): Promise<string> => {
  const { data } = await axios.post<KeyResponse>(REGENERATE_KEY);
  return data.payload;
};
