const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export const GET_FLAGS = `${BASE_URL}/api/flags`;

export const CREATE_FLAG = `${BASE_URL}/api/flags`;

export const toggleFlagPath = (f_key: string) =>
  `${BASE_URL}/api/flags/${f_key}`;

export const deleteFlagPath = (f_key: string) =>
  `${BASE_URL}/api/flags/${f_key}`;

export const updateFlagPath = (f_key: string) =>
  `${BASE_URL}/api/flags/${f_key}`;
