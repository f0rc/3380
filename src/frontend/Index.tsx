import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { api } from "src/server/utils/api";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";
import { CreateEmployee } from "./pages/CreateEmployee";
import CreatePackage from "./pages/CreatePackage";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PackageList from "./pages/PackageList";
import Signup from "./pages/Signup";
import Products from "./pages/product/Products";

const Index = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="create-package" element={<CreatePackage />} />
            <Route path="package-list" element={<PackageList />} />
            <Route path="create-employee" element={<CreateEmployee />} />
            <Route path="products" element={<Products />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
};

export default Index;
