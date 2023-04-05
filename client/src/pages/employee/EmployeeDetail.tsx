import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

const EmployeeDetail = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Error</div>;
  }

  const { data, isLoading, isError } = trpc.employee.getEmployee.useQuery({
    employeeID: id,
  });

  const { watch, handleSubmit, register } = useForm({
    defaultValues: {
      firstname: data?.employee.firstname,
      lastname: data?.employee.lastname,
      email: data?.employee.email,
      address_street: data?.employee.address_street,
      address_city: data?.employee.address_city,
      address_state: data?.employee.address_state,
      address_zipcode: data?.employee.address_zipcode,
      birthdate: data?.employee.birthdate,
      role: data?.employee.role,
      salary: data?.employee.salary,
      manager_id: data?.employee.manager_id,
      postoffice_name: data?.employee.postoffice_locationname,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

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
    <div>
      <div className="min-h-[80hv]">
        <div className="flex align-middle">
          <div className="container mx-40 mt-10">
            <div className="flex justify-center gap-x-4">
              <h1 className="text-4xl font-bold text-center">
                Employee Details
              </h1>
            </div>

            <div className="flex justify-center items-center">
              <div className="flex flex-wrap mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-1/2 flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">First Name:</h1>
                    <p>{data.employee.firstname}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Last Name:</h1>
                    <p>{data.employee.lastname}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Email:</h1>
                    <p>{data.employee.email}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Address:</h1>
                    <p>
                      {data.employee.address_street},{" "}
                      {data.employee.address_city},{" "}
                      {data.employee.address_state}
                    </p>
                    <p>{data.employee.address_zipcode}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Birth Date:</h1>
                    <p>
                      {new Date(data.employee.birthdate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">ROLE:</h1>
                    <p>{getRole(data.employee.role)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Salary:</h1>
                    <p>${Currency(data.employee.salary)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Supervisor:</h1>
                    <p>{data.employee.manager_lastname ?? "not available"}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Office Address:</h1>
                    <p>
                      {data.employee.postoffice_address_street},{" "}
                      {data.employee.postoffice_address_city},{" "}
                      {data.employee.postoffice_address_state}
                    </p>
                    <p>{data.employee.postoffice_address_zipcode}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Hours Worked:</h1>
                    <p>{data.employee.hours}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Hired By:</h1>
                    <p>{data.employee.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
              <button
                onClick={openModal}
                className="block text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-calm-yellow hover:bg-zinc-900"
                type="button"
              >
                Update Employee
              </button>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
      </div>

      <div className="flex">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Update Product Modal"
          className="flex relative items-center justify-center h-full w-full p-4 md:p-0"
          overlayClassName="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative p-4 rounded-lg bg-[#232322] sm:p-5 border border-[#41413E] shadow-2xl">
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Employee
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="updateProductModal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http:www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form action="#">
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value="iPad Air Gen 5th Wi-Fi"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Ex. Apple iMac 27&ldquo;"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="brand"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      value="Google"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Ex. Apple"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      value="399"
                      name="price"
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$299"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected={true}>Electronics</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Write a description..."
                    >
                      Standard glass, 3.8GHz 8-core 10th-generation Intel Core
                      i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4
                      memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB
                      SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic
                      Keyboard - US
                    </textarea>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Update Employee
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    <svg
                      className="mr-1 -ml-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http:www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeDetail;
