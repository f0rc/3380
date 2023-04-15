import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ref, uploadBytes } from "firebase/storage";

import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { storage } from "../../utils/firebase";
import { v4 } from "uuid";
import Spinner from "../../icons/Spinner";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

export const AddProduct = () => {
  const navigo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<createProductSchemaType>({
    defaultValues: {
      product_name: "",
      product_description: "",
      price: -1,
      product_image: null,
      quantity: -1,
    },
    resolver: zodResolver(createProductSchema),
  });

  const { mutateAsync, isLoading } = trpc.product.create.useMutation({
    onSuccess: (data) => {
      navigo("/product/" + data.product.product_id);
    },
  });

  const [isUploading, setUploading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    // console.log("data", data.product_image[0]);
    setUploading(true);
    const imageRef = ref(storage, `images/${v4()}`);
    const snapshot = await uploadBytes(imageRef, data.product_image[0]);
    // console.log("snapshot", snapshot);

    data.product_image = snapshot.metadata.fullPath;
    setUploading(false);
    await mutateAsync(data);
  });

  return (
    <div className="max-w-screen-md mx-auto p-5">
      <div className="bg-[#333533] p-10 rounded-md">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-50">
            Add A New Product
          </h3>
        </div>
        <div>
          {errors.root?.message && (
            <p className="text-red-500 text-xs italic">
              {errors.root?.message}
            </p>
          )}

          <form className="w-full" onSubmit={onSubmit}>
            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  id="product_name"
                  placeholder="ITEM NAME"
                  {...register("product_name", { required: true })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.product_name ? "border-red-500" : ""
                  }`}
                />
                {errors.product_name && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>

            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  id="product_description"
                  placeholder="ITEM DESCRIPTION"
                  {...register("product_description", { required: true })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.product_description ? "border-red-500" : ""
                  }`}
                />
                {errors.product_description && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>

            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  {...register("price", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.price ? "border-red-500" : ""
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  {...register("quantity", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.quantity ? "border-red-500" : ""
                  }`}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>
            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Upload file
                </label>
                <input
                  // className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.product_image ? "border-red-500" : ""
                  }`}
                  type="file"
                  id="product_image"
                  {...register("product_image")}
                />
                {errors.product_image && (
                  <p className="text-red-500 text-xs italic">
                    {errors.product_image?.message?.toString()}
                  </p>
                )}

                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="product_image"
                >
                  PNG, JPG or WEBP (MAX. 5MB)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              {isLoading || isUploading ? (
                <Spinner />
              ) : (
                <button type="submit" className="formButton">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </div>
  );
};

const MAX_FILE_SIZE = 500000000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createProductSchema = z.object({
  product_name: z.string().min(1).max(255),
  product_description: z.string().min(1).max(255),
  price: z.number().min(0),
  quantity: z.number().min(0),
  product_image: z
    .any()
    .refine((files) => files?.length > 0, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

export type createProductSchemaType = z.infer<typeof createProductSchema>;
