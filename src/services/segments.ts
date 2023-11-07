import axios from "axios";

import {
  CREATE_SEGMENT,
  GET_SEGMENTS,
  deleteSegmentPath,
  flagsSegmentsPath,
  updateFlagsSegmentsPath,
  updateSegmentPath,
} from "../constants/routes";
import { NewSegment, Rule, Segment, SegmentUpdates } from "../types";

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

export const getFlagsSegments = async (fKey: string): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(
    flagsSegmentsPath(fKey),
  );
  return data.payload;
};

export const updateFlagsSegment = async ({
  sKey,
  fKey,
  action,
}: {
  sKey: string;
  fKey: string;
  action: string;
}) => {
  const { data } = await axios.patch<UpdateFlagsSegmentsResponse>(
    updateFlagsSegmentsPath(fKey),
    {
      action,
      payload: { sKey },
    },
  );
  return data.s_key;
};

export const updateSegment = async (segmentUpdates: SegmentUpdates) => {
  const { data } = await axios.patch<SegmentResponse>(
    updateSegmentPath(segmentUpdates.sKey),
    {
      action: "body update",
      payload: segmentUpdates,
    },
  );
  return data.payload;
};

export const deleteSegment = async (sKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    deleteSegmentPath(sKey),
  );
  return data.message;
};

type RuleResponse = {
  payload: Rule;
};

type AddRuleData = {
  aKey: string;
  operator: string;
  value: string;
  sKey: string;
};

export const addSegmentsRule = async ({
  aKey,
  operator,
  value,
  sKey,
}: AddRuleData) => {
  const { data } = await axios.patch<RuleResponse>(updateSegmentPath(sKey), {
    action: "rule add",
    payload: {
      aKey,
      operator,
      value,
    },
  });
  return data.payload;
};

type RemoveRuleData = {
  sKey: string;
  rKey: string;
};

export const deleteSegmentsRule = async ({ sKey, rKey }: RemoveRuleData) => {
  const { data } = await axios.patch<{ message: string }>(
    updateSegmentPath(sKey),
    {
      action: "rule remove",
      payload: {
        rKey,
      },
    },
  );
  return data.message;
};

export const updateSegmentsRule = async ({
  aKey,
  operator,
  value,
  sKey,
  rKey,
}: AddRuleData & { rKey: string }) => {
  const { data } = await axios.patch<RuleResponse>(updateSegmentPath(sKey), {
    action: "rule update",
    payload: {
      aKey,
      rKey,
      operator,
      value,
    },
  });
  return data.payload;
};
