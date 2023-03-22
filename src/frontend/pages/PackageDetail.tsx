import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PackageSchema } from "src/server/router/package";
import { api } from "src/server/utils/api";
import { z } from "zod";

const PackageDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // fetch package history
  console.log("STATE", state.data);

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  });

  const packageDetails = state?.data as PackageSchema;

  return (
    <div className="min-h-[80hv]">
      <div className="flex justify-center align-middle">
        <div className="container mx-40 mt-10">
          <h1 className="text-4xl font-bold text-start">Package Details</h1>
          <div>
            <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl">
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Tracking ID</h1>
                <p className="text-lg">{packageDetails?.package_id}</p>
              </div>
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Type</h1>
                <p className="text-lg">{packageDetails?.type}</p>
              </div>
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Size</h1>
                <p className="text-lg">{packageDetails?.size}</p>
              </div>

              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Weight</h1>
                <p className="text-lg">{packageDetails?.weight}</p>
              </div>

              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Status</h1>
                <p className="text-lg bg-green-700  py-2 px-3 rounded-full text-white text-center w-fit">
                  fixthis
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-start mt-10">
                Package History
              </h1>
              <p>todo</p>
            </div>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(packageDetails, null, 2)}</pre>
    </div>
  );
};

export default PackageDetail;
