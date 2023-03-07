import { useEffect } from "react";
import { api } from "src/server/utils/api";
import { useSession } from "../auth/SessionProvider";

const Home = () => {
  const { data: hello } = api.greeting.hello.useQuery({ name: "world" });
  const user = useSession();
  const { data: protectMessage, refetch } = api.greeting.secretMessage.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);
  return (
    <div>
      <h2 className="">Home</h2>
      <p>{hello?.greeting}</p>
      {user?.user && (
        <div>
          <p>Logged in as {user.user.email}</p>
        </div>
      )}

      {protectMessage && (
        <div>
          <p>Secret message: {protectMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
