import { z } from "zod";
import { newFlagSchema } from "./models/flags";
import { newSegmentSchema, segmentOperatorSchema } from "./models/segments";

export type NavLink = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  current: boolean;
};

export type Flag = {
  fKey: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type NewFlag = z.infer<typeof newFlagSchema>;

export type FlagUpdates = NewFlag;

export type Segment = {
  s_key: string;
  title: string;
  description?: string;
  rules_operator: string;
  rules: Rule[];
};

export type NewSegment = z.infer<typeof newSegmentSchema>;
export type SegmentUpdates = NewSegment;
export type SegmentOperator = z.infer<typeof segmentOperatorSchema>;

export type Rule = {
  r_key: string;
  a_key: string;
  operator: string;
  value: string;
};

export type Attribute = {
  name: string;
  a_key: string;
  type: "boolean" | "string" | "number";
};
