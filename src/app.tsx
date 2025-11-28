import { Routes, Route } from "react-router-dom";

import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Staff } from "@/components/staff";
import { Footer } from "@/components/footer";

const App = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black text-blue-50">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/staff" element={<Staff />} />
          {/* Fallback to home for unknown routes */}
          <Route path="*" element={<Hero />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;