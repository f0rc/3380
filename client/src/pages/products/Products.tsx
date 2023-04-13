import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import ListProducts from "./ListProducts";

export const Products = () => {
  const locationInfo = trpc.location.getOfficeLocationsFromWorksFor.useQuery();

  const [location, setLocation] = React.useState("");
  useEffect(() => {
    // console.log(location);
  }, [location]);

  return (
    <div className="min-h-[80hv] flex justify-center">
      <div className="flex justify-center max-w-7xl mt-5  w-full">
        <div className="w-full h-full">
          <div className="flex flex-col grow gap-3 items-start">
            <label htmlFor="type" className="text-xl font-bold">
              Location
            </label>
            {locationInfo.isLoading ? (
              <div>Loading...</div>
            ) : (
              <select
                className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">SELECT A LOCATION</option>
                {locationInfo.data?.locations?.map((location) => (
                  <option value={location.postoffice_location_id}>
                    {location.locationname}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>{location && <ListProducts locationId={location} />}</div>
        </div>
      </div>
    </div>
  );
};
