import React, { Children, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "src/server/utils/api";
import { useSession } from "../auth/SessionProvider";

const Layout = () => {
  const navigatr = useNavigate();
  const user = useSession();
  const [session, setSession] = useState(user);
  console.log("session", session);
  useEffect(() => {
    setSession(user);
  }, [user]);

  // handle login logout

  const { mutateAsync } = api.auth.logout.useMutation({
    onSuccess: (data) => {
      console.log("logged out", data);
    },
  });

  const handleLogout = async () => {
    localStorage.removeItem("token");
    const result = await mutateAsync();
    if (result.status == "success") {
      setSession(null);
      navigatr("/login");
    }
  };

  if (session?.user?.role === "Clerk") {
    console.log("clerk");
  }

  return (
    <>
      <nav className="px-2 py-2.5 darkColor-2 w-full border-b border-gray-600 sticky top-0 z-50 max-h-20">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              [MAIL]
            </span>
          </a>
          <div className="flex order-2">
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0 hover:bg-blue-700 ring-blue-800"
              >
                logout
              </button>
            ) : (
              <a
                href="/login"
                className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center mr-0  hover:bg-blue-700 ring-blue-800 text-white border-b border-[hsl(280,100%,70%)]"
              >
                login
              </a>
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
              {session?.user?.role === "Clerk" && (
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
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
