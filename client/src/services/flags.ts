import axios from "axios";

import {
  CREATE_FLAG,
  GET_FLAGS,
  deleteFlagPath,
  toggleFlagPath,
  updateFlagPath,
} from "../constants/routes";
import { Flag, FlagUpdates, NewFlag } from "../types";

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
  fKey,
  isActive,
}: {
  fKey: string;
  isActive: boolean;
}): Promise<Flag> => {
  const { data } = await axios.patch<FlagResponse>(toggleFlagPath(fKey), {
    action: "toggle",
    payload: { isActive },
  });
  return data.payload;
};

export const createFlag = async (newFlag: NewFlag) => {
  const { data } = await axios.post<FlagResponse>(CREATE_FLAG, newFlag);
  return data.payload;
};

export const updateFlag = async (flagUpdate: FlagUpdates) => {
  const { data } = await axios.patch<FlagResponse>(
    updateFlagPath(flagUpdate.fKey),
    {
      action: "body update",
      payload: flagUpdate,
    },
  );
  return data.payload;
};

export const deleteFlag = async (fKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    deleteFlagPath(fKey),
  );
  return data.message;
};
