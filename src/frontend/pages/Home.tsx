import { api } from "src/server/utils/api";
import { useSession } from "../auth/SessionProvider";

const Home = () => {
  const { data: hello } = api.greeting.hello.useQuery({ name: "world" });
  const user = useSession();

  return (
    <div>
      <h2 className="">Home</h2>
      <p>{hello?.greeting}</p>
      {user?.user && (
        <div>
          <p>Logged in as {user.user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
