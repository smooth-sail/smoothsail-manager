const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

/* Flags */

export const GET_FLAGS = `${BASE_URL}/api/flags`;

export const CREATE_FLAG = `${BASE_URL}/api/flags`;

export const toggleFlagPath = (fKey: string) => `${BASE_URL}/api/flags/${fKey}`;

export const deleteFlagPath = (fKey: string) => `${BASE_URL}/api/flags/${fKey}`;

export const updateFlagPath = (fKey: string) => `${BASE_URL}/api/flags/${fKey}`;

export const updateFlagsSegmentsPath = (fKey: string) =>
  `${BASE_URL}/api/flags/${fKey}`;

/* Segments */

export const GET_SEGMENTS = `${BASE_URL}/api/segments`;

export const CREATE_SEGMENT = `${BASE_URL}/api/segments`;

export const flagsSegmentsPath = (fKey: string) =>
  `${BASE_URL}/api/segments?fKey=${fKey}`;

export const updateSegmentPath = (sKey: string) =>
  `${BASE_URL}/api/segments/${sKey}`;

export const deleteSegmentPath = (sKey: string) =>
  `${BASE_URL}/api/segments/${sKey}`;

/* Attributes */

export const GET_ATTRIBUTES = `${BASE_URL}/api/attributes`;

export const CREATE_ATTRIBUTE = `${BASE_URL}/api/attributes`;

export const updateAttributePath = (aKey: string) =>
  `${BASE_URL}/api/attributes/${aKey}`;

export const deleteAttributePath = (aKey: string) =>
  `${BASE_URL}/api/attributes/${aKey}`;

/* SDK */

export const GET_KEY = `${BASE_URL}/key`;

export const REGENERATE_KEY = `${BASE_URL}/key/generate`;
