export const INTERNAL = "Internal error occurred.";
export const noFlagErrorMsg = (id) => `Flag with id ${id} does not exist.`;
export const VALIDATION =
  "Validation error occurred. Correct your request and try again.";
export const noSegmErrorMsg = (id) => `Segment with id ${id} does not exist.`;
export const noAttrErrorMsg = (id) => `Attribute with id ${id} does not exist.`;
export const noRuleErrorMsg = (id) => `Rule with id ${id} does not exist.`;
export const segmRefFlagErr = (id, flagKeys) =>
  `Segment ${id} is referenced by flag(s) with following fKeys: ${flagKeys.join(
    ", "
  )}. Remove it from a flag and try again.`;
export const UNSUPPORTED_ACTION =
  "Validation error occurred. This action is not supported.";
export const DUPLICATE_ENTRY = "Validation error occured. Duplicate entry.";
