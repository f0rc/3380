import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

const Dependent = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = trpc.dependent.getAllDependent.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        console.log("MONEY");
      },
    }
  );

  const [sort, setSort] = useState({ column: "no", direction: "asc" });

  const sortedPackages = data?.dependents?.sort((a, b) => {
    const { column, direction } = sort;
    const sortOrder = direction === "asc" ? "asc" : "desc";
    const sortColumn = column as
      | "dependent_name"
      | "dependent_birthDate"
      | "employee_id"
      | "relationship";

    if (sortColumn === "dependent_name") {
      return sortOrder === "asc"
        ? a.dependent_name.localeCompare(b.dependent_name ?? "")
        : b.dependent_name.localeCompare(a.dependent_name ?? "");
    }

    if (sortColumn === "dependent_birthDate") {
      return sortOrder === "asc"
        ? a.dependent_birthDate.localeCompare(b.dependent_birthDate ?? "")
        : b.dependent_birthDate.localeCompare(a.dependent_birthDate ?? "");
    }

    
    if (sortColumn === "relationship") {
      return sortOrder === "asc"
        ? a.relationship.localeCompare(b.relationship ?? "")
        : b.relationship.localeCompare(a.relationship ?? "");
    }
    if (sortColumn === "employee_id") {
      return sortOrder === "asc"
        ? a.employee_id.localeCompare(b.employee_id ?? "")
        : b.employee_id.localeCompare(a.employee_id ?? "");
    }

    return 0;
  });

  const handleSortColumn = (
    column:
    | "dependent_name"
    | "dependent_birthDate"
    | "employee_id"
    | "relationship"
  ) => {
    console.log(column);
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

  const handlePackageClick = (dependent: any) => {
    console.log("NAV", dependent);
    navigate(`/dependent/${dependent.dependent_id}`, {
      state: { data: dependent },
    });
  };

  return (
    <div className="">
      <div className="overflow-none flex h-screen justify-center">
        <div className="flex h-full w-full flex-col md:max-w-fit border-x">
          <div className="mt-10 flex flex-col px-10 gap-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold mb-3">Dependent Overview</h1>

              <div>
                <form className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">Name</label>
                    <input
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">Birth Date</label>
                    <input
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      type="date"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">Guardian Employee ID</label>
                    <input
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      type="text"
                    />
                  </div>
                </form>
              </div>
              <div className="flex justify-start align-middle">
                <table className="table-auto w-3/4 bg-[#1D1D1C] shadow-md overflow-hidden text-[#e5e5e5] border border-[#41413E]">
                  <thead className="text-lg">
                    <tr className="">
                      <th
                        className="px-6 py-4 border-r  border-b border-[#41413E] font-bold uppercase cursor-pointer"
                        onClick={() => handleSortColumn("dependent_name")}
                      >
                        First Name
                        {sort.column === "dependent_name" && (
                          <span
                            className={`ml-2 fas ${
                              sort.direction === "asc"
                                ? "fa-sort-up"
                                : "fa-sort-down"
                            }`}
                          >
                            {sort.direction === "asc" || null ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 border-b border-r border-[#41413E] font-bold  uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("dependent_birthDate")}
                      >
                        Last Name
                        {sort.column === "dependent_birthDate" && (
                          <span
                            className={`ml-2 fas ${
                              sort.direction === "asc"
                                ? "fa-sort-up"
                                : "fa-sort-down"
                            }`}
                          >
                            {sort.direction === "asc" || null ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 border-b border-r border-[#41413E] font-bold  uppercase   cursor-pointer"
                        onClick={() => handleSortColumn("employee_id")}
                      >
                        ROLE
                        {sort.column === "employee_id" && (
                          <span
                            className={`ml-2 fas ${
                              sort.direction === "asc"
                                ? "fa-sort-up"
                                : "fa-sort-down"
                            }`}
                          >
                            {sort.direction === "asc" || null ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-100 text-center text-[1.2rem]">
                    {data?.dependents.map((pkg, index) => {
                      return (
                        <tr
                          key={pkg.dependent_id}
                          className={`${
                            index % 2 === 0 ? "bg-[#3A3A38]" : "bg-[#2F2F2E]"
                          }  hover:bg-[#c0bcbc] hover:text-[#1D1D1C] cursor-pointer`}
                          onClick={() => handlePackageClick(pkg)}
                        >
                          <td className="px-6 py-4 border-r  border-b border-[#41413E]">
                            {pkg.dependent_name}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.dependent_birthDate}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.employee_id}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dependent;

// const PackageList = () => {
//   const navigate = useNavigate();
//   const [packages, setPackages] = useState([] as PackageSchemaWithStatus[]);

// };
