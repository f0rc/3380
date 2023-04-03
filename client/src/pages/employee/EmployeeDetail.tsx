import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Error</div>;
  }

  const { data, isLoading, isError } = trpc.employee.getEmployee.useQuery({
    employeeID: id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const getRole = (role: number) => {
    switch (role) {
      case 1:
        return "Clerk";
      case 2:
        return "Driver";
      case 3:
        return "Manager";
      default:
        return "Unknown";
    }
  };

  const Currency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  return (
    <div className="min-h-[80hv]">
      <div className="flex justify-center align-middle">
        <div className="container mx-40 mt-10">
          <h1 className="text-4xl font-bold text-center">Employee Details</h1>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-1/2">
              <div className="flex flex-col grow">
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">First Name:</h1>
                  <p className="">{data.employee.firstname}</p>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Last Name:</h1>
                  <p className="">{data.employee.lastname}</p>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Email:</h1>
                  <p className="">{data.employee.email}</p>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="flex grow gap-2 items-center">
                  <div className=" flex flex-col gap-1">
                    <h1 className="text-lg font-bold">Address:</h1>
                    {/* format the address to make it look good */}
                    <p className="">
                      {data.employee.address_street},{" "}
                      {data.employee.address_city},{" "}
                      {data.employee.address_state}
                    </p>
                    <p className="">{data.employee.address_zipcode}</p>
                  </div>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Birth Date:</h1>
                  <p className="">
                    {new Date(data.employee.birthdate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-start mt-10">
              Package History
            </h1>
            <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-fit">
              <div className="flex flex-col grow">
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">ROLE:</h1>
                  <p className="">{getRole(data.employee.role)}</p>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Salary:</h1>
                  <p className="">${Currency(data.employee.salary)}</p>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Supervisor:</h1>
                  <p className="">
                    {data.employee.manager_lastname ?? "not available"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="flex grow gap-2 items-center">
                  <div className=" flex flex-col gap-1">
                    <h1 className="text-lg font-bold">Office Address:</h1>
                    {/* format the address to make it look good */}
                    <p className="">
                      {data.employee.postoffice_address_street},{" "}
                      {data.employee.postoffice_address_city},{" "}
                      {data.employee.postoffice_address_state}
                    </p>
                    <p className="">
                      {data.employee.postoffice_address_zipcode}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Hours Worked:</h1>
                  <p className="">{data.employee.hours}</p>
                </div>
                <div className="flex grow gap-2 items-center">
                  <h1 className="text-lg font-bold">Hired By:</h1>
                  <p className="">{data.employee.createdBy}</p>
                </div>
              </div>
            </div>
            TODO: ADD BUTTON TO OPEN MODAL TO EDIT EMPLOYEE DETAILS AND MANAGER
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
    </div>
  );
};

export default EmployeeDetail;
