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

  console.log(packages);
  return (
    <div className="w-full max-w-full p-5 h-screen ">
      <div className="relative flex flex-col min-w-0 break-words border-0 shadow-soft-xl text-slate-200 p-4">
        <h2 className="text-xl mb-2">List of Packages</h2>
        <div className="">
          {packages.map((pkg, index) => (
            <div
              key={pkg.package_id}
              className="flex flex-row bg-gray-900 p-4 rounded-md"
            >
              <div className="flex flex-col w-1/2">
                <p>{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageList;
