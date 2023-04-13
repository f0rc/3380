import React, { useContext, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { getProductWithQuantity } from "../../../../server/trpc/router/product";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/SessionProvider";
import Spinner from "../../icons/Spinner";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

interface CartItem extends getProductWithQuantity {
  quantity: number;
}

export type propsType = {
  locationId: string;
};

const getImageUrl = async (imageRef: string) => {
  const imageStorageRef = ref(storage, imageRef);
  const url = await getDownloadURL(imageStorageRef);
  return url;
};

const ListProducts = (props: propsType) => {
  const { data, isLoading, isError, isSuccess, refetch } =
    trpc.product.getAllProducts.useQuery({
      locationId: props.locationId,
    });

  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: getProductWithQuantity) => {
    if (!canAddToCart(product)) {
      return;
    }

    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? { ...existingProduct, quantity: existingProduct.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const canAddToCart = (product: getProductWithQuantity) => {
    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );
    const productQuantity = data?.products.find(
      (item) => item.product_id === product.product_id
    )?.available_quantity;

    if (existingProduct && productQuantity) {
      return existingProduct.quantity < productQuantity;
    }
    return true;
  };

  const canRemoveFromCart = (product: getProductWithQuantity) => {
    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );
    const productQuantity = data?.products.find(
      (item) => item.product_id === product.product_id
    )?.available_quantity;

    if (existingProduct && productQuantity) {
      return existingProduct.quantity > 1;
    }
    return false;
  };

  const removeFromCart = (product: getProductWithQuantity) => {
    if (!canRemoveFromCart(product)) {
      return;
    }

    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );

    if (existingProduct && existingProduct.quantity === 1) {
      setCart(cart.filter((item) => item.product_id !== product.product_id));
    } else if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? { ...existingProduct, quantity: existingProduct.quantity - 1 }
            : item
        )
      );
    }
  };

  const transaction = trpc.product.createOrder.useMutation({
    onSuccess: () => {},
  });

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const { authenticated } = useContext(AuthContext);

  const [productImageUrl, setProductImageUrl] = React.useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!data?.products[0].product_image) return;

      data.products.forEach(async (product) => {
        const url = await getImageUrl(product.product_image);
        setProductImageUrl(
          (prev) => new Map(prev.set(product.product_id, url))
        );
      });
    };

    fetchImageUrls();
  }, [data]);

  const customerInfo = trpc.product.getCustomnerInfo.useQuery();

  const {
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      first_name: customerInfo.data?.customer?.firstname,
      last_name: customerInfo.data?.customer?.lastname,
      email: authenticated?.user?.email,
      phone_number: customerInfo.data?.customer?.phonenumber,
      customer_address: customerInfo.data?.customer?.address_street,
      customer_city: customerInfo.data?.customer?.address_city,
      customer_state: customerInfo.data?.customer?.address_state,
      customer_zip: customerInfo.data?.customer?.address_zipcode,
    },
  });

  console.log(authenticated?.user?.email);

  useEffect(() => {
    reset({
      first_name: customerInfo.data?.customer?.firstname,
      last_name: customerInfo.data?.customer?.lastname,
      email: authenticated?.user?.email,
      phone_number: customerInfo.data?.customer?.phonenumber,
      customer_address: customerInfo.data?.customer?.address_street,
      customer_city: customerInfo.data?.customer?.address_city,
      customer_state: customerInfo.data?.customer?.address_state,
      customer_zip: customerInfo.data?.customer?.address_zipcode,
    });
  }, [customerInfo.data]);

  const { mutateAsync } = trpc.product.updateCustomerInfo.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const onSubmit = handleSubmit(async (updateData) => {
    // console.log(updateData);
    await mutateAsync({
      email: watch("email"),
      firstname: watch("first_name"),
      lastname: updateData.last_name,
      phonenumber: updateData.phone_number,
      address_street: updateData.customer_address,
      address_city: updateData.customer_city,
      address_state: updateData.customer_state,
      address_zipcode: updateData.customer_zip,
    });

    const order = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
    }));
    await transaction.mutateAsync({
      products: order,
      postoffice_location_id: props.locationId,
    });
    await refetch();
    setCart([]);
  });

  const canAddTOCart = (product: getProductWithQuantity) => {
    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );
    const productQuantity = data?.products.find(
      (item) => item.product_id === product.product_id
    )?.available_quantity;

    if (existingProduct && productQuantity) {
      return existingProduct.quantity < productQuantity;
    }
    return true;
  };

  const navigate = useNavigate();

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

  return (
    // <div className="flex flex-col justify-center items-center align-middle w-full h-screen">
    <div className="flex flex-row  h-[75vh]">
      {/* left column */}
      <div className="flex justify-center items-center  align-middle w-3/4  border-gray-500">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-center pb-4">Products</h1>

          <div className="">
            {/* make a 3 columns of products and make each item into its own card with image as the center and add to cart under and price */}
            <div className="flex flex-wrap gap-4 justify-center">
              {data?.products.map((product) => (
                <div
                  className="flex flex-col w-1/4 p-4 hover:shadow-lg rounded-md border cursor-pointer "
                  key={product.product_id}
                >
                  <div
                    className="flex-1 flex-col justify-center items-center align-middle flex"
                    onClick={() =>
                      navigate(`/product/${product.product_id}`, {
                        state: { locationId: props.locationId },
                      })
                    }
                  >
                    <img
                      src={productImageUrl.get(product.product_id)}
                      alt={product.product_name}
                      className={
                        `w-40 h-40 object-contain` +
                        ` ${
                          product.available_quantity === 0 ? "opacity-20 " : ""
                        }`
                      }
                    />
                    <div className="flex flex-col items-center justify-between gap-3">
                      <h2 className="text-lg font-bold">
                        {product.product_name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {product.available_quantity} items in stock
                      </p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-col mt-1">
                    <button
                      disabled={
                        (canAddToCart(product) ? false : true) ||
                        product.available_quantity === 0
                      }
                      className={
                        `px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md` +
                        ` ${
                          (canAddTOCart(product) ? false : "opacity-50") ||
                          product.available_quantity === 0
                            ? "opacity-50"
                            : ""
                        }`
                      }
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* right column */}

      {authenticated ? (
        <div className="flex w-1/4 justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Cart</h1>
            <ul className="m-4">
              {cart.map((product) => (
                <li key={product.product_id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={productImageUrl.get(product.product_id)}
                        alt={product.product_name}
                        className="w-10 h-10 mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-bold">
                          {product.product_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        className={
                          `px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md` +
                          ` ${
                            product.quantity === 1
                              ? "opacity-50"
                              : false || product.available_quantity === 0
                              ? "opacity-50"
                              : false
                          }`
                        }
                        onClick={() => removeFromCart(product)}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md">
                        {product.quantity}
                      </span>
                      <button
                        className={
                          `px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md` +
                          ` ${
                            (canAddTOCart(product) ? false : "opacity-50") ||
                            product.available_quantity === 0
                              ? "opacity-50"
                              : false
                          }`
                        }
                        onClick={() => addToCart(product)}
                        disabled={
                          (canAddToCart(product) ? false : true) ||
                          product.available_quantity === 0
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-4">
              <div>
                <h2 className="text-lg font-bold">Total</h2>
                <p className="text-sm text-gray-500">
                  $
                  {cart.reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  )}
                </p>
              </div>
              <button
                className={
                  `px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md` +
                  ` ${cart.length === 0 ? "opacity-50" : ""}`
                }
                onClick={openModal}
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-1/4 justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Cart</h1>
            Please Sign up or Log In to view your cart
          </div>
        </div>
      )}

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
                  Customer Information
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
                      {...register("first_name")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.first_name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("last_name")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.last_name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      {...register("phone_number")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.phone_number ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2 opacity-50">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled={true}
                      {...register("email")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none ' ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Address Street
                    </label>
                    <input
                      type="text"
                      {...register("customer_address")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.customer_address ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Address City
                    </label>
                    <input
                      type="text"
                      {...register("customer_city")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.customer_city ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Address state
                    </label>
                    <input
                      type="text"
                      {...register("customer_state")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.customer_state ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      Address zipcode
                    </label>
                    <input
                      type="text"
                      {...register("customer_zip")}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.customer_zip ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Submit Order
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
                  {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    // </div>
  );
};

export default ListProducts;
