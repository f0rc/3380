import React, { useContext } from "react";
import { AuthContext } from "../auth/SessionProvider";

function Profile() {
  // const { authenticated } = useContext(AuthContext);

  // console.log("authenticated", authenticated);
  return (
    <div className="overflow-none flex h-screen justify-center">
      <div className="flex h-full w-full flex-col md:max-w-5xl border-x">
        <div className="mt-10 flex flex-col px-10 gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">NAME</h1>
            <h2 className="text-xl font-bold">User Bio</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
