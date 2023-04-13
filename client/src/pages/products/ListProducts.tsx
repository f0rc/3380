import React, { useContext, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { getProductWithQuantity } from "../../../../server/trpc/router/product";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/SessionProvider";

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
                onClick={handleCheckout}
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
    </div>
    // </div>
  );
};

export default ListProducts;
