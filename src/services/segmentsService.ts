import axios from "axios";
import { Segment } from "../types";
import {
  GET_SEGMENTS,
  flagsSegmentsPath,
  updateFlagsSegmentsPath,
} from "../constants/routes";

type AllSegmentsResponse = {
  payload: Segment[];
};

type UpdateFlagsSegmentsResponse = {
  s_key: string;
};

export const getSegments = async (): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(GET_SEGMENTS);
  return data.payload;
};

export const getFlagsSegments = async (f_key: string): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(
    flagsSegmentsPath(f_key),
  );
  return data.payload;
};

export const updateFlagsSegment = async ({
  segmentKey,
  flagKey,
  action,
}: {
  segmentKey: string;
  flagKey: string;
  action: string;
}) => {
  const { data } = await axios.patch<UpdateFlagsSegmentsResponse>(
    updateFlagsSegmentsPath(flagKey),
    {
      action,
      payload: { s_key: segmentKey },
    },
  );
  return data.s_key;
};
