import React from "react";
import ProductsReport from "./ProductsReport";
import PackagesReport from "./package/PackagesReport";
import EmployeeReport from "./Employee/EmployeeReport";
const Dashboard = () => {
  const [reportType, setReportType] = React.useState("packages");

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
  };

  const renderReportInputs = () => {
    switch (reportType) {
      case "packages":
        return <PackagesReport />;
      case "employees":
        return <EmployeeReport />;
      case "products":
        return <ProductsReport />;
      default:
        return <PackagesReport />;
    }
  };

  return (
    <div className="flex justify-center max-h-screen">
      <div className="max-w-[90%]">
        <div className="flex  mx-20 flex-col w-11/12 -mt-10">
          <div className="flex flex-col gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-full">
            <div className="grow gap-2 items-center">
              <h1 className="font-bold text-2xl pb-3">Reports</h1>
              <h1 className="text-xl font-bold pb-3">Select report:</h1>
              <div className="pb-3">
                <select
                  onChange={handleReportTypeChange}
                  className="font-bold font-xl  p-3 bg-transparent border border-calm-yellow outline-none"
                >
                  <option value="packages">Packages</option>
                  <option value="employees">Employees</option>
                  {/* <option value="products">Products</option> */}
                </select>
              </div>
            </div>
            <div className="grow gap-2 items-center">
              {renderReportInputs()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
