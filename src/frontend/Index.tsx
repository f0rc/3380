import React, { Children } from "react";
import { Route, Routes } from "react-router-dom";
import { api } from "src/server/utils/api";
import { SessionContext } from "./auth/SessionProvider";
import About from "./pages/About";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

const Index = () => {
  const { isLoading, data, isError } = api.session.getSession.useQuery();
  console.log("USER", data?.user);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <SessionContext.Provider value={data}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </SessionContext.Provider>
    </>
  );
};

export default Index;
