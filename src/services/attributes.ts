import axios from "axios";
import { Attribute } from "../types";
import { GET_ATTRIBUTES } from "../constants/routes";

type AllAttributesResponse = {
  payload: Attribute[];
};

type AttributeResponse = {
  payload: Attribute;
};

export const getAttributes = async (): Promise<Attribute[]> => {
  const { data } = await axios.get<AllAttributesResponse>(GET_ATTRIBUTES);
  return data.payload;
};
