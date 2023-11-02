import {
  HomeIcon,
  KeyIcon,
  UserGroupIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "../types";

export const navigation: NavLink[] = [
  { name: "Dashboard", href: "/flags", icon: HomeIcon, current: false },
  { name: "Segments", href: "/segments", icon: UserGroupIcon, current: false },
  {
    name: "Attributes",
    href: "/attributes",
    icon: TableCellsIcon,
    current: false,
  },
  { name: "SDK Key", href: "/key", icon: KeyIcon, current: false },
];

export const segmentRulesOperators = [
  {
    name: "Any",
    description: "Return true if any of the rules return true",
  },
  {
    name: "All",
    description: "Return true if all of the rules return true",
  },
];

export const attributeTypes = ["boolean", "string", "number"] as const;

export const operators = [
  "is",
  "is not",
  "contains",
  "does not contain",
  "exists",
  "does not exist",
  "=",
  "!=",
  ">=",
  "<=",
];

export const stringOperators = [
  "is",
  "is not",
  "contains",
  "does not contain",
  "=",
  "!=",
] as const;

export const numberOperators = ["=", "!=", ">=", "<="] as const;

export const booleanOperators = ["is", "is not", "=", "!="] as const;
