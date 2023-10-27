import axios from "axios";
import { NewSegment, Segment, SegmentUpdates } from "../types";
import {
  CREATE_SEGMENT,
  GET_SEGMENTS,
  deleteSegmentPath,
  flagsSegmentsPath,
  updateFlagsSegmentsPath,
  updateSegmentPath,
} from "../constants/routes";

type AllSegmentsResponse = {
  payload: Segment[];
};

type UpdateFlagsSegmentsResponse = {
  s_key: string;
};

type SegmentResponse = {
  payload: Segment;
};

export const getSegments = async (): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(GET_SEGMENTS);
  return data.payload;
};

export const createSegment = async (newSegment: NewSegment) => {
  const { data } = await axios.post<SegmentResponse>(
    CREATE_SEGMENT,
    newSegment,
  );
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

export const updateSegment = async (segmentUpdates: SegmentUpdates) => {
  const { data } = await axios.patch<SegmentResponse>(
    updateSegmentPath(segmentUpdates.s_key),
    {
      action: "body update",
      payload: segmentUpdates,
    },
  );
  return data.payload;
};

export const deleteSegment = async (segmentKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    deleteSegmentPath(segmentKey),
  );
  return data.message;
};
