import { GET_KEY } from "@/constants/routes";
import axios from "axios";

type KeyResponse = {
  payload: string;
};

export const getKey = async (): Promise<string> => {
  const { data } = await axios.get<KeyResponse>(GET_KEY);
  return data.payload;
};
