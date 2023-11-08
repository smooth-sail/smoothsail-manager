import { Link, useLocation } from "react-router-dom";

import { classNames } from "@/utils/helpers";
import { navigation as navLinks } from "@/utils/data";

function DesktopSidebar() {
  const path = useLocation().pathname;

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-ss-bl from-30% via-[#365A8F] via-60% to-[#406AA8] to-90% px-6 pb-4">
        <div className="mt-4 flex h-16 shrink-0 items-center">
          <img
            className="h-28 w-auto"
            src="/smooth-sail-transparent.png"
            alt="Smooth Sail"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={classNames(
                        item.href === path ||
                          (path === "/" && item.name === "Dashboard")
                          ? "bg-[#2D4A75] text-white"
                          : "text-gray-400 hover:text-white hover:bg-[#2D4A75]",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold focus:outline-none focus:outline-[#2D4A75]",
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
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default DesktopSidebar;
