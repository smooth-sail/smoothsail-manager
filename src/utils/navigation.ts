import { HomeIcon, KeyIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Dashboard", href: "/flags", icon: HomeIcon, current: true },
  { name: "Segments", href: "/segments", icon: UserGroupIcon, current: false },
  { name: "SDK Key", href: "/key", icon: KeyIcon, current: false },
];
