import axios from "axios";
import { Flag, FlagUpdates, NewFlag } from "../types";
import {
  CREATE_FLAG,
  GET_FLAGS,
  deleteFlagPath,
  toggleFlagPath,
  updateFlagPath,
} from "../constants/routes";

type AllFlagsResponse = {
  payload: Flag[];
};

type FlagResponse = {
  payload: Flag;
};

export const getFlags = async (): Promise<Flag[]> => {
  const { data } = await axios.get<AllFlagsResponse>(GET_FLAGS);
  return data.payload;
};

export const toggleFlag = async ({
  flagKey,
  is_active,
}: {
  flagKey: string;
  is_active: boolean;
}): Promise<Flag> => {
  const { data } = await axios.patch<FlagResponse>(toggleFlagPath(flagKey), {
    action: "toggle",
    payload: { is_active },
  });
  return data.payload;
};

export const createFlag = async (newFlag: NewFlag) => {
  const { data } = await axios.post<FlagResponse>(CREATE_FLAG, newFlag);
  return data.payload;
};

export const updateFlag = async (flagUpdate: FlagUpdates) => {
  const { data } = await axios.patch<FlagResponse>(
    updateFlagPath(flagUpdate.f_key),
    {
      action: "body update",
      payload: flagUpdate,
    },
  );
  return data.payload;
};

export const deleteFlag = async (flagKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    deleteFlagPath(flagKey),
  );
  return data.message;
};
