import axios from "axios";
import { Segment } from "../types";

const BASE_URL = "http://localhost:3000";

type AllSegmentsResponse = {
  payload: Segment[];
};

export const getSegments = async (): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(
    `${BASE_URL}/api/segments`,
  );
  return data.payload;
};

export const getFlagsSegments = async (f_key: string): Promise<Segment[]> => {
  const { data } = await axios.get<AllSegmentsResponse>(
    `${BASE_URL}/api/segments?f_key=${f_key}`,
  );
  return data.payload;
};
