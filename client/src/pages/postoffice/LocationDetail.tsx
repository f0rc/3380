import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { getAllOfficeLocations } from "../../../../server/trpc/router/location";

const LocationDetail = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [modalIsOpen2, setModalIsOpen2] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal2 = async () => {
    await getAllManagers.refetch();
    setModalIsOpen2(true);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
  };
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/");
  }

  // console.log("STATE: ", state);

  const getLocationDetail = trpc.location.getLocationDetails.useQuery({
    postoffice_location_id: state.data,
  });

  // console.log("LOCATION DETAIL: ", getLocationDetail.data?.location);

  const getAllManagers = trpc.employee.getAllManagers.useQuery(undefined, {
    enabled: false,
  });

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      manager_id: "",
    },
  });

  useEffect(() => {
    // console.log("USE", getLocationDetail.data?.location?.manager_lastname);
  }, [getLocationDetail]);

  const setManager = trpc.location.setManager.useMutation({
    onSuccess: (data) => {
      // console.log("SUCCESS", data.message);
      closeModal2();
      getLocationDetail.refetch();
    },
    onError: (error) => {
      // console.log("ERROR", error);
    },
  });

  const submitManagerUpdate = handleSubmit(async (updateManager) => {
    await setManager.mutateAsync({
      postoffice_location_id: state.data,
      manager_id: updateManager.manager_id,
    });
    // console.log(updateManager);
  });

  return (
    <div>
      <div className="min-h-[80hv]">
        <div className="flex align-middle">
          <div className="container mx-40 mt-10">
            <div className="flex justify-center gap-x-4">
              <h1 className="text-4xl font-bold text-center">
                Location Details
              </h1>
            </div>

            <div className="flex justify-center items-center">
              <div className="flex flex-wrap mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-1/2 flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Location Name:</h1>
                    <p>{getLocationDetail.data?.location?.locationname}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Address:</h1>
                    <p>
                      {getLocationDetail.data?.location?.address_street},{" "}
                      {getLocationDetail.data?.location?.address_city},{" "}
                      {getLocationDetail.data?.location?.address_state},{" "}
                      {getLocationDetail.data?.location?.address_zipcode}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Manager Lastname:</h1>
                    {getLocationDetail.data?.location?.manager_lastname ? (
                      <p>
                        {getLocationDetail.data?.location?.manager_lastname}
                      </p>
                    ) : (
                      <div className="flex justify-start items-center">
                        <button
                          className="text-white bg-green-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center  hover:bg-calm-yellow hover:text-black"
                          type="button"
                          onClick={openModal2}
                        >
                          Assign Manager
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Employee Count:</h1>
                    <p>{getLocationDetail.data?.location?.employee_count}</p>
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
                Update Location
              </button>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(packageDetails, null, 2)}</pre> */}
      </div>

      <div className="flex">
        <Modal
          isOpen={modalIsOpen2}
          appElement={document.getElementById("root")!}
          onRequestClose={closeModal2}
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
                  onClick={closeModal2}
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
              <form onSubmit={submitManagerUpdate}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Manager
                    </label>
                    <>
                      {getAllManagers.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin"></div>
                          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin"></div>
                          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin"></div>
                        </div>
                      ) : getAllManagers?.data?.employees ? (
                        <select
                          id="manager_id"
                          className="block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-gray-400 dark:focus:shadow-outline-gray focus:border-primary-300 focus:outline-none focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          {...register("manager_id")}
                        >
                          <option value="0" disabled>
                            Select Manager
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
                    {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Update Location
                    </button>
                    <button
                      type="button"
                      onClick={closeModal2}
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
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LocationDetail;
