import { useContext, useEffect } from "react";
import { api } from "src/server/utils/api";
import { AuthContext, AuthProvider } from "../auth/SessionProvider";

const Home = () => {
  const { data: hello } = api.greeting.hello.useQuery({ name: "world" });
  const { authenticated } = useContext(AuthContext);
  return (
    <div className="">
      <div className="container items-center text-3xl">
        <p>{hello?.greeting}</p>
        <p>{authenticated ? "authenticated" : "not authenticated"}</p>
        {authenticated && <p>welcome {authenticated.user?.email}</p>}
        {authenticated && <p>welcome {authenticated.user?.role}</p>}
      </div>
    </div>
  );
};

export default Home;
