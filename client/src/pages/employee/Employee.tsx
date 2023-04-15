import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import EmployeeTable from "./EmployeeTable";

const Employee = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = trpc.employee.getAllEmployee.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        // console.log("MONEY");
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="">
      <div className="overflow-none flex h-screen justify-center">
        <div className="flex h-full w-full flex-col md:max-w-fit border-x">
          <div className="mt-10 flex flex-col px-10 gap-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold mb-3">Employee Overview</h1>
              <div className="flex flex-col gap-2">
                <button
                  className="bg-calm-yellow text-black px-4 py-2 rounded-md w-fit"
                  onClick={() => {
                    navigate("/create-employee");
                  }}
                >
                  Add Employee
                </button>
              </div>
              <div className="flex justify-start align-middle">
                <EmployeeTable data={data.employees} />
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
