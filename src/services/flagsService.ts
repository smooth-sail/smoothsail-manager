import axios from "axios";
import { Flag, NewFlag } from "../types";

const BASE_URL = "http://localhost:3000";

type AllFlagsResponse = {
  payload: Flag[];
};

type FlagResponse = {
  payload: Flag;
};

export const getFlags = async (): Promise<Flag[]> => {
  const { data } = await axios.get<AllFlagsResponse>(`${BASE_URL}/api/flags`);
  return data.payload;
};

export const toggleFlag = async ({
  flagKey,
  is_active,
}: {
  flagKey: string;
  is_active: boolean;
}): Promise<Flag> => {
  const { data } = await axios.patch<FlagResponse>(
    `${BASE_URL}/api/flags/${flagKey}`,
    {
      action: "toggle",
      payload: { is_active },
    },
  );
  return data.payload;
};

export const createFlag = async (newFlag: NewFlag) => {
  const { data } = await axios.post<FlagResponse>(
    `${BASE_URL}/api/flags`,
    newFlag,
  );
  return data.payload;
};

export const deleteFlag = async (flagKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    `${BASE_URL}/api/flags/${flagKey}`,
  );
  return data.message;
};
