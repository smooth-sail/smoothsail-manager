import { useState } from "react";
import DesktopSidebar from "./components/DesktopSidebar";
import Header from "./components/Header";
import MobileSidebar from "./components/MobileSidebar";
import { Route, Routes } from "react-router-dom";
import FlagsTable from "./pages/FlagsTable";
import NotFound from "./pages/NotFound";
import SegmentsTable from "./pages/SegmentsTable";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <MobileSidebar
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <DesktopSidebar />
      <div className="lg:pl-72">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/flags" element={<FlagsTable />} />
              <Route path="/segments" element={<SegmentsTable />} />
              <Route path="/" element={<FlagsTable />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
