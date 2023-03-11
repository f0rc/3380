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

  return (
    <>
      <nav className="px-2 py-2.5 bg-zinc-900 w-full z-20 top-0 left-0 border-b border-gray-600">
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
                className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0 bg-blue-600 hover:bg-blue-700 ring-blue-800"
              >
                logout
              </button>
            ) : (
              <a
                href="/login"
                className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0 bg-blue-600 hover:bg-blue-700 ring-blue-800 text-white border-b border-[hsl(280,100%,70%)]"
              >
                login
              </a>
            )}
          </div>
          <div
            className="items-center justify-between flex w-auto order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 rounded-lg md:flex-row space-x-8 mt-0 text-sm font-medium bg-gray-900">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "navItemActive"
                      : "py-2 pl-3 pr-4 rounded md:bg-transparent text-white p-0"
                  }
                  // className="py-2 pl-3 pr-4 rounded md:bg-transparent text-white p-0"
                >
                  Home
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
