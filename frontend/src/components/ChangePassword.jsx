import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import EyeShow from "../assets/pass-show.png";
import EyeHide from "../assets/pass-hide.png";
import Header from "./Header";
import Footer from "./Footer";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../helper/validate";
import { resetPassword } from "../helper/helper";
import { useAuthStore } from "../store/store";
import { useNavigate, Navigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setEnteredUsername } = useAuthStore();
  const enteredUsername = useAuthStore((state) => state.auth.enteredUsername);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        // Handle password change logic here
        let resetPromise = resetPassword({
          username: enteredUsername,
          password: values.password,
        });

        toast.promise(resetPromise, {
          loading: "Updating...!",
          success: <b>Reset Successfully...!</b>,
          error: <b>Could not Reset!</b>,
        });

        await resetPromise;
        setEnteredUsername("");
        navigate("/login");
      } catch (error) {
        console.error("Error resetting password:", error);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 201)
    return <Navigate to={"/login"} replace={true}></Navigate>;

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Header />
      <section className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    name="password"
                    id="password"
                    placeholder="Your new secret"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$&*%])[A-Za-z\d!@#\$&*%]{8,14}$"
                    title="Password must contain at least one lowercase, one uppercase, one special character, and be 8-14 characters long"
                  />
                  <img
                    src={showPassword ? EyeShow : EyeHide}
                    style={{ height: "2em", width: "2em" }}
                    onClick={togglePasswordVisibility}
                    className="pass-icon cursor-pointer absolute top-2 right-2"
                    alt="Toggle Password Visibility"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...formik.getFieldProps("confirm-password")}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-enter new secret"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$&*%])[A-Za-z\d!@#\$&*%]{8,14}$"
                    title="Password must contain at least one lowercase, one uppercase, one special character, and be 8-14 characters long"
                  />
                  <img
                    src={showConfirmPassword ? EyeShow : EyeHide}
                    style={{ height: "2em", width: "2em" }}
                    onClick={toggleConfirmPasswordVisibility}
                    className="pass-icon cursor-pointer absolute top-2 right-2"
                    alt="Toggle Confirm Password Visibility"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ChangePassword;
