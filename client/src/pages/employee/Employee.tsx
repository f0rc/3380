import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

const Employee = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = trpc.employee.getAllEmployee.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        console.log("MONEY");
      },
    }
  );

  const [sort, setSort] = useState({ column: "no", direction: "asc" });

  const sortedPackages = data?.employees?.sort((a, b) => {
    const { column, direction } = sort;
    const sortOrder = direction === "asc" ? "asc" : "desc";
    const sortColumn = column as
      | "firstname"
      | "lastname"
      | "role"
      | "hours"
      | "salary"
      | "manager_lastname"
      | "locationname"
      | "location_zipcode"
      | "location_city";

    if (sortColumn === "firstname") {
      return sortOrder === "asc"
        ? a.firstname.localeCompare(b.firstname ?? "")
        : b.firstname.localeCompare(a.firstname ?? "");
    }

    if (sortColumn === "lastname") {
      return sortOrder === "asc"
        ? a.lastname.localeCompare(b.lastname ?? "")
        : b.lastname.localeCompare(a.lastname ?? "");
    }
    if (sortColumn === "role") {
      return sortOrder === "asc" ? a.role - b.role : b.role - a.role;
    }
    if (sortColumn === "hours") {
      return sortOrder === "asc" ? a.hours - b.hours : b.hours - a.hours;
    }
    if (sortColumn === "salary") {
      return sortOrder === "asc" ? a.salary - b.salary : b.salary - a.salary;
    }
    if (sortColumn === "manager_lastname") {
      return sortOrder === "asc"
        ? a.manager_lastname.localeCompare(b.manager_lastname ?? "")
        : b.manager_lastname.localeCompare(a.manager_lastname ?? "");
    }
    if (sortColumn === "locationname") {
      return sortOrder === "asc"
        ? a.locationname.localeCompare(b.locationname ?? "")
        : b.locationname.localeCompare(a.locationname ?? "");
    }
    if (sortColumn === "location_zipcode") {
      return sortOrder === "asc"
        ? a.address_zipcode - b.address_zipcode
        : b.address_zipcode - a.address_zipcode;
    }
    return 0;
  });

  const handleSortColumn = (
    column:
      | "firstname"
      | "lastname"
      | "role"
      | "hours"
      | "salary"
      | "manager_lastname"
      | "locationname"
      | "location_zipcode"
      | "location_city"
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

  const handlePackageClick = (employee: any) => {
    console.log("NAV", employee);
    navigate(`/employee/${employee.employee_id}`, {
      state: { data: employee },
    });
  };

  return (
    <div className="">
      <div className="overflow-none flex h-screen justify-center">
        <div className="flex h-full w-full flex-col md:max-w-fit border-x">
          <div className="mt-10 flex flex-col px-10 gap-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold mb-3">Employee Overview</h1>

              <div>
                <form className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">First Name</label>
                    <input
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">Last Name</label>
                    <input
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#e5e5e5]">Role</label>
                    <select
                      className="bg-[#1D1D1C] text-[#e5e5e5] px-4 py-2 rounded-md shadow-md hover:bg-[#41413E] w-fit"
                      name="role"
                      id="role"
                    >
                      <option value="0">All</option>
                      <option value="1">Manager</option>
                      <option value="2">Employee</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="flex justify-start align-middle">
                <table className="table-auto w-3/4 bg-[#1D1D1C] shadow-md overflow-hidden text-[#e5e5e5] border border-[#41413E]">
                  <thead className="text-lg">
                    <tr className="">
                      <th
                        className="px-6 py-4 border-r  border-b border-[#41413E] font-bold uppercase cursor-pointer"
                        onClick={() => handleSortColumn("firstname")}
                      >
                        First Name
                        {sort.column === "firstname" && (
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
                        onClick={() => handleSortColumn("lastname")}
                      >
                        Last Name
                        {sort.column === "lastname" && (
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
                        onClick={() => handleSortColumn("role")}
                      >
                        ROLE
                        {sort.column === "role" && (
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
                        className="px-6 py-4 border-b border-r border-[#41413E] font-bold uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("hours")}
                      >
                        hours
                        {sort.column === "hours" && (
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
                        onClick={() => handleSortColumn("salary")}
                      >
                        salary
                        {sort.column === "salary" && (
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
                        className="px-6 py-4 border-b  border-[#41413E] font-bold uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("manager_lastname")}
                      >
                        MANAGER
                        {sort.column === "manager_lastname" && (
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
                        className="px-6 py-4 border-b  border-[#41413E] font-bold uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("locationname")}
                      >
                        WORKS AT
                        {sort.column === "locationname" && (
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
                        className="px-6 py-4 border-b  border-[#41413E] font-bold uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("location_zipcode")}
                      >
                        OFFICE ZIPCODE
                        {sort.column === "location_zipcode" && (
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
                        className="px-6 py-4 border-b  border-[#41413E] font-bold uppercase  cursor-pointer"
                        onClick={() => handleSortColumn("location_city")}
                      >
                        OFFICE CITY
                        {sort.column === "location_city" && (
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
                    {data?.employees.map((pkg, index) => {
                      return (
                        <tr
                          key={pkg.employee_id}
                          className={`${
                            index % 2 === 0 ? "bg-[#3A3A38]" : "bg-[#2F2F2E]"
                          }  hover:bg-[#c0bcbc] hover:text-[#1D1D1C] cursor-pointer`}
                          onClick={() => handlePackageClick(pkg)}
                        >
                          <td className="px-6 py-4 border-r  border-b border-[#41413E]">
                            {pkg.firstname}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.lastname}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.role}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.hours}
                          </td>

                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.salary}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.manager_lastname}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.locationname}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.address_zipcode}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.address_city}
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

export default Employee;

// const PackageList = () => {
//   const navigate = useNavigate();
//   const [packages, setPackages] = useState([] as PackageSchemaWithStatus[]);

// };
