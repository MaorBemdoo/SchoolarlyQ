import { redirect } from "next/navigation";

const AuthPage = () => {
  redirect("/auth/login");
  return null;
};

export default AuthPage;
