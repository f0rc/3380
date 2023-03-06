import { api } from "src/server/utils/api";
import { useSession } from "../auth/SessionProvider";

const Home = () => {
  const { data: hello } = api.greeting.hello.useQuery({ name: "world" });
  const session = useSession();
  console.log(session);
  return (
    <div>
      <h2 className="">Home</h2>
      <p>{hello?.greeting}</p>
    </div>
  );
};

export default Home;
