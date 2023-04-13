import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { useNavigate } from "react-router-dom";

export const CreateDependent = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<dependentSchemaType>({
    defaultValues: {
      dependent_name: "",
      dependent_birthDate: "",
      employee_id: "",
      relationship: "",
    },
    resolver: zodResolver(dependentSchema),
  });

  const { mutateAsync } = trpc.dependent.createDependent.useMutation({
    onSuccess: () => {
      navigate("/dependent-list");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("data", data);
    await mutateAsync(data);
  });

  return (
    <div className="max-w-screen-md mx-auto p-5">
      <div className="bg-[#333533] p-10 rounded-md">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-50">
            Create Dependent
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
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  id="dependent_name"
                  {...register("dependent_name", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.dependent_name ? "border-red-500" : ""
                  }`}
                />
                {errors.dependent_name && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  placeholder="Birth Date"
                  id="dependent_birthDate"
                  {...register("dependent_birthDate", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.dependent_birthDate ? "border-red-500" : ""
                  }`}
                />
                {errors.dependent_birthDate && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Guardian Employee ID
                </label>
                <input
                  type="id"
                  placeholder="id"
                  id="employee_id"
                  {...register("employee_id", {
                    required: true,
                  })}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.employee_id ? "border-red-500" : ""
                  }`}
                />
                {errors.employee_id && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field
                  </p>
                )}
              </div>
            </div>
            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                  Relationship to Employee
                </label>
                <input
                  type="text"
                  id="relationship"
                  placeholder="Daughter"
                  {...register("relationship")}
                  className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                    errors.relationship ? "border-red-500" : ""
                  }`}
                />
                {errors.relationship && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field
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
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </div>
  );
};

export const dependentSchema = z.object({
  dependent_name: z.string().min(1).max(50),
  dependent_birthDate: z.string().min(1).max(50),
  employee_id: z.string(),
  relationship: z.string().min(1).max(50),
});

export type dependentSchemaType = z.infer<typeof dependentSchema>;
