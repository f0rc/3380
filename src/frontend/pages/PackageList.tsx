import React from "react";
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
  console.log("packages", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1>Package List</h1>
      {packages.map((p) => (
        <div key={p.packageID}>
          <h2>{p.type}</h2>
          <p>{p.senderID}</p>
        </div>
      ))}
    </div>
  );
};

export default PackageList;
