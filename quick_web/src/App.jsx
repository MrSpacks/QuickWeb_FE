import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicCard from "./pages/PublicCard/PublicCard";
import { AuthProvider } from "./context/AuthProvider";
import About_as from "./pages/About_us/About_us";
import Contact from "./pages/Contact/Contact";

import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:slug" element={<PublicCard />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/about" element={<About_as />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
