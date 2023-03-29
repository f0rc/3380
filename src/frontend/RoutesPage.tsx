import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { AuthContext } from "./auth/SessionProvider";
import { CreateEmployee } from "./pages/CreateEmployee";
import CreatePackage from "./pages/CreatePackage";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PackageDetail from "./pages/PackageDetail";
import PackageList from "./pages/PackageList";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const RoutesPage = () => {
  const { authenticated } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="package-list" element={<PackageList />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          {authenticated?.user?.role && authenticated.user.role >= 1 && (
            <>
              <Route path="create-package" element={<CreatePackage />} />

              <Route path="create-employee" element={<CreateEmployee />} />
            </>
          )}
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </>
  );
};

export default RoutesPage;
