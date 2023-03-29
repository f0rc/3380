import { useContext, useMemo } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "src/server/utils/api";

import { AuthContext } from "../auth/SessionProvider";

const Layout = () => {
  const navigatr = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const extendedNav = useMemo(() => {
    if (authenticated) {
      return true;
    }
    return false;
  }, [authenticated]);

  // handle login logout

  const { mutateAsync } = api.auth.logout.useMutation({
    onSuccess: (data) => {
      console.log("logged out", data);
    },
  });

  const handleLogout = async () => {
    localStorage.removeItem("auth-session-id");
    const result = await mutateAsync();
    if (result.status == "success") {
      navigatr("/login");
      window.location.reload();
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
              {/* Clerk nav items */}

              {extendedNav ? (
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
                      to="/create-employee"
                      reloadDocument={true}
                      className={({ isActive }) =>
                        isActive ? "navItemActive" : "navInactive"
                      }
                    >
                      Create Employee
                    </NavLink>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
