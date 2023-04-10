import React from "react";
import ProductsReport from "./ProductsReport";
import PackagesReport from "./PackagesReport";
import EmployeeReport from "./EmployeeReport";

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
    <div>
      <h1>Reports</h1>
      <select onChange={handleReportTypeChange}>
        <option value="packages">Packages</option>
        <option value="employees">Employees</option>
        <option value="products">Products</option>
      </select>
      {renderReportInputs()}
    </div>
  );
};

export default Dashboard;
