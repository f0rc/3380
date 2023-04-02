import { useContext, useMemo } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/SessionProvider";
import { trpc } from "../utils/trpc";

const Layout = () => {
  const navigatr = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const extendedNav = useMemo(() => {
    if (authenticated) {
      return true;
    }
    return false;
  }, [authenticated]);

  const availableRoutes = (user: typeof authenticated) => {
    if (user?.user?.role === 1) {
      // user is clerk
      return (
        <>
          <li>
            <NavLink
              to="/create-package"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Create Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/package-list"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Packages
            </NavLink>
          </li>
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
          <li>
            <NavLink
              to="/package-list"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Packages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-package"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Create Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-employee"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Create Employee
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-product"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Add Product
            </NavLink>
          </li>
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
          <li>
            <NavLink
              to="/create-package"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Create Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-employee"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Create Employee
            </NavLink>
          </li>
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
    // default logged in user routes
    if (user?.expires) {
      return (
        <>
          <li>
            <NavLink
              to="/package-list"
              reloadDocument={true}
              className={({ isActive }) =>
                isActive ? "navItemActive" : "navInactive"
              }
            >
              Packages
            </NavLink>
          </li>
        </>
      );
    }
  };

  // handle login logout

  const { mutateAsync } = trpc.auth.logout.useMutation({
    onSuccess: (data) => {
      console.log("logged out", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleLogout = async () => {
    localStorage.removeItem("auth-session-id");
    const result = await mutateAsync();
    if (result.status == "success") {
      navigatr("/login");
      window.location.reload();
    } else {
      console.log("error", result);
    }
  };

  return (
    <>
      <nav className="px-2 py-2.5 w-full border-b border-gray-600 sticky top-0 z-20 max-h-20 backdrop-blur-md">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap ">
              [MAIL]
            </span>
          </a>
          <div className="flex order-2">
            {authenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="focus:ring-4 focus:outline-none font-lg rounded-lg text-sm px-5 py-2.5 text-center mr-0 hover:bg-[#cfdbd5] hover:text-black  border-b border-[#dfe22c] ring-[#dfe22c]"
              >
                logout
              </button>
            ) : (
              <Link
                to="/login"
                className="focus:ring-4 focus:outline-none font-lg rounded-lg text-sm px-5 py-2 text-center mr-0  hover:bg-[#cfdbd5] hover:text-black border-b border-[#dfe22c] ring-[#dfe22c]"
              >
                login
              </Link>
            )}
          </div>
          <div
            className="items-center justify-between flex w-auto order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col rounded-lg md:flex-row space-x-8 mt-0 text-lg font-medium">
              {/* public nav items */}
              <li>
                <NavLink
                  to="/"
                  reloadDocument={true}
                  className={({ isActive }) =>
                    isActive ? "navItemActive" : "navInactive"
                  }
                >
                  Home
                </NavLink>
              </li>

              {/* Clerk nav items */}

              <>
                {extendedNav ? allloggedRoutes(authenticated) : null}
                {extendedNav ? availableRoutes(authenticated) : null}
              </>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
