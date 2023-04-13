import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  PackageSchema,
  packageWithStatusDetailAddress,
} from "../../../server/trpc/router/package";
import { AuthContext } from "../auth/SessionProvider";
import { trpc } from "../utils/trpc";

const PackageDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // fetch package history
  // console.log("STATE", state.data);

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  });

  const { authenticated } = useContext(AuthContext);

  const packageDetails = state?.data as packageWithStatusDetailAddress;

  const detailPackage = trpc.package.packageDetails.useQuery({
    package_id: packageDetails?.package_id,
  });

  const { data, refetch } = trpc.package.packageDetailsPublic.useQuery({
    package_id: packageDetails.package_id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "delivered":
        return "bg-green-700";
      case "out-for-delivery":
        return "bg-blue-500";
      case "transit":
        return "bg-yellow-500";
      case "fail":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
                <p
                  className={`"text-lg py-2 px-3 rounded-full text-white text-center w-fit " + ${getStatusColor(
                    data?.packageDetails?.status ?? "UNKNOWN"
                  )}`}
                >
                  {data?.packageDetails?.status ?? " UNKNOWN"}
                </p>
              </div>
            </div>

            {authenticated ? (
              <div className="">
                <h1 className="text-4xl font-bold text-start mt-10">
                  Package History
                </h1>
                <div className="grid grid-cols-3 gap-5">
                  {detailPackage.data?.packageHistory?.map((item) => (
                    <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl">
                      <div className="grow gap-2 items-center">
                        <div className="flex flex-row gap-3">
                          <h1 className="text-xl font-bold pb-3">Location</h1>
                          <p className="text-lg">{item.locationname}</p>
                        </div>

                        <div className="flex flex-row gap-3">
                          <h1 className="text-xl font-bold pb-3">Address: </h1>
                          <p className="text-lg">{item.address_street}</p>
                          <p className="text-lg">{item.address_city}</p>
                          <p className="text-lg">{item.address_state}</p>
                          <p className="text-lg">{item.address_zipcode}</p>
                        </div>
                        <p>{item.status}</p>
                        <p className="text-end">{item.intransitcounter + 1}</p>
                      </div>
                      {/* <pre>{JSON.stringify(detailPackage, null, 2)}</pre> */}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold text-start mt-10">
                  Please Login or Register to view Package History
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
    </div>
  );
};

export default PackageDetail;
