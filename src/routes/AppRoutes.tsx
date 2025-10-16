import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/sign_in";
import SignUp from "../pages/sign_up";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign_in" replace />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/sign_up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;