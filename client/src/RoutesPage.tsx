import { useContext, useEffect } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Session } from "../../server/trpc/auth/auth";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";
import { CreateEmployee } from "./pages/employee/CreateEmployee";
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
import Dashboard from "./pages/Reports/Dashboard";
import WorkLog from "./pages/WorkLog";
import ListProducts from "./pages/products/ListProducts";
import { ProductDetail } from "./pages/products/ProductDetail";
import { Products } from "./pages/products/Products";
import ProductTable from "./pages/ProductTable";
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
  { path: "store", element: <Products />, label: "Store", isNav: true },
  {
    path: "/product/:id",
    element: <ProductDetail />,
    label: "Product",
    isNav: false,
  },
];

const loggedRoutes = [
  {
    path: "package-list",
    element: <PackageList />,
    label: "My Packages",
    isNav: true,
  },
];
const driverRoutes = [
  {
    path: "work-log",
    element: <WorkLog />,
    label: "Work Log",
    isNav: true,
  },
];
const clerkRoutes = [
  {
    path: "create-package",
    element: <CreatePackage />,
    label: "Manage Packages",
    isNav: true,
  },
  {
    path: "work-log",
    element: <WorkLog />,
    label: "Work Log",
    isNav: true,
  },
];
const managerRoutes = [
  {
    path: "create-employee",
    element: <CreateEmployee />,
    label: "Create Employee",
    isNav: false,
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
    label: "Manage Employee",
    isNav: true,
  },
  {
    path: "add-product",
    element: <AddProduct />,
    label: "Manage Products",
    isNav: false,
  },
];

const managerOnlyRoutes = [
  {
    path: "product-list",
    element: <ProductTable />,
    label: "Manage Products",
    isNav: true,
  },
];
const ceoRoutes = [
  {
    path: "add-location",
    element: <AddLocation />,
    label: "Add Location",
    isNav: false,
  },
  {
    path: "locations",
    element: <ListLocations />,
    label: "Locations",
    isNav: true,
  },
  {
    path: "location/:id",
    element: <LocationDetail />,
    label: "Locations",
    isNav: false,
  },
  {
    path: "/reports",
    element: <Dashboard />,
    label: "Reports",
    isNav: true,
  },
];

export function availableRoutes(auth: Session | null) {
  switch (auth?.user?.role) {
    case 0:
      return [...baseRoutes, ...loggedRoutes];
    case 1:
      return [...baseRoutes, ...loggedRoutes, ...clerkRoutes];
    case 2:
      return [...baseRoutes, ...loggedRoutes, ...driverRoutes]; // TODO DRIVER ROLES
    case 3:
      return [
        ...baseRoutes,
        ...loggedRoutes,
        ...clerkRoutes,
        ...managerRoutes,
        ...managerOnlyRoutes,
      ];
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
