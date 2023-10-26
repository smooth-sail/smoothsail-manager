import { z } from "zod";
import { newFlagSchema } from "./models/flags";

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
  f_key: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
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

export type Rule = {
  r_key: string;
  a_key: string;
  type: "boolean" | "string" | "number";
  operator: string;
  value: boolean | string | number;
};
