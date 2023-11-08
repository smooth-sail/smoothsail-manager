import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import DesktopSidebar from "@/components/DesktopSidebar";
import Header from "@/components/Header";
import MobileSidebar from "@/components/MobileSidebar";

import FlagsTable from "@/pages/FlagsTable";
import NotFound from "@/pages/NotFound";
import SegmentsTable from "@/pages/SegmentsTable";
import AttributesTable from "@/pages/AttributesTable";
import SDKKey from "@/pages/SDKKey";

function App() {
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
              <Route path="/attributes" element={<AttributesTable />} />
              <Route path="/sdk" element={<SDKKey />} />
              <Route path="/" element={<FlagsTable />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </main>
      </div>
    </div>
  );
}

export default App;
