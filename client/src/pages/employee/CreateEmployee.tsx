import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/SessionProvider";

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<employeeSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      role: 1,
      salary: -1,
      startDate: "",
      address_street: "",
      address_city: "",
      address_state: "",
      address_zipcode: "",
    },
    resolver: zodResolver(employeeSchema),
  });

  const { mutateAsync } = trpc.employee.createEmployee.useMutation({
    onSuccess: () => {
      navigate("/employee-list");
    },
  });

  const { authenticated } = useContext(AuthContext);

  const onSubmit = handleSubmit(async (data) => {
    // console.log("data", data);
    await mutateAsync(data);
  });

  return (
    <div className="max-w-screen-md mx-auto p-5">
      <div className="bg-[#333533] p-10 rounded-md">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-50">
            Create Employee
          </h3>
        </div>
        <div>
          {errors.root?.message && (
            <p className="text-red-500 text-xs italic">
              {errors.root?.message}
            </p>
          )}

          <form onSubmit={onSubmit} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  id="firstName"
                  {...register("firstName", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  id="lastName"
                  {...register("lastName", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  placeholder="Birth Date"
                  {...register("birthDate")}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.birthDate ? "border-red-500" : ""
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email@example.com"
                  id="lastName"
                  {...register("email", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
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

            <div className="flex -mx-3 mb-6"></div>

            <div className="flex -mx-3 mb-6">
              <div className="w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  SALARY
                </label>
                <input
                  type="number"
                  id="salary"
                  {...register("salary", { valueAsNumber: true })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.salary ? "border-red-500" : ""
                  }`}
                />
                {errors.salary && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
              <div className="w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  {...register("startDate")}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
              <div className="w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Role
                </label>
                <select
                  {...register("role", { valueAsNumber: true })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.role ? "border-red-500" : ""
                  }`}
                >
                  <option value={1}>Clerk</option>
                  <option value={2}>Driver</option>
                  {authenticated?.user?.role === 4 && (
                    <option value={3}>Manager</option>
                  )}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs italic">
                    Plsease fill out this field
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button type="submit" className="formButton">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </div>
  );
};

export const employeeSchema = z.object({
  email: z.string().email().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  birthDate: z.string().min(1).max(50),
  role: z.number().min(1).max(4),

  salary: z.number().min(1),

  address_street: z.string().min(1).max(50),
  address_city: z.string().min(1).max(50),
  address_state: z.string().min(1).max(50),
  address_zipcode: z.string().min(1).max(50),

  startDate: z.string().min(1).max(50),
});

export type employeeSchemaType = z.infer<typeof employeeSchema>;
