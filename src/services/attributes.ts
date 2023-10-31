import axios from "axios";
import { Attribute } from "../types";
import {
  CREATE_ATTRIBUTE,
  GET_ATTRIBUTES,
  deleteAttributePath,
  updateAttributePath,
} from "../constants/routes";

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

export const createAttribute = async (newAttribute: Attribute) => {
  const { data } = await axios.post<AttributeResponse>(
    CREATE_ATTRIBUTE,
    newAttribute,
  );
  return data.payload;
};

type AttributeUpdate = Omit<Attribute, "type">;

export const updateAttribute = async ({ name, aKey }: AttributeUpdate) => {
  const { data } = await axios.put<AttributeResponse>(
    updateAttributePath(aKey),
    { aKey, name },
  );
  return data.payload;
};

export const deleteAttribute = async (aKey: string) => {
  const { data } = await axios.delete<{ message: string }>(
    deleteAttributePath(aKey),
  );
  return data.message;
};
