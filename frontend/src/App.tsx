import SideBar from "./components/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/page/Home";
import About from "./features/page/About";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Profile from "./features/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
