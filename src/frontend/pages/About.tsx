import React from "react";
import { useSession } from "../auth/SessionProvider";

const About = () => {
  const session = useSession();
  console.log(session);
  return (
    <div>
      <h1>About</h1>
      <p>go to / anything to see error page</p>
    </div>
  );
};

export default About;
