import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import Spinner from "../../icons/Spinner";
import { getRole } from "../../utils/roleinfo";

const EmployeeDetail = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const openModal = async () => {
    setModalLoading(true);
    await employeeInfo.refetch();
    await getAllManagers.refetch();
    await getAllLocations.refetch();
    reset();
    setModalLoading(false);
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

  const getAllManagers = trpc.employee.getAllManagers.useQuery(undefined, {
    enabled: false,
  });

  const getAllLocations = trpc.location.getOffliceLocationNameID.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const employeeInfo = trpc.employee.getEmployee.useQuery({
    employeeID: id,
  });
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: employeeInfo.data?.employee.email,
      firstname: employeeInfo.data?.employee.firstname,
      lastname: employeeInfo.data?.employee.lastname,
      address_street: employeeInfo.data?.employee.address_street,
      address_city: employeeInfo.data?.employee.address_city,
      address_state: employeeInfo.data?.employee.address_state,
      address_zipcode: employeeInfo.data?.employee.address_zipcode,
      role: employeeInfo.data?.employee.role,
      salary: employeeInfo.data?.employee.salary,
      manager_id: employeeInfo.data?.employee.manager_id,
      postoffice_location_id:
        employeeInfo.data?.employee.postoffice_location_id,
    },
  });

  const updateEmployee = trpc.employee.updateEmployee.useMutation({
    onSuccess: () => {
      closeModal();
      employeeInfo.refetch();
    },
  });

  const onSubmit = handleSubmit(async (updateData) => {
    // console.log(updateData);
    await updateEmployee.mutateAsync({
      email: updateData.email,
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      address_street: updateData.address_street,
      address_city: updateData.address_city,
      address_state: updateData.address_state,
      address_zipcode: updateData.address_zipcode,
      role: updateData.role,
      salary: updateData.salary,
      manager_id: updateData.manager_id ?? undefined,
      postoffice_location_id: updateData.postoffice_location_id,
    });
  });

  useEffect(() => {
    reset({
      email: employeeInfo.data?.employee.email,
      firstname: employeeInfo.data?.employee.firstname,
      lastname: employeeInfo.data?.employee.lastname,
      address_street: employeeInfo.data?.employee.address_street,
      address_city: employeeInfo.data?.employee.address_city,
      address_state: employeeInfo.data?.employee.address_state,
      address_zipcode: employeeInfo.data?.employee.address_zipcode,
      role: employeeInfo.data?.employee.role,
      salary: employeeInfo.data?.employee.salary,
      manager_id: employeeInfo.data?.employee.manager_id,
      postoffice_location_id:
        employeeInfo.data?.employee.postoffice_location_id,
    });
  }, [employeeInfo.data]);

  const Currency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  if (employeeInfo.isLoading) {
    return <div>Loading...</div>;
  }

  if (employeeInfo.isError) {
    return <div>Error</div>;
  }

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
                    <p>{employeeInfo.data.employee.firstname}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Last Name:</h1>
                    <p>{employeeInfo.data.employee.lastname}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Email:</h1>
                    <p>{employeeInfo.data.employee.email}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Address:</h1>

                    {employeeInfo.data.employee.address_street ? (
                      <p>
                        {employeeInfo.data.employee.address_street},{" "}
                        {employeeInfo.data.employee.address_city},{" "}
                        {employeeInfo.data.employee.address_state},{" "}
                        {employeeInfo.data.employee.address_zipcode}
                      </p>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Birth Date:</h1>
                    <p>
                      {new Date(
                        employeeInfo.data.employee.birthdate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">ROLE:</h1>
                    <p>{getRole(employeeInfo.data.employee.role)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Salary:</h1>
                    <p>${Currency(employeeInfo.data.employee.salary)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Supervisor:</h1>
                    <p>
                      {employeeInfo.data.employee.manager_lastname ??
                        "not available"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Office Address:</h1>
                    {employeeInfo.data.employee.postoffice_address_street ? (
                      <p>
                        {employeeInfo.data.employee.postoffice_locationname}
                        <br />
                        {
                          employeeInfo.data.employee.postoffice_address_street
                        }, {employeeInfo.data.employee.postoffice_address_city},{" "}
                        {employeeInfo.data.employee.postoffice_address_state},{" "}
                        {employeeInfo.data.employee.postoffice_address_zipcode}
                      </p>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Hours Worked:</h1>
                    <p>{employeeInfo.data.employee.hours}</p>
                  </div>
                  {/* <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Hired By:</h1>
                    <p>{employeeInfo.data.employee.createdBy}</p>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
              {modalLoading ? (
                <Spinner />
              ) : (
                <button
                  onClick={openModal}
                  className="block text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-calm-yellow hover:bg-zinc-900"
                  type="button"
                >
                  Update Employee
                </button>
              )}
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
      </div>

      <div className="flex">
        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
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
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstname")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.firstname ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastname")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.lastname ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Supervisor
                    </label>
                    <>
                      {getAllManagers.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin"></div>
                        </div>
                      ) : getAllManagers?.data?.employees ? (
                        <select
                          id="manager_id"
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.manager_id ? "border-red-500" : ""
                          }`}
                          {...register("manager_id")}
                        >
                          <option
                            value={
                              employeeInfo.data?.employee?.manager_id ?? "-1"
                            }
                            className=""
                          >
                            {employeeInfo.data.employee.manager_lastname ??
                              "Select Manager"}
                          </option>

                          {getAllManagers?.data?.employees.map((employee) => (
                            <option
                              value={employee.manager_id}
                              key={employee.manager_id}
                            >
                              {employee.manager_firstname}{" "}
                              {employee.manager_lastname}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <p>NO MANAGERS FOUND</p>
                        </div>
                      )}
                    </>
                  </div>
                  <div>
                    <>
                      <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                        Work Location
                      </label>
                      {getAllLocations.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin"></div>
                        </div>
                      ) : getAllLocations?.data?.locations ? (
                        <select
                          id="postoffice_location_id"
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.postoffice_location_id
                              ? "border-red-500"
                              : ""
                          }`}
                          {...register("postoffice_location_id")}
                        >
                          <option
                            value={
                              employeeInfo.data?.employee
                                ?.postoffice_location_id ?? "-1"
                            }
                          >
                            {employeeInfo.data.employee
                              .postoffice_locationname ?? "Select A Location"}
                          </option>

                          {getAllLocations?.data?.locations.map((location) => (
                            <option
                              value={location.postoffice_location_id}
                              key={location.postoffice_location_id}
                            >
                              {location.locationname}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <p>NO MANAGERS FOUND</p>
                        </div>
                      )}
                    </>
                  </div>
                  <div className="">
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Role
                    </label>
                    <select
                      defaultValue={getRole(employeeInfo.data.employee.role)}
                      {...register("role", { valueAsNumber: true })}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.role ? "border-red-500" : ""
                      }`}
                    >
                      <option value={1}>Clerk</option>
                      <option value={2}>Driver</option>
                      <option value={3}>Manager</option>
                      {/* <option value={4}>Supervisor</option> */}
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      {...register("salary")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.salary ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex -mx-3 mb-6">
                      <div className="w-full px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address_street"
                          placeholder="123 Jane Street"
                          {...register("address_street")}
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.address_street ? "border-red-500" : ""
                          }`}
                        />
                        {errors.address_street && (
                          <p className="text-red-500 text-xs italic">
                            Plsease fill out this field
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex  -mx-3 mb-6">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          placeholder="City"
                          {...register("address_city")}
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.address_city ? "border-red-500" : ""
                          }`}
                        />
                        {errors.address_city && (
                          <p className="text-red-500 text-xs italic">
                            Plsease fill out this field
                          </p>
                        )}
                      </div>

                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="Texas"
                          id="lastName"
                          {...register("address_state", {
                            required: true,
                          })}
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.address_state ? "border-red-500" : ""
                          }`}
                        />
                        {errors.address_state && (
                          <p className="text-red-500 text-xs italic">
                            Plsease fill out this field
                          </p>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                          Zip CODE
                        </label>
                        <input
                          type="number"
                          placeholder="000000"
                          id="lastName"
                          {...register("address_zipcode", {
                            required: true,
                          })}
                          className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                            errors.address_zipcode ? "border-red-500" : ""
                          }`}
                        />
                        {errors.address_zipcode && (
                          <p className="text-red-500 text-xs italic">
                            Plsease fill out this field
                          </p>
                        )}
                      </div>
                    </div>
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
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
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
      <div>{/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}</div>
    </div>
  );
};

export default EmployeeDetail;

// <div className="sm:col-span-2">
// <label
//   htmlFor="description"
//   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
// >
//   Description
// </label>
// <textarea
//   id="description"
//   rows={5}
//   className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//   placeholder="Write a description..."
// >
//   Keyboard - US
// </textarea>
// </div>
