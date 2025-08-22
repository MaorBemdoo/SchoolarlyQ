"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { faculties } from "@/data/faculties";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step")) || 1;
  const router = useRouter();
  const { data, update, status } = useSession()

  useEffect(() => {
    if(status === "loading") return;
    if (step < 1 || step > 2) {
      router.push("/auth/register?step=1");
    }
    if (step === 2 && status === "unauthenticated") {
      router.push("/auth/register?step=1");
    }
  }, [step, router, data, status]);

  const credentialsSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!fullname || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords are not the same");
      return;
    }
    if (data && data.user?.email == email) {
      router.push("/auth/register?step=2");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/register", {
        full_name: fullname,
        email,
        password,
        step: 1,
        type: "credentials",
      });
      update()
      router.push("/auth/register?step=2");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while registering",
      );
    } finally {
      setLoading(false);
    }
  };

  const googleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      setLoading(true);
      // await axios.post("/api/auth/register", {
      //   step: 1,
      //   type: "google",
      // });
      const res = await signIn("google", { redirectTo: "/auth/register?step=2" });
      if (res?.error) {
        throw new Error(res?.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while registering",
      );
    } finally {
      setLoading(false);
    }
  }

  const step2Submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!matricNumber || !department || !level) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/register", {
        email: data && data.user?.email,
        matric_number: matricNumber,
        department,
        level,
        step: 2,
      });
      router.push("/auth/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while registering",
      );
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
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-gray-600 text-sm font-semibold dark:text-gray-300">
          Get started with SchoolaryQ
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {step == 1 ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Matric Number"
              className="form-input"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
            />
            <select
              name="department"
              id="department"
              className="form-input dark:*:text-black"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" className="opacity-80" disabled>
                Select Department
              </option>
              {faculties.map(({ faculty, departments }) => (
                <optgroup key={faculty} label={faculty}>
                  {departments.map(({ id, name }) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              name="level"
              id="level"
              className="form-input dark:*:text-black"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>
                Select Level
              </option>
              {["IJMB", "100", "200", "300", "400", "500", "600", "700"].map(
                (lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ),
              )}
            </select>
          </>
        )}
        <Button
          className="w-full self-center"
          onClick={step == 1 ? credentialsSubmit : step2Submit}
          loading={loading}
        >
          {step == 1 ? "Continue" : "Submit"}
        </Button>
        { step == 1 && (
          <AppLink
            href="/auth/login"
            className="self-end text-sm hover:underline"
          >
            Already have an Account? <span className="font-semibold">Login</span>
          </AppLink>
        )}
      </div>
      { step == 1 && (
        <>
          <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-slate-50 dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
          <div className="flex flex-col items-center">
            <Button
              variant="custom"
              className="flex items-center justify-center gap-[7px] p-3 min-w-[200px] !text-black border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
              onClick={googleSubmit}
              loading={loading}
            >
              <Image src="/google.png" alt="Google logo" width={20} height={20} />
              Sign up with Google
            </Button>
          </div>
        </>
      ) }
    </motion.form>
  );
};
export default Register;
