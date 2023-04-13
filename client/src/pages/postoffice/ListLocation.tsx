import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

const ListLocations = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    trpc.location.getAllOfficeLocations.useQuery(undefined, {
      onSuccess: (data) => {
        // console.log("MONEY");
      },
    });

  const [sort, setSort] = useState({ column: "no", direction: "asc" });

  const sortedPackages = data?.locations?.sort((a, b) => {
    const { column, direction } = sort;
    const sortOrder = direction === "asc" ? "asc" : "desc";
    const sortColumn = column as
      | "locationname"
      | "address_street"
      | "address_city"
      | "address_state"
      | "address_zipcode"
      | "manager_lastname"
      | "employee_count";

    if (sortColumn === "locationname") {
      return sortOrder === "asc"
        ? a.locationname.localeCompare(b.locationname)
        : b.locationname.localeCompare(a.locationname);
    }

    if (sortColumn === "address_street") {
      return sortOrder === "asc"
        ? a.address_street.localeCompare(b.address_street)
        : b.address_street.localeCompare(a.address_street);
    }
    if (sortColumn === "manager_lastname") {
      if (a.manager_lastname === null) {
        return 1;
      }
      return sortOrder === "asc"
        ? a.manager_lastname.localeCompare(b.manager_lastname)
        : b.manager_lastname.localeCompare(a.manager_lastname);
    }

    if (sortColumn === "employee_count") {
      return sortOrder === "asc"
        ? a.employee_count - b.employee_count
        : b.employee_count - a.employee_count;
    }

    return 0;
  });

  const handleSortColumn = (
    column:
      | "locationname"
      | "address_street"
      | "manager_lastname"
      | "employee_count"
  ) => {
    // console.log(column);
    if (column === sort.column) {
      // setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      setSort((prev) => ({
        ...prev,
        direction: prev.direction === "asc" ? "desc" : "asc",
      }));
    } else {
      setSort({ column, direction: "asc" });
    }
  };

  const handlePackageClick = (locationId: string) => {
    const foundLocation = data?.locations.find(
      (location) => location.postoffice_location_id === locationId
    );
    // console.log("INDEX", foundLocation?.locationname);
    navigate(`/location/${locationId}`, {
      state: { data: foundLocation?.postoffice_location_id },
    });
    // console.log(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="">
      <div className="min-h-[80hv] mt-20">
        <div className="flex justify-center">
          <div className="w-3/4">
            <div className="flex justify-between">
              <div className="text-3xl font-bold text-[#e5e5e5]">
                Post Office Locations
              </div>
              <div className="flex items-center">
                <button
                  className="bg-[#1D1D1C] text-[#e5e5e5] font-bold py-2 px-4 rounded-full"
                  onClick={() => navigate("/add-location")}
                >
                  Create Location
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center align-middle">
          <table className="table-auto w-3/4 bg-[#1D1D1C] shadow-md overflow-hidden text-[#e5e5e5] border border-[#41413E]">
            <thead className="text-lg">
              <tr className="">
                <th
                  className="px-6 py-4 border-r  border-b border-[#41413E] font-bold uppercase cursor-pointer"
                  onClick={() => handleSortColumn("locationname")}
                >
                  Location Name
                  {sort.column === "firstname" && (
                    <span
                      className={`ml-2 fas ${
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
                      }`}
                    >
                      {sort.direction === "asc" || null ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-4 border-b border-r border-[#41413E] font-bold  uppercase  cursor-pointer"
                  onClick={() => handleSortColumn("address_street")}
                >
                  Address
                  {sort.column === "lastname" && (
                    <span
                      className={`ml-2 fas ${
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
                      }`}
                    >
                      {sort.direction === "asc" || null ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-4 border-b border-r border-[#41413E] font-bold  uppercase   cursor-pointer"
                  onClick={() => handleSortColumn("manager_lastname")}
                >
                  Manager
                  {sort.column === "role" && (
                    <span
                      className={`ml-2 fas ${
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
                      }`}
                    >
                      {sort.direction === "asc" || null ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-4 border-b border-r border-[#41413E] font-bold uppercase  cursor-pointer"
                  onClick={() => handleSortColumn("employee_count")}
                >
                  Employee Count
                  {sort.column === "hours" && (
                    <span
                      className={`ml-2 fas ${
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
                      }`}
                    >
                      {sort.direction === "asc" || null ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-100 text-center text-[1.2rem]">
              {data?.locations.map((pkg, index) => {
                // console.log(index);
                return (
                  <tr
                    key={pkg.postoffice_location_id}
                    className={`${
                      index % 2 === 0 ? "bg-[#3A3A38]" : "bg-[#2F2F2E]"
                    }  hover:bg-[#c0bcbc] hover:text-[#1D1D1C] cursor-pointer`}
                    onClick={() =>
                      handlePackageClick(pkg.postoffice_location_id)
                    }
                  >
                    <td className="px-6 py-4 border-r  border-b border-[#41413E]">
                      {pkg.locationname}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.address_street}, {pkg.address_city},{" "}
                      {pkg.address_state} {pkg.address_zipcode}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.manager_lastname ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.employee_count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListLocations;

// const PackageList = () => {
//   const navigate = useNavigate();
//   const [packages, setPackages] = useState([] as PackageSchemaWithStatus[]);

// };
