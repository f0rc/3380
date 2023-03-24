import React from "react";

import imgUrl from "../../assets/defaultavi.jpg";

function Profile() {
  return (
    <div className="overflow-none flex h-screen justify-center">
      <div className="flex h-full w-full flex-col md:max-w-5xl border-x">
        <div className="mt-10 flex flex-col px-10 gap-12">
          <img src={imgUrl} className="object-fill h-48 w-48 rounded-full " />
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Username</h1>
            <h2 className="text-xl font-bold">User Bio</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
