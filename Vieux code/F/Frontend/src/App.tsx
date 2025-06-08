import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Appartements from "./pages/Appartements";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar ici plus tard */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appartements" element={<Appartements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
