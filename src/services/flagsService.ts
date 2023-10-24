import axios from "axios";
import { Flag } from "../types";

const BASE_URL = "http://localhost:3000";

export const fetchFlags = async (): Promise<Flag[]> => {
  const { data } = await axios.get<Flag[]>(`${BASE_URL}/api/flags`);
  return data;
};

export const fetchToggleFlag = async ({
  flagKey,
  is_active,
  id,
}: {
  flagKey: string;
  is_active: boolean;
  id: number;
}): Promise<Flag> => {
  const { data } = await axios.put<Flag>(`${BASE_URL}/api/flags/${id}`, {
    is_active,
  });
  return data;
};
