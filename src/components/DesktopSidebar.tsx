import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { NavLink } from "../types";
import { classNames } from "../utils/classNames";

type DesktopSidebarProps = {
  navLinks: NavLink[];
  onCurrentLink: (name: string) => void;
};

export default function DesktopSidebar({
  navLinks,
  onCurrentLink,
}: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#23395b] px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-20 w-auto"
            src="../../public/logo-palette-5.png"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      onClick={() => onCurrentLink(item.name)}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-[#2D4A75] text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="mt-auto">
              <a
                href="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
