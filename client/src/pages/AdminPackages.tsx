import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackageSchema,
  PackageSchemaWithStatus,
} from "../../../server/trpc/router/package";
import { trpc } from "../utils/trpc";

const AdminList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([] as PackageSchemaWithStatus[]);

  const { data, isLoading, isError } = trpc.package.packageList.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        setPackages(data.packageList);
      },
    }
  );

  const [sort, setSort] = useState({ column: "no", direction: "asc" });
  const packagesWithIndices = packages.map((packageItem, index) => ({
    ...packageItem,
    package_number: index + 1,
  }));

  const sortedPackages = packagesWithIndices.sort((a, b) => {
    const { column, direction } = sort;
    const sortOrder = direction === "asc" ? "asc" : "desc";
    const sortColumn = column as
      | "no"
      | "type"
      | "weight"
      | "size"
      | "processedAt"
      | "status";

    if (sortColumn === "no") {
      return sortOrder === "asc"
        ? a.package_number - b.package_number
        : b.package_number - a.package_number;
    }

    if (sortColumn === "type") {
      return sortOrder === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    if (sortColumn === "weight") {
      return sortOrder === "asc" ? a.weight - b.weight : b.weight - a.weight;
    }
    if (sortColumn === "size") {
      return sortOrder === "asc"
        ? Number(a.size) - Number(b.size)
        : Number(b.size) - Number(a.size);
    }
    if (sortColumn === "processedAt") {
      return sortOrder === "asc"
        ? new Date(a.processedAt).getTime() - new Date(b.processedAt).getTime()
        : new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime();
    }
    if (sortColumn === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }

    return 0;
  });

  const handleSortColumn = (
    column: "no" | "type" | "weight" | "size" | "processedAt" | "status"
  ) => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  const handlePackageClick = (packageDetails: PackageSchema) => {
    navigate(`/package/${packageDetails.package_id}`, {
      state: { data: packageDetails },
    });
  };

  return (
    <div className="">
      <div className="min-h-[80hv] mt-20">
        <div className="flex justify-center align-middle">
          <table className="table-auto w-3/4 bg-[#1D1D1C] shadow-md overflow-hidden text-[#e5e5e5] border border-[#41413E]">
            <thead className="text-lg">
              <tr className="">
                <th
                  className="px-6 py-4 border-r  border-b border-[#41413E] font-bold uppercase cursor-pointer"
                  onClick={() => handleSortColumn("no")}
                >
                  No.
                  {sort.column === "no" && (
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
                  onClick={() => handleSortColumn("type")}
                >
                  Type
                  {sort.column === "type" && (
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
                  onClick={() => handleSortColumn("weight")}
                >
                  Weight
                  {sort.column === "weight" && (
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
                  onClick={() => handleSortColumn("size")}
                >
                  Size
                  {sort.column === "size" && (
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
                  onClick={() => handleSortColumn("processedAt")}
                >
                  Last Update
                  {sort.column === "processedAt" && (
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
                  className="px-6 py-4 border-b  border-[#41413E] font-bold uppercase  cursor-pointer"
                  onClick={() => handleSortColumn("status")}
                >
                  status
                  {sort.column === "status" && (
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
              {sortedPackages.map((pkg, index) => {
                return (
                  <tr
                    key={pkg.package_id}
                    className={`${
                      index % 2 === 0 ? "bg-[#3A3A38]" : "bg-[#2F2F2E]"
                    }  hover:bg-[#c0bcbc] hover:text-[#1D1D1C] cursor-pointer`}
                    onClick={() => handlePackageClick(pkg)}
                  >
                    <td className="px-6 py-4 border-r  border-b border-[#41413E]">
                      {pkg.package_number}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.type}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.weight}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {pkg.size}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-[#41413E]">
                      {new Date(pkg.processedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b  border-[#41413E]">
                      <span
                        className={` px-2 py-1 text-sm font-semibold  rounded-md ${
                          pkg.status === "accepted"
                            ? "bg-green-800 text-green-100"
                            : pkg.status === "transit"
                            ? "bg-blue-100 text-blue-800"
                            : pkg.status === "delivered"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pkg.status}
                      </span>
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

export default AdminList;
