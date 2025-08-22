"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const credentialSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        usernameOrEmailOrMatric: email,
        password,
        redirect: false,
      });
      if (res?.error) {
        throw new Error("Invalid credentials");
      }
      router.push("/quiz");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Error logging user");
    } finally {
      setLoading(false);
    }
  };

  const googleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await signIn("google", { redirectTo: "/quiz" });
      if (res?.error) {
        throw new Error("Invalid credentials");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Error logging user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-[380px] bg-slate-50 p-4 border border-black rounded-md space-y-6 text-center dark:border-white dark:bg-[#121212] !md:bg-inherit"
    >
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-600 text-sm font-semibold dark:text-gray-300">
          Welcome Back!
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email or Matric Number"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="false"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <Button
          className="w-full self-center"
          loading={loading}
          onClick={credentialSubmit}
        >
          Submit
        </Button>
        <AppLink
          href="/auth/register"
          className="self-end text-sm hover:underline"
        >
          Don&apos;t have an account? Register
        </AppLink>
      </div>
      <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
      <div className="flex flex-col items-center">
        <Button
          variant="custom"
          className="flex items-center justify-center gap-[7px] min-w-[200px] p-3 !text-black border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
          onClick={googleSubmit}
          loading={loading}
        >
          <Image src="/google.png" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </Button>
      </div>
    </motion.form>
  );
};
export default Login;
