import { useContext, useEffect } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Session } from "../../server/trpc/auth/auth";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";
import { CreateEmployee } from "./pages/CreateEmployee";
import CreatePackage from "./pages/CreatePackage";
import Employee from "./pages/employee/Employee";
import EmployeeDetail from "./pages/employee/EmployeeDetail";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PackageDetail from "./pages/PackageDetail";
import PackageList from "./pages/PackageList";
import { AddLocation } from "./pages/postoffice/AddLocation";
import ListLocations from "./pages/postoffice/ListLocation";
import LocationDetail from "./pages/postoffice/LocationDetail";
import { AddProduct } from "./pages/products/AddProduct";

import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const baseRoutes = [
  { path: "/", index: true, element: <Home />, label: "Home", isNav: true },
  { path: "signup", element: <Signup />, label: "Signup", isNav: false },
  { path: "login", element: <Login />, label: "Login", isNav: false },
  { path: "profile", element: <Profile />, label: "Profile", isNav: false },
  {
    path: "/package/:id",
    element: <PackageDetail />,
    label: "Package",
    isNav: false,
  },
];

const loggedRoutes = [
  {
    path: "package-list",
    element: <PackageList />,
    label: "Packages",
    isNav: true,
  },
];
// const driverRoutes = []; // todo
const clerkRoutes = [
  {
    path: "create-package",
    element: <CreatePackage />,
    label: "Create Package",
    isNav: true,
  },
];
const managerRoutes = [
  {
    path: "create-employee",
    element: <CreateEmployee />,
    label: "Create Employee",
    isNav: true,
  },
  {
    path: "employee/:id",
    element: <EmployeeDetail />,
    label: "employee detail",
    isNav: false,
  },
  {
    path: "employee-list",
    element: <Employee />,
    label: "Employee List",
    isNav: true,
  },
  {
    path: "add-product",
    element: <AddProduct />,
    label: "Add Product",
    isNav: true,
  },
];
const ceoRoutes = [
  {
    path: "add-location",
    element: <AddLocation />,
    label: "Add Location",
    isNav: true,
  },
  {
    path: "locations",
    element: <ListLocations />,
    label: "Locations",
    isNav: false,
  },
  {
    path: "location/:id",
    element: <LocationDetail />,
    label: "Locations",
    isNav: false,
  },
];

export function availableRoutes(auth: Session | null) {
  switch (auth?.user?.role) {
    case 0:
      return [...baseRoutes, ...loggedRoutes];
    case 1:
      return [...baseRoutes, ...loggedRoutes, ...clerkRoutes];
    case 2:
      return [...baseRoutes, ...loggedRoutes]; // TODO DRIVER ROLES
    case 3:
      return [...baseRoutes, ...loggedRoutes, ...clerkRoutes, ...managerRoutes];
    case 4:
      return [
        ...baseRoutes,
        ...loggedRoutes,
        ...clerkRoutes,
        ...managerRoutes,
        ...ceoRoutes,
      ]; // TODO CEO ROLES
    default:
      return baseRoutes;
  }
}

const RoutesPage = () => {
  const { authenticated } = useContext(AuthContext);

  const routes = useRoutes([
    ...availableRoutes(authenticated),
    { path: "*", element: <Error /> },
  ]);

  return (
    <>
      <Layout />
      {routes}
    </>
  );
};

export default RoutesPage;
