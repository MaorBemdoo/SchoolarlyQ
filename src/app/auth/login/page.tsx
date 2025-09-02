/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginSchema } from "@/utils/validators";
import toast from "@/utils/toast";
import { TbAlertTriangle } from "react-icons/tb";
type LoginForm = yup.InferType<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const onCredentialSubmit = async (values: LoginForm) => {
    try {
      setCredentialLoading(true);
      const res = await signIn("credentials", {
        usernameOrEmailOrMatric: values.email,
        password: values.password,
        redirect: false,
      });
      if (res?.error) throw new Error("Invalid credentials");
      router.push("/quiz");
    } catch (error: any) {
      toast.error(error.message || "Error logging user");
    } finally {
      setCredentialLoading(false);
    }
  };

  const onGoogleSubmit = async () => {
    try {
      setGoogleLoading(true);
      const res = await signIn("google", { redirectTo: "/quiz" });
      if (res?.error) throw new Error("Google login failed");
    } catch (error: any) {
      toast.error(error.message || "Error logging user");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.form
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-[380px] bg-slate-50 p-4 border border-black rounded-md space-y-6 dark:border-white dark:bg-[#121212] !md:bg-inherit"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-600 text-sm font-semibold dark:text-gray-300">
          Welcome Back!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input {...field} placeholder="Email or Matric Number" className={`form-input ${errors.email ? "error" : ""}`} />
            )}
          />
          {errors.email && <p className="text-sm text-red-500 flex gap-1 items-center"><TbAlertTriangle />{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                className={`form-input ${errors.password ? "error" : ""}`}
              />
            )}
          />
          <div
            className="absolute right-6 top-[22px] -translate-y-1/2 text-2xl cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.password && <p className="text-sm text-red-500 flex gap-1 items-center"><TbAlertTriangle />{errors.password.message}</p>}
        </div>

        <Button
          className="w-full self-center"
          onClick={handleSubmit(onCredentialSubmit)}
          loading={credentialLoading}
          disabled={googleLoading}
        >
          Submit
        </Button>

        <AppLink href="/auth/register" className="self-end text-sm hover:underline">
          Don&apos;t have an account? Register
        </AppLink>
      </div>

      <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>

      <div className="flex flex-col items-center">
        <Button
          variant="custom"
          className="flex items-center justify-center gap-[7px] min-w-[200px] p-3 !text-black border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onGoogleSubmit}
          loading={googleLoading}
          disabled={credentialLoading}
        >
          <Image src="/google.png" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </Button>
      </div>
    </motion.form>
  );
};

export default Login;
