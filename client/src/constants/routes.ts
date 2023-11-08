/* Flags */

export const GET_FLAGS = "/api/flags";

export const CREATE_FLAG = "/api/flags";

export const toggleFlagPath = (fKey: string) => `/api/flags/${fKey}`;

export const deleteFlagPath = (fKey: string) => `/api/flags/${fKey}`;

export const updateFlagPath = (fKey: string) => `/api/flags/${fKey}`;

export const updateFlagsSegmentsPath = (fKey: string) => `/api/flags/${fKey}`;

/* Segments */

export const GET_SEGMENTS = "/api/segments";

export const CREATE_SEGMENT = "/api/segments";

export const flagsSegmentsPath = (fKey: string) => `/api/segments?fKey=${fKey}`;

export const updateSegmentPath = (sKey: string) => `/api/segments/${sKey}`;

export const deleteSegmentPath = (sKey: string) => `/api/segments/${sKey}`;

/* Attributes */

export const GET_ATTRIBUTES = "/api/attributes";

export const CREATE_ATTRIBUTE = "/api/attributes";

export const updateAttributePath = (aKey: string) => `/api/attributes/${aKey}`;

export const deleteAttributePath = (aKey: string) => `/api/attributes/${aKey}`;

/* SDK */

export const GET_KEY = "/key";

export const REGENERATE_KEY = "/key/generate";
