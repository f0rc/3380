import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSession } from "../auth/SessionProvider";
import BurgerMenu from "../icons/burgerMenu";

const Layout = () => {
  const user = useSession();
  const [session, setSession] = useState(user);
  console.log("session", session);
  useEffect(() => {
    setSession(user);
  }, [user]);

  // handle login logout
  return (
    <>
      <nav className="px-2 py-2.5 bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              [MAIL]
            </span>
          </a>
          <div className="flex order-2">
            <button
              type="button"
              className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0 bg-blue-600 hover:bg-blue-700 ring-blue-800"
            >
              {session ? "Logout" : "Login"}
            </button>
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

      {/* <nav classNameNameName="bg-slate-500 px-2 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200">
        <ul classNameNameName="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/404">error</Link>
          </li>
        </ul>
      </nav>
      <hr /> */}
      <Outlet />
    </>
  );
};

export default Layout;

{
  /* <div classNameName="flex md:order-2">
<button
  type="button"
  classNameName="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
>
  Login
</button>
</div> */
}
