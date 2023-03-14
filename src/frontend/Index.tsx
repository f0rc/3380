import { Route, Routes } from "react-router-dom";
import { api } from "src/server/utils/api";
import { SessionContext } from "./auth/SessionProvider";
import About from "./pages/About";
import { CreateEmployee } from "./pages/CreateEmployee";
import CreatePackage from "./pages/CreatePackage";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PackageList from "./pages/PackageList";
import Signup from "./pages/Signup";

const Index = () => {
  const { isLoading, data, isError } = api.session.getSession.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <SessionContext.Provider value={data}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="about" element={<About />} />
            <Route path="create-package" element={<CreatePackage />} />
            <Route path="package-list" element={<PackageList />} />
            <Route path="create-employee" element={<CreateEmployee />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </SessionContext.Provider>
    </>
  );
};

export default Index;
