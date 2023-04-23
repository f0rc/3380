import { zodResolver } from "@hookform/resolvers/zod";
import produce from "immer";
import { useContext, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FormStateContext, defaultFormState } from "./Context";
import {
  createPackageFormSchema,
  packageInfoSchema,
  personInfoSchema,
  personSchemaType,
} from "./formSchema";

import Spinner from "../../icons/Spinner";

export const PackageInfoForm = (
  props: React.PropsWithChildren<{ onNext: () => void }>
) => {
  const { form, setForm } = useContext(FormStateContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      packageType: form.steps.packageInfo.value.packageType,
      packageSize: form.steps.packageInfo.value.packageSize,
      packageWeight: form.steps.packageInfo.value.packageWeight,
      price: form.steps.packageInfo.value.price,
    },
  });

  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.packageInfo.dirty = isDirty;
        form.steps.packageInfo.valid = isValid;
      })
    );
  }, [isDirty, setForm, isValid]);

  const submitForm = (data: any) => {
    setForm(
      produce((form) => {
        form.steps.packageInfo = {
          valid: true,
          dirty: isDirty,
          value: data,
        };
      })
    );
    props.onNext();
  };

  return (
    <>
      <p>{errors.root?.message}</p>
      <div className="container justify-center">
        <h1 className="text-5xl font-extrabold tracking-tight  text-center pt-10 ">
          Package Details
        </h1>
        <form onSubmit={handleSubmit(submitForm)} className=" form-floating">
          <div className="flex flex-col  items-center justify-center gap-12 px-4 py-16">
            <div className="gap-4 flex flex-row space-x-3">
              <select
                className={`inputFieldRegister ${
                  errors.packageType && "border-red-500"
                }`}
                {...register("packageType", { required: "This is required" })}
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="envelope">Envelope</option>
                <option value="box">Box</option>
                <option value="other">Other</option>
              </select>
              {errors.packageType && (
                <span className="text-red-500">
                  {errors.packageType?.message}
                </span>
              )}

              <select
                className="inputFieldRegister"
                {...register("packageSize", { required: "This is required" })}
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra large">Extra Large</option>
              </select>
            </div>

            {errors.packageSize && (
              <span className="text-red-500">{errors.packageSize.message}</span>
            )}

            <input
              type="number"
              placeholder="Package Weight"
              className="inputFieldRegister"
              {...register("packageWeight", {
                valueAsNumber: true,
                required: "This is required",
                min: {
                  value: 1,
                  message: "Weight must be greater than 0",
                },
              })}
            />
            {errors.packageWeight && (
              <span className="text-red-500">
                {errors.packageWeight.message}
              </span>
            )}
            <button type="submit" className="formButton">
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export const ReciverInfoForm = (
  props: React.PropsWithChildren<{ onNext: () => void; onPrev: () => void }>
) => {
  const { form, setForm } = useContext(FormStateContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      firstName: form.steps.receiverInfo.value.firstName,
      lastName: form.steps.receiverInfo.value.lastName,
      phone: form.steps.receiverInfo.value.phone,
      email: form.steps.receiverInfo.value.email,
      address: form.steps.receiverInfo.value.address,
      city: form.steps.receiverInfo.value.city,
      state: form.steps.receiverInfo.value.state,
      zip: form.steps.receiverInfo.value.zip,
    },
  });

  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.packageInfo.dirty = isDirty;
        form.steps.packageInfo.valid = isValid;
      })
    );
  }, [isDirty, setForm, isValid]);

  const submitForm = (
    data: typeof defaultFormState.steps.receiverInfo.value
  ) => {
    console.log("submmiting", data);
    setForm(
      produce((form) => {
        form.steps.receiverInfo.value = data;
        form.steps.receiverInfo.valid = isValid;
        form.steps.receiverInfo.dirty = isDirty;
      })
    );
    props.onNext();
  };
  return (
    <div className="container justify-center p-10">
      <h1 className="text-5xl font-extrabold tracking-tight  text-center ">
        Reciver Details
      </h1>
      <form onSubmit={handleSubmit(submitForm)} className=" form-floating">
        <div className="grid grid-cols-2  gap-12 px-4 py-16">
          {/* <div className="flex flex-col"> */}
          <input
            type="text"
            placeholder={`${
              errors.firstName ? "Please Enter a First Name" : "First Name"
            }`}
            className={`inputFieldRegister decoration-none ${
              errors.firstName &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("firstName", { required: "This is required" })}
          />
          <input
            type="text"
            placeholder={`${
              errors.lastName ? "Please Enter a Last Name" : "Last Name"
            }`}
            className={`inputFieldRegister decoration-none ${
              errors.lastName &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("lastName", { required: "This is required" })}
          />

          <input
            type="email"
            placeholder={`${errors.email ? "Please Enter a Email" : "Email"}`}
            className={`inputFieldRegister decoration-none ${
              errors.email &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("email", { required: "This is required" })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="inputFieldRegister"
            {...register("phone")}
          />
          <input
            type="text"
            placeholder={`${
              errors.address
                ? "Please Enter a Street Address"
                : "Street Address"
            }`}
            className={`inputFieldRegister decoration-none ${
              errors.address &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("address", { required: "This is required" })}
          />
          <input
            type="text"
            placeholder={`${errors.city ? "Please Enter a City" : "City"}`}
            className={`inputFieldRegister decoration-none ${
              errors.city &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm"
            }`}
            {...register("city", { required: "This is required" })}
          />
          <input
            type="text"
            placeholder={`${errors.state ? "Please Enter a State" : "State"}`}
            className={`inputFieldRegister decoration-none ${
              errors.state &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("state", { required: "This is required" })}
          />
          <input
            type="number"
            placeholder={`${errors.zip ? "Please Enter a ZipCode" : "ZipCode"}`}
            className={`inputFieldRegister decoration-none ${
              errors.zip &&
              "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
            }`}
            {...register("zip", { required: "This is required" })}
          />
        </div>
        <div className="flex gap-4 items-center justify-center">
          <button type="button" className="formButton" onClick={props.onPrev}>
            Previous
          </button>
          <button type="submit" className="formButton">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export const SenderInfoForm = (
  props: React.PropsWithChildren<{
    onNext: () => void;
    onPrev: () => void;
  }>
) => {
  const { form, setForm } = useContext(FormStateContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      firstName: form.steps.senderInfo.value.firstName,
      lastName: form.steps.senderInfo.value.lastName,
      email: form.steps.senderInfo.value.email,
      phone: form.steps.senderInfo.value.phone,
      address: form.steps.senderInfo.value.address,
      city: form.steps.senderInfo.value.city,
      state: form.steps.senderInfo.value.state,
      zip: form.steps.senderInfo.value.zip,
    },
  });

  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.senderInfo.dirty = isDirty;
      })
    );
  }, [isDirty, setForm, isValid]);

  const submitForm = (data: typeof defaultFormState.steps.senderInfo.value) => {
    setForm(
      produce((form) => {
        form.steps.senderInfo.value = data;
        form.steps.senderInfo.valid = isValid;
        form.steps.senderInfo.dirty = isDirty;
      })
    );
    props.onNext();
  };
  return (
    <>
      <div className="container justify-center p-10">
        <h1 className="text-5xl font-extrabold tracking-tight  text-center ">
          Sender Details
        </h1>
        <form onSubmit={handleSubmit(submitForm)} className=" form-floating">
          <div className="grid grid-cols-2  gap-12 px-4 py-16">
            {/* <div className="flex flex-col"> */}
            <input
              type="text"
              placeholder={`${
                errors.firstName ? "Please Enter a First Name" : "First Name"
              }`}
              className={`inputFieldRegister decoration-none ${
                errors.firstName &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("firstName", { required: "This is required" })}
            />
            <input
              type="text"
              placeholder={`${
                errors.lastName ? "Please Enter a Last Name" : "Last Name"
              }`}
              className={`inputFieldRegister decoration-none ${
                errors.lastName &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("lastName", { required: "This is required" })}
            />
            {/* {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )} */}
            {/* </div> */}
            {/* <div className="flex flex-row gap-4"> */}

            <input
              type="email"
              placeholder={`${errors.email ? "Please Enter a Email" : "Email"}`}
              className={`inputFieldRegister decoration-none ${
                errors.email &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("email", { required: "This is required" })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="inputFieldRegister"
              {...register("phone")}
            />
            {/* {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )} */}
            {/* </div> */}
            <input
              type="text"
              placeholder={`${
                errors.address
                  ? "Please Enter a Street Address"
                  : "Street Address"
              }`}
              className={`inputFieldRegister decoration-none ${
                errors.address &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("address", { required: "This is required" })}
            />
            <input
              type="text"
              placeholder={`${errors.city ? "Please Enter a City" : "City"}`}
              className={`inputFieldRegister decoration-none ${
                errors.city &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("city", { required: "This is required" })}
            />
            {/* {errors.city && (
              <span className="text-red-500">{errors.city.message}</span>
            )} */}
            <input
              type="text"
              placeholder={`${errors.state ? "Please Enter a State" : "State"}`}
              className={`inputFieldRegister decoration-none ${
                errors.state &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("state", { required: "This is required" })}
            />
            {/* {errors.state && (
              <span className="text-red-500">{errors.state.message}</span>
            )} */}
            <input
              type="number"
              placeholder={`${
                errors.zip ? "Please Enter a ZipCode" : "ZipCode"
              }`}
              className={`inputFieldRegister decoration-none ${
                errors.zip &&
                "border-red-500 placeholder:text-red-500/50 placeholder:text-sm text-xs"
              }`}
              {...register("zip", { required: "This is required" })}
            />
          </div>
          <div className="flex gap-4 items-center justify-center">
            <button type="button" className="formButton" onClick={props.onPrev}>
              Previous
            </button>
            <button type="submit" className="formButton">
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export const SummaryForm = (
  props: React.PropsWithChildren<{
    onNext: () => void;
    onPrev: () => void;
    submitForm: () => void;
    isLoading: boolean;
  }>
) => {
  const { form } = useContext(FormStateContext);
  return (
    <div className="container justify-center p-10">
      <h1 className="text-5xl font-extrabold tracking-tight  text-center ">
        Summary
      </h1>
      <div className=" form-floating">
        <div className="grid grid-cols-2  gap-12 px-4 py-16">
          <div className="flex flex-col">
            <label className="text-2xl font-bold">Sender Details:</label>
            <label className="text-xl">
              {form.steps.senderInfo.value.firstName}{" "}
              {form.steps.senderInfo.value.lastName}
            </label>
            <label className="text-xl">
              {form.steps.senderInfo.value.email}
            </label>
            <label className="text-xl">
              {form.steps.senderInfo.value.phone}
            </label>
            <label className="text-xl">
              {form.steps.senderInfo.value.address}
            </label>
            <label className="text-xl">
              {form.steps.senderInfo.value.city},{" "}
              {form.steps.senderInfo.value.state}{" "}
              {form.steps.senderInfo.value.zip}
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-2xl font-bold">Receiver Details:</label>
            <label className="text-xl">
              {form.steps.receiverInfo.value.firstName}{" "}
              {form.steps.receiverInfo.value.lastName}
            </label>
            <label className="text-xl">
              {form.steps.receiverInfo.value.email}
            </label>
            <label className="text-xl">
              {form.steps.receiverInfo.value.phone}
            </label>
            <label className="text-xl">
              {form.steps.receiverInfo.value.address}
            </label>
            <label className="text-xl">
              {form.steps.receiverInfo.value.city},{" "}
              {form.steps.receiverInfo.value.state}{" "}
              {form.steps.receiverInfo.value.zip}
            </label>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          {props.isLoading ? (
            <button type="button" className="" disabled>
              <div className="flex justify-center">
                <Spinner />
              </div>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="formButton"
                onClick={props.onPrev}
              >
                Previous
              </button>

              <button
                type="submit"
                className="formButton"
                onClick={props.submitForm}
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
