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

export const AddLocation = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<postOfficeLocationSchemaType>({
    defaultValues: {
      locationname: "",
      address_street: "",
      address_city: "",
      address_state: "",
      address_zipcode: -1,
    },
    resolver: zodResolver(postOfficeLocationSchema),
  });

  const { mutateAsync, isLoading } = trpc.location.create.useMutation({
    onSuccess: () => {
      navigate("/locations");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <div className="max-w-screen-md mx-auto p-5">
      <div className="bg-[#333533] p-10 rounded-md">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-50">
            Add A New Branch
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
                  id="locationname"
                  placeholder="Location Name"
                  {...register("locationname", { required: true })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.locationname ? "border-red-500" : ""
                  }`}
                />
                {errors.locationname && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>

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
                    valueAsNumber: true,
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

            <div className="flex items-center justify-center">
              {isLoading ? (
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

export const postOfficeLocationSchema = z.object({
  locationname: z.string(),
  address_street: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_zipcode: z.number(),
});

export type postOfficeLocationSchemaType = z.infer<
  typeof postOfficeLocationSchema
>;

// CREATE TABLE "POSTOFFICE_LOCATION" (
//   "postoffice_location_id" TEXT NOT NULL, --Pkey
//   "locationname" TEXT NOT NULL,
//   "address_street" TEXT NOT NULL,
//   "address_city" TEXT NOT NULL,
//   "address_state" TEXT NOT NULL,
//   "address_zipcode" INTEGER NOT NULL,
//   "phonenumber" INTEGER NOT NULL,
//   "email" TEXT NOT NULL,
//   "postoffice_location_manager" TEXT NOT NULL,    --uses Fkey

//   "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "createdBy" TEXT NOT NULL, --employee ID
//   "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedBy" TEXT NOT NULL, --employee ID

//   CONSTRAINT "POSTOFFICE_LOCATION_PK" PRIMARY KEY ("postoffice_location_id"),
//   CONSTRAINT "POSTOFFICE_LOCATION_MANAGER_FK" FOREIGN KEY ("postoffice_location_manager") REFERENCES "EMPLOYEE"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
// );
