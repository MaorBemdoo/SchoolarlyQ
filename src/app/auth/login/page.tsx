import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { TiUserOutline } from "react-icons/ti";

export const metadata = {
  title: "Login"
}

const Login = () => {
  return (
    <form className="w-[380px] p-4 border border-black rounded-md space-y-6 text-center dark:border-white">
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-300 text-sm font-semibold">Welcome Back!</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center h-[45px] w-full *:h-full">
          <div className="grid place-items-center w-12 p-2 rounded-l-md bg-slate-700 text-white"><TiUserOutline className="text-2xl"/></div>
          <input type="text" className="form-input" />
        </div>
        <div className="flex items-center h-[45px] w-full *:h-full">
          <div className="grid place-items-center w-12 p-2 rounded-l-md bg-slate-700 text-white"><TiUserOutline className="text-2xl"/></div>
          <input type="text" className="form-input" />
        </div>
        <Button className="w-fit">Continue</Button>
        <AppLink href="/auth/register" className="text-right">Don&apos;t have an account? Register</AppLink>
      </div>
      <div className="relative w-full h-[1px] bg-black text-black before:content-['OR'] before:px-2 before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white dark:bg-white dark:text-white dark:before:bg-[#121212]"></div>
      <div className="flex flex-col items-center">
        <Button variant="custom" className="">Signup with Google</Button>
      </div>
    </form>
  );
};
export default Login;
