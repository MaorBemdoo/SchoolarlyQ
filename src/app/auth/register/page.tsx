"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form className="w-[380px] p-4 border border-black rounded-md space-y-6 text-center dark:border-white">
      <div>
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-gray-300 text-sm font-semibold">
          Get started with SchoolaryQ
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Full Name" className="form-input" />
        <input type="text" placeholder="Username" className="form-input" />
        <input type="text" placeholder="Email" className="form-input" />
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="false"
            placeholder="Password"
            className="form-input"
          />
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-input"
        />
        <Button className="w-fit self-center">Continue</Button>
        <AppLink
          href="/auth/login"
          className="self-end text-sm hover:underline"
        >
          ALready have an Account? <span className="font-semibold">Login</span>
        </AppLink>
      </div>
      <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
      <div className="flex flex-col items-center">
        <Button
          variant="custom"
          className="flex items-center justify-center gap-[7px] p-3 !text-black border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
          onClick={(e) => {
            e.preventDefault();
            signIn("google", { redirect: false });
          }}
        >
          <Image src="/google.png" alt="Google logo" width={20} height={20} />
          Sign up with Google
        </Button>
      </div>
    </form>
  );
};
export default Register;
