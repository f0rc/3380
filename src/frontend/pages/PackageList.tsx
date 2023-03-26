import React, { useState } from "react";
import { PackageSchema } from "src/server/router/package";
import { api } from "src/server/utils/api";

const PackageList = () => {
  const [packages, setPackages] = React.useState([] as PackageSchema[]);

  const { data, isLoading, isError } = api.package.packageList.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        setPackages(data.packageList);
      },
    }
  );
  // const [sortField, setSortField] = useState<string>("packageID");
  // const [sortDirection, setSortDirection] = useState<string>("asc");

  // // const sortedPackages = packages.sort((a, b) => {
  // //   const sortValueA = a[sortField];
  // //   const sortValueB = b[sortField];

  // //   if (sortValueA < sortValueB) {
  // //     return sortDirection === "asc" ? -1 : 1;
  // //   } else if (sortValueA > sortValueB) {
  // //     return sortDirection === "asc" ? 1 : -1;
  // //   } else {
  // //     return 0;
  // //   }
  // // });

  // // const handleSortChange = (field: string) => {
  // //   if (sortField === field) {
  // //     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  // //   } else {
  // //     setSortField(field);
  // //     setSortDirection("asc");
  // //   }
  // // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="w-full max-w-full p-5 h-screen ">
      <div className="relative flex flex-col min-w-0 break-words border-0 shadow-soft-xl text-slate-200 p-4">
        <h2 className="text-xl mb-2">List of Packages</h2>
        <div className="">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Weight</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="">
              {packages.map((pkg, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-zinc-800" : "bg-slate-600"
                  } hover:bg-black/50 transition-all duration-100 ease-in-out`}
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{pkg.type}</td>
                  <td className="border px-4 py-2">{pkg.weight}</td>
                  <td className="border px-4 py-2">
                    {pkg.packageLocationHistoryID}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackageList;
