import {
  HomeIcon,
  KeyIcon,
  UserGroupIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Dashboard", href: "/flags", icon: HomeIcon, current: true },
  { name: "Segments", href: "/segments", icon: UserGroupIcon, current: false },
  {
    name: "Attributes",
    href: "/attributes",
    icon: TableCellsIcon,
    current: false,
  },
  { name: "SDK Key", href: "/key", icon: KeyIcon, current: false },
];
