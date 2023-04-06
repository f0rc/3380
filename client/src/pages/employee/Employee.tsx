import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

const Employee = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = trpc.employee.getAllEmployee.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        console.log("MONKEY");
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
        ? a.firstname.localeCompare(b.firstname)
        : b.firstname.localeCompare(a.firstname);
    }

    if (sortColumn === "lastname") {
      return sortOrder === "asc"
        ? a.lastname.localeCompare(b.lastname)
        : b.lastname.localeCompare(a.lastname);
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
        ? a.manager_lastname.localeCompare(b.manager_lastname)
        : b.manager_lastname.localeCompare(a.manager_lastname);
    }
    if (sortColumn === "locationname") {
      return sortOrder === "asc"
        ? a.locationname.localeCompare(b.locationname)
        : b.locationname.localeCompare(a.locationname);
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
      <div className="min-h-[80hv] mt-20">
        <div className="flex justify-center align-middle">
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
                        sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
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
  );
};

export default Employee;

// const PackageList = () => {
//   const navigate = useNavigate();
//   const [packages, setPackages] = useState([] as PackageSchemaWithStatus[]);

// };
