import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/sign_in";
import SignUp from "../pages/sign_up";
import Home from "../pages/home";
import Profile from "../pages/profile";
import ForgotPassword from "../pages/forgotPassword";




const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign_in" replace />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />



      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;