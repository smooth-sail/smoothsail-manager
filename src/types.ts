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

export type NewFlag = {
  f_key: string;
  title: string;
  description?: string;
};
