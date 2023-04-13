import React, { useContext, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../utils/firebase";
import Spinner from "../../icons/Spinner";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import SkeletonImg from "../../icons/SkeletonImg";
import { AuthContext } from "../../auth/SessionProvider";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation();

  if (!id) return <div>Product not found</div>;

  const { data, isLoading, isError, isSuccess, refetch } =
    trpc.product.getOneProduct.useQuery({
      product_id: id,
      locationId: state?.locationId,
    });
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  useEffect(() => {
    const getImages = async () => {
      if (!data?.product.product_image) return;
      const imageStorageRef = ref(storage, data?.product.product_image);
      getDownloadURL(imageStorageRef).then((url) => {
        setImageUrl(url);
      });
    };
    getImages();
  }, [data]);

  //   MODAL INFO:
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const openModal = async () => {
    setModalLoading(true);
    // await employeeInfo.refetch();
    // await getAllManagers.refetch();
    // await getAllLocations.refetch();
    // reset();
    setModalLoading(false);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      product_name: data?.product.product_name,
      product_description: data?.product.product_description,
      price: data?.product.price,
      productImage: data?.product.product_image,
      available_quantity: data?.product.available_quantity,
    },
  });

  const { authenticated } = useContext(AuthContext);

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      setModalIsOpen(false);
      refetch();
    },
  });

  const onSubmit = handleSubmit(async (updateData) => {
    // console.log(updateData);
    await updateProduct.mutateAsync({
      product_id: id,
      product_name: updateData.product_name,
      product_description: updateData.product_description,
      price: updateData.price,
      quantity: updateData.available_quantity,
      product_image: updateData.productImage,
    });
  });

  useEffect(() => {
    reset({
      product_name: data?.product.product_name,
      product_description: data?.product.product_description,
      price: data?.product.price,
      available_quantity: data?.product.available_quantity,
      productImage: data?.product.product_image,
    });
  }, [data?.product]);

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {},
  });

  const handleDelete = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    await deleteProduct.mutateAsync({
      product_id: id,
    });
    navigate("/products");
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-[80hv]">
      <div className="flex align-middle">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {isSuccess ? (
          <div className="container mx-40 mt-10">
            <div className="flex justify-center gap-x-4">
              <h1 className="text-4xl font-bold text-center uppercase">
                {data?.product.product_name} Details
              </h1>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-1/2 flex-col items-center justify-center">
                <div className="flex flex-col gap-2">
                  {imageUrl ? (
                    <img
                      src={imageUrl!}
                      alt="product image"
                      className="w-40 h-40 object-contain"
                    />
                  ) : (
                    <SkeletonImg />
                  )}
                </div>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Description</h1>
                    <p>{data.product.product_description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Price</h1>
                    <p>${data.product.price}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-bold">Available Quantity</h1>
                    <p>{data.product.available_quantity}</p>
                  </div>
                </div>
                {authenticated?.user?.role === 3 && (
                  <div className="flex justify-center mt-10">
                    {modalLoading ? (
                      <Spinner />
                    ) : (
                      <button
                        onClick={openModal}
                        className="block text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-calm-yellow hover:bg-zinc-900"
                        type="button"
                      >
                        Update Product
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          </div>
        ) : (
          <Spinner />
        )}
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
                  Update {data?.product.product_name}
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
                      Product Name
                    </label>
                    <input
                      type="text"
                      {...register("product_name")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.product_name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Product Description
                    </label>
                    <input
                      type="text"
                      {...register("product_description")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.product_description ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      {...register("price", {
                        valueAsNumber: true,
                      })}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.price ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      {...register("available_quantity", {
                        valueAsNumber: true,
                      })}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.available_quantity ? "border-red-500" : ""
                      }`}
                    />
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
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
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
                    DELETE
                  </button>
                  {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
