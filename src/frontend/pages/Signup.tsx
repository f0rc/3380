import { useForm } from "react-hook-form";
import { SignUpInput, signUpSchema } from "src/server/auth/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { api } from "src/server/utils/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });
  const [err, setErr] = useState("");

  const { mutateAsync } = api.signup.signUp.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },

    onError: (error) => {
      setErr(error.message);
      console.log(error);
      if (error.data?.httpStatus === 409) {
      }
    },
  });

  const onSubmit = useCallback(
    async (data: SignUpInput) => {
      try {
        const result = await mutateAsync(data);
        if (result.status === "success") {
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      }
    },
    [mutateAsync, navigate]
  );

  const handleInputChange = () => {
    setErr("");
    clearErrors();
  };
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-black">
        <form
          className="form-floating text-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16">
              <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                Create an account!
              </h2>
              {err && <p className="text-red-500">{err}</p>}
              <input
                type="text"
                placeholder="username"
                autoComplete="off"
                className={
                  (errors.username
                    ? "outline outline-offset-2 outline-pink-500"
                    : "") + " inputFieldRegister"
                }
                {...register("username", { required: true })}
                onChange={handleInputChange}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
              <input
                type="email"
                placeholder="email"
                className={
                  (errors.email
                    ? "outline outline-offset-2 outline-pink-500"
                    : "") + " inputFieldRegister"
                }
                {...register("email")}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
              <input
                type="password"
                placeholder="password"
                className={
                  (errors.password
                    ? "outline outline-offset-2 outline-pink-500"
                    : "") + " inputFieldRegister"
                }
                {...register("password")}
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
              <div className="card-actions flex flex-col items-center justify-between gap-4">
                <button
                  className="rounded-t-xl border-b border-[hsl(280,100%,70%)] py-2 px-4 text-center text-lg hover:bg-zinc-800"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;