import React from "react";
import { api } from "src/server/api";

const Home = () => {
  const { data: hello } = api.greeting.hello.useQuery({ name: "world" });
  return (
    <div>
      <h2>Home</h2>
      <p>{hello?.greeting}</p>
    </div>
  );
};

export default Home;
