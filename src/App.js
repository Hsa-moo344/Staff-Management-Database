import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Attendance from "./components/Attendance";
import AddStaff from "./components/AddStaff";
import Staffdatabase from "./components/staffdatabase";
import Profile from "./components/Profile";
import Individual from "./components/Individual";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* New Routes */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/staffdatabase" element={<Staffdatabase />} />
        <Route path="/individual" element={<Individual />} />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
