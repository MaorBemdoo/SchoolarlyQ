import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import AppLink from "./AppLink";
import Button from "./Button";

const Header = () => {
  return (
    <header className="container flex justify-between items-center p-4 font-semibold">
      <div className="flex items-center gap-5">
        <Image src="/favicon.ico" alt="Logo image" width={25} height={25} />
        <AppLink href="/discover">Discover</AppLink>
        <AppLink href="/about">About</AppLink>
        <AppLink href="#contact">Contact</AppLink>
      </div>
      <div className="flex items-center gap-5">
        <AppLink href="https://github.com/MaorBemdoo/ScoolarlyQ">
          <FaGithub className="text-2xl" />
        </AppLink>
        <AppLink href="/auth/login">
          <Button variant="filled" color="orange">
            Login
          </Button>
        </AppLink>
        <AppLink href="/auth/register">
          <Button variant="outlined" color="orange">
            Register
          </Button>
        </AppLink>
      </div>
    </header>
  );
};
export default Header;
