import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../icons/Spinner";
import { AuthContext } from "../auth/SessionProvider";
import { trpc } from "../utils/trpc";
import { getRole } from "../utils/roleinfo";
import { useForm } from "react-hook-form";

const WorkLog = () => {
  const user = useContext(AuthContext);
  const navigator = useNavigate();

  // get the employee name from id
  const date = new Date().toLocaleDateString();

  if (!user.authenticated?.user?.employee_id) {
    navigator("/login");
  }

  const { data, isLoading, isError, refetch } =
    trpc.employee.getemployeeNameHours.useQuery();

  const workLogReq = trpc.employee.workLogAdd.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hours: 0,
    },
  });

  const onSubmit = handleSubmit((data) => {
    workLogReq.mutateAsync({
      employeeID: user.authenticated?.user?.employee_id!,
      hours: data.hours,
    });
  });

  const [sort, setSort] = useState({ column: "no", direction: "asc" });

  const sortedPackages = data?.weekLog?.sort((a, b) => {
    const { column, direction } = sort;
    const sortOrder = direction === "asc" ? "asc" : "desc";
    const sortColumn = column as "week_start_date" | "total_hours";

    if (sortColumn === "week_start_date") {
      return sortOrder === "asc"
        ? a.week_start_date.localeCompare(b.week_start_date ?? "")
        : b.week_start_date.localeCompare(a.week_start_date ?? "");
    }
    if (sortColumn === "total_hours") {
      return sortOrder === "asc"
        ? a.total_hours - b.total_hours
        : b.total_hours - a.total_hours;
    }

    return 0;
  });

  const handleSortColumn = (column: "week_start_date" | "total_hours") => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="min-h-[80hv]">
      <div className="flex justify-center align-middle">
        <div className="container mx-40 mt-10">
          <h1 className="text-4xl font-bold text-center">Work Log</h1>
          <div className="flex flex-col justify-center ">
            <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl max-w-4xl justify-center">
              <form onSubmit={onSubmit}>
                {errors && (
                  <p className="font-bold text-sm text-red-500">
                    {errors.hours?.message}
                  </p>
                )}
                <div className="flex flex-row gap-2">
                  <h1 className="block uppercase tracking-wide text-gray-50 text-base font-bold mb-2">
                    Name:
                  </h1>
                  <p>{data.employeeInfo?.firstname}</p>
                  <p>{data.employeeInfo?.lastname}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <h1 className="block uppercase tracking-wide text-gray-50 text-base font-bold mb-2">
                    {" "}
                    Role:{" "}
                  </h1>
                  <p>{getRole(user.authenticated?.user?.role!)}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <h1 className="block uppercase tracking-wide text-gray-50 text-base font-bold mb-2">
                    {" "}
                    Date:
                  </h1>
                  <p>{date}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block uppercase tracking-wide text-gray-50 text-base font-bold mb-2">
                    Input Hours
                  </label>
                  <input
                    {...register("hours", {
                      required: "Hours is required",
                      valueAsNumber: true,
                      validate: {
                        positive: (value) =>
                          value > 0 || "Hours must be greater than 0",
                        lessThan: (value) =>
                          value <= 12 || "Hours must be less than 12",
                      },
                    })}
                    type="number"
                    className="block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                  />
                </div>
                {workLogReq.isLoading ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button className="formButton">Submit</button>
                  </div>
                )}
              </form>
            </div>
            <div>
              <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl max-w-4xl justify-center">
                <table className="table-auto w-3/4 bg-[#1D1D1C] shadow-md overflow-hidden text-[#e5e5e5] border border-[#41413E]">
                  <thead className="text-lg">
                    <tr className="">
                      <th
                        className="px-6 py-4 border-r  border-b border-[#41413E] font-bold uppercase cursor-pointer"
                        onClick={() => handleSortColumn("week_start_date")}
                      >
                        Week Of
                        {sort.column === "week_start_date" && (
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
                        className="px-6 py-4 border-b border-r border-[#41413E] font-bold  uppercase"
                        onClick={() => handleSortColumn("total_hours")}
                      >
                        Week Total hours
                        {sort.column === "total_hours" && (
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
                    {data?.weekLog?.map((pkg, index) => {
                      const newDate = new Date(
                        pkg.week_start_date
                      ).toLocaleDateString();
                      return (
                        <tr
                          key={newDate}
                          className={`${
                            index % 2 === 0 ? "bg-[#3A3A38]" : "bg-[#2F2F2E]"
                          }  hover:bg-[#c0bcbc] hover:text-[#1D1D1C]`}
                        >
                          <td className="px-6 py-4 border-r  border-b border-[#41413E]">
                            {newDate}
                          </td>
                          <td className="px-6 py-4 border-b border-r border-[#41413E]">
                            {pkg.total_hours}
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
      {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
    </div>
  );
};

export default WorkLog;
