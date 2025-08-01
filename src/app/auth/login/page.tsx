"use client"

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(!email || !password){
      toast.error("All fields are required")
      return;
    }

    try {
      setLoading(true)
      const res = await signIn("credentials", {
        usernameOrEmailOrMatric: email,
        password,
        redirect: false,
      })
      if(res?.error){
        throw new Error("Invalid credentials")
      }
      router.push("/quiz")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Error logging user")
    } finally{
      setLoading(false)
    }
  }

  return (
    <form className="w-[380px] p-4 border border-black rounded-md space-y-6 text-center dark:border-white">
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-300 text-sm font-semibold">Welcome Back!</p>
      </div>
      <div className="flex flex-col gap-4">
         <input type="text" placeholder="Email or Matric Number" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="false"
              placeholder="Password"
              className="form-input"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        <Button className="w-full self-center" loading={loading} onClick={submit}>Submit</Button>
        <AppLink href="/auth/register" className="self-end text-sm hover:underline">
          Don&apos;t have an account? Register
        </AppLink>
      </div>
      {/* <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
      <div className="flex flex-col items-center">
        <Button variant="custom" className="">
          Signup with Google
        </Button>
      </div> */}
    </form>
  );
};
export default Login;
