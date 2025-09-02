"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { registerUser } from "@/actions/register";
import useAction from "@/hooks/useAction";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { step1RegisterSchema, step2RegisterSchema } from "@/utils/validators";
import toast from "@/utils/toast";
import { analyzeMatricNumber } from "@/utils/analyzeMatricNumber";
import { TbAlertTriangle } from "react-icons/tb";
import Link from "next/link";
import { MdOutlineInfo } from "react-icons/md";

type Step1Form = yup.InferType<typeof step1RegisterSchema>;
type Step2Form = yup.InferType<typeof step2RegisterSchema>;

const Register = () => {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step")) || 1;
  const router = useRouter();
  const { data, update, status } = useSession();
  const { status: registerStatus, res, execute } = useAction(registerUser);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control: controlStep1,
    handleSubmit: handleStep1Submit,
    formState: { errors: step1Errors },
  } = useForm<Step1Form>({ resolver: yupResolver(step1RegisterSchema) });

  const {
    control: controlStep2,
    handleSubmit: handleStep2Submit,
    setValue,
    formState: { errors: step2Errors },
  } = useForm<Step2Form>({ resolver: yupResolver(step2RegisterSchema) });

  useEffect(() => {
    if (status === "loading") return;
    if (step < 1 || step > 2) {
      router.push("/auth/register?step=1");
    }
    if (step === 2 && status === "unauthenticated") {
      router.push("/auth/register?step=1");
    }
  }, [step, router, data, status]);

  const onStep1Submit = async (values: Step1Form) => {
    if (data && data.user?.email === values.email) {
      router.push("/auth/register?step=2");
      return;
    }
    await execute(
      {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        type: "credentials",
      },
      1
    );

    if (res?.status === "success") {
      update();
      router.push("/auth/register?step=2");
    } else {
      toast.error(res?.message as string);
    }
  };

  const onStep2Submit = async (values: Step2Form) => {
    await execute(
      {
        email: (data && data.user?.email) || "",
        ...values,
      },
      2
    );

    if (res?.status === "success") {
      signOut({ redirect: false });
      router.push("/auth/login");
    } else {
      toast.error(res?.message || "An error occurred while registering");
    }
  };

  const googleSubmit = async () => {
    try {
      setLoading(true);
      const res = await signIn("google", { redirectTo: "/auth/register?step=2" });
      if (res?.error) throw new Error(res?.error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Google signup failed");
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-gray-600 text-sm font-semibold dark:text-gray-300">
          { step === 1 ? "Get started with SchoolaryQ" : "Almost there!" }
        </p>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <Controller
              name="full_name"
              control={controlStep1}
              render={({ field }) => (
                <input {...field} placeholder="Full Name" className={`form-input ${step1Errors.full_name ? "error" : ""}`} />
              )}
            />
            {step1Errors.full_name && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step1Errors.full_name.message}</p>}
          </div>
          
          <div>
            <Controller
              name="email"
              control={controlStep1}
              render={({ field }) => (
                <input {...field} type="email" placeholder="Email" className={`form-input ${step1Errors.email ? "error" : ""}`} />
              )}
            />
            {step1Errors.email && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step1Errors.email.message}</p>}
          </div>
          <div className="relative">
            <Controller
              name="password"
              control={controlStep1}
              render={({ field }) => (
                <input
                  {...field}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  className={`form-input ${step1Errors.password ? "error" : ""}`}
                />
              )}
            />
            <div
              className="absolute right-6 top-[22px] -translate-y-1/2 text-2xl cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
            {step1Errors.password && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step1Errors.password.message}</p>}
          </div>
          
          <div>
            <Controller
              name="confirmPassword"
              control={controlStep1}
              render={({ field }) => (
                <input {...field} type="password" placeholder="Confirm Password" className={`form-input ${step1Errors.confirmPassword ? "error" : ""}`} />
              )}
            />
            {step1Errors.confirmPassword && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step1Errors.confirmPassword.message}</p>}
          </div>

          <Button
            className="w-full"
            onClick={handleStep1Submit(onStep1Submit)}
            loading={registerStatus === "loading"}
          >
            Continue
          </Button>

          <AppLink href="/auth/login" className="self-end text-sm hover:underline">
            Already have an account? <span className="font-semibold">Login</span>
          </AppLink>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center rounded-md shadow-md bg-blue-100 text-blue-800 p-4">
            <div className="text-5xl">
              <MdOutlineInfo />
            </div>
            <p className="text-sm">
              The department and level field cannot be altered. If you feel they don&apos;t resonate with you <Link href="/#contact" className="text-primary-light-300 dark:text-primary-dark-300 hover:underline">contact us</Link>
            </p>
          </div>
          <div>
            <Controller
              name="matric_number"
              control={controlStep2}
              render={({ field }) => (
                <input {...field} onChange={(e) => {
                  const analysis = analyzeMatricNumber(e.target.value);
                  if (analysis) {
                    setValue("department", analysis.department);
                    setValue("level", analysis.level);
                  }
                  field.onChange(e.target.value);
                }} placeholder="Matric Number" className={`form-input ${step2Errors.matric_number ? "error" : ""}`} />
              )}
            />
            {step2Errors.matric_number && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step2Errors.matric_number.message}</p>}
          </div>
          
          <div>
            <Controller
              name="department"
              control={controlStep2}
              render={({ field }) => (
                <input {...field} placeholder="Department" className={`form-input ${step2Errors.department ? "error" : ""}`} disabled/>
              )}
            />
            {step2Errors.department && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step2Errors.department.message}</p>}
          </div>
          
          <div>
            <Controller
              name="level"
              control={controlStep2}
              render={({ field }) => (
                <input {...field} placeholder="Level" className={`form-input ${step2Errors.level ? "error" : ""}`} disabled/>
              )}
            />
            {step2Errors.level && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{step2Errors.level.message}</p>}
          </div>

          <Button
            className="w-full"
            onClick={handleStep2Submit(onStep2Submit)}
            loading={registerStatus === "loading"}
          >
            Submit
          </Button>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-slate-50 dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
          <div className="flex flex-col items-center">
            <Button
              variant="custom"
              className="flex items-center justify-center gap-[7px] p-3 min-w-[200px] !text-black border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={googleSubmit}
              loading={loading}
              disabled={registerStatus === "loading"}
            >
              <Image src="/google.png" alt="Google logo" width={20} height={20} />
              Sign up with Google
            </Button>
          </div>
        </>
      )}
    </motion.form>
  );
};

export default Register;
