import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";
import { CreateEmployee } from "./pages/CreateEmployee";
import CreatePackage from "./pages/CreatePackage";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PackageDetail from "./pages/PackageDetail";
import PackageList from "./pages/PackageList";
import { AddProduct } from "./pages/products/AddProduct";

import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const RoutesPage = () => {
  const { authenticated } = useContext(AuthContext);

  const availableRoutes = (user: typeof authenticated) => {
    if (user?.user?.role === 1) {
      // user is clerk
      return (
        <>
          <Route path="create-package" element={<CreatePackage />} />
          {/* <Route path="add-dependants" element={<TODO />} /> */}
          {/* <Route path="submit hours" element={<TODO />} /> */}
        </>
      );
    } else if (user?.user?.role === 2) {
      // user is driver
      return (
        <>
          {/* <Route path="add-dependants" element={<TODO />} /> */}
          {/* <Route path="submit hours" element={<TODO />} /> */}
        </>
      );
    } else if (user?.user?.role === 3) {
      // user is manager
      return (
        <>
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="create-package" element={<CreatePackage />} />
          <Route path="add-product" element={<AddProduct />} />
          {/* <Route path="CRUD PRODUCTS" element={<TODO />} /> */}
          {/* <Route path="VIEW REPORTS" element={<TODO />} /> */}
          {/* <Route path="add-dependants" element={<TODO />} /> */}
          {/* <Route path="submit hours" element={<TODO />} /> */}
        </>
      );
    } else if (user?.user?.role === 4) {
      // user is CEO
      return (
        <>
          {/* add the ability to chose manager as role */}
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="create-package" element={<CreatePackage />} />
          {/* <Route path="CRUD PRODUCTS" element={<TODO />} /> */}
          {/* <Route path="VIEW REPORTS" element={<TODO />} /> */}
          {/* <Route path="add-dependants" element={<TODO />} /> */}
          {/* <Route path="submit hours" element={<TODO />} /> */}
          {/* <Route path="CRUD OFFICE LOCATIONS" element={<TODO />} />  */}
        </>
      );
    }
  };

  const allloggedRoutes = (user: typeof authenticated) => {
    if (user?.user?.id) {
      return (
        <>
          <Route path="package-list" element={<PackageList />} />
          <Route path="package/:id" element={<PackageDetail />} />
        </>
      );
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />

          {availableRoutes(authenticated)}
          {allloggedRoutes(authenticated)}
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </>
  );
};

export default RoutesPage;
