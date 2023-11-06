import { AttributeTypes } from "@/types";
import { booleanOperators, numberOperators, stringOperators } from "./data";
import { ErrorOption } from "react-hook-form";

export const getValidOperators = (dataType: AttributeTypes) => {
  const operators = {
    string: stringOperators,
    number: numberOperators,
    boolean: booleanOperators,
  };

  return operators[dataType];
};

type RHKSetErrorFunc = (
  name: "value" | "sKey" | "attribute" | "operator" | `root.${string}` | "root",
  error: ErrorOption,
  options?:
    | {
        shouldFocus: boolean;
      }
    | undefined,
) => void;

export const isValidRuleValue = (
  type: AttributeTypes,
  value: string,
  operator: string,
  setError: RHKSetErrorFunc,
) => {
  if (operator === "exists" || operator === "does not exist") return true;

  switch (type) {
    case "boolean":
      if (value !== "true" && value !== "false") {
        setError("value", { message: "Must be true or false" });
        return false;
      }
      break;
    case "number":
      if (!value || Number.isNaN(Number(value))) {
        setError("value", { message: "The value must be a number" });
        return false;
      }
      break;
    case "string":
      if (!value) {
        setError("value", { message: "Value is required" });
        return false;
      }
      break;
  }

  return true;
};
