import { useState } from "react";
import DesktopSidebar from "./components/DesktopSidebar";
import Header from "./components/Header";
import MobileSidebar from "./components/MobileSidebar";
import { Route, Routes } from "react-router-dom";
import FlagsTable from "./pages/FlagsTable";
import NotFound from "./pages/NotFound";
import { navigation } from "./utils/navigation";
import { NavLink } from "./types";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>(navigation);
  const handleCurrentLink = (name: string) => {
    setNavLinks(
      navLinks.map((link) => {
        if (link.name === name) {
          link.current = true;
        } else {
          link.current = false;
        }
        return link;
      }),
    );
  };

  return (
    <>
      <div>
        <MobileSidebar
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          navLinks={navLinks}
          onCurrentLink={handleCurrentLink}
        />
        <DesktopSidebar navLinks={navLinks} onCurrentLink={handleCurrentLink} />
        <div className="lg:pl-72">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/flags" element={<FlagsTable />} />
                <Route path="/" element={<FlagsTable />} />
                <Route
                  path="*"
                  element={<NotFound onCurrentLink={handleCurrentLink} />}
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
