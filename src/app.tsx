import { Routes, Route } from "react-router-dom";

import { About } from "@/components/about";
import { Apply } from "@/components/apply";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Story } from "@/components/story";

const App = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black text-blue-50">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/systems" element={<Features />} />
          <Route path="/school" element={<Story />} />
          <Route path="/join" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          {/* Fallback to home for unknown routes */}
          <Route path="*" element={<Hero />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;