import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link, useNavigate } from "react-router-dom";
import Spinner from "../icons/Spinner";
import { LoginInput, loginSchema } from "../../../server/trpc/auth/authSchema";
import { trpc } from "../utils/trpc";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isLoading } = trpc.auth.signin.useMutation({
    onSuccess: (data) => {
      // console.log(data);
    },

    onError: (error) => {
      // console.log(error);
      reset({
        email: watch("email"),
        password: "",
      });
      setError("root", {
        type: "manual",
        message: "Invalid email or password",
      });

      if (error.data?.httpStatus === 409) {
      }
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await mutateAsync(data);

      if (result.status === "success") {
        navigate("/");
        window.location.reload();
      } else {
        // console.log("error", result);
      }
    } catch (err) {
      // console.log(err);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden">
      <div className="container flex flex-col items-center justify-center">
        <div className="bg-[#333533] p-10 rounded-md w-3/5 lg:w-[50%]">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-50">
              Login
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center align-middle">
            {errors.root?.message && (
              <p className="text-red-500 text-xs italic">
                {errors.root?.message}
              </p>
            )}

            <form onSubmit={onSubmit} className="w-2/3 ">
              <div className="flex flex-col -mx-3 mb-6 ">
                <div className="">
                  <div className="w-full px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      id="email"
                      {...register("email", {
                        required: true,
                      })}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none ' ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs italic">
                        Plsease fill out this field
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-50 text-xs font-bold mb-2">
                      First Name
                    </label>
                    <input
                      type="password"
                      placeholder="password"
                      id="password"
                      {...register("password", {
                        required: true,
                      })}
                      className={`'appearance-none block w-full bg-transparent border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none foc' ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs italic">
                        Plsease fill out this field
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link className="text-calm-yellow" to="/signup">
                    Sign up
                  </Link>
                </p>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <button type="submit" className="formButton">
                    Log in
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default Login;
