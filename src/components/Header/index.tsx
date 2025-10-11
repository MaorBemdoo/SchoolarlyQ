/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import AppLink from "../AppLink";
import Button from "../Button";
import MenuIcon from "./MenuIcon";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import Theme from "./Theme";
import useEventOutside from "@/hooks/useEventOutside";
import { usePathname } from "next/navigation";
import displayHeaderAndFooter from "@/utils/displayHeaderAndFooter";
import { signOut, useSession } from "next-auth/react";
import { FaRegUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const { data, status } = useSession();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.00001],
    ["transparent", resolvedTheme == "dark" ? "#27284E" : "#fff"],
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.00001],
    ["#fff", resolvedTheme == "dark" ? "#fff" : "#27284E"],
  );

  const boxShadow = useTransform(
    scrollYProgress,
    [0, 0.00001],
    ["", "0 1px 3px 0 rgb(0 0 0 / 0.1)"],
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEventOutside([iconRef, menuRef], () => setIsVisible(false));

  return (
    <>
      {displayHeaderAndFooter(pathname) && (
        <>
          <motion.div
            style={
              pathname === "/"
                ? { backgroundColor, color: textColor, boxShadow }
                : {
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    color: "inherit",
                  }
            }
            className={`desktop-header none ${pathname == "/" ? "fixed w-screen" : ""} z-20 sm:block`}
          >
            <div className="container flex justify-between items-center p-4 font-semibold">
              <div className="flex items-center gap-5">
                <AppLink href="/">
                  <Image
                    src="/favicon.ico"
                    alt="Logo image"
                    width={50}
                    height={50}
                  />
                </AppLink>
                <AppLink
                  href="/exams"
                  className={
                    pathname == "/exams"
                      ? "text-primary-light-300 dark:text-primary-dark-300"
                      : ""
                  }
                >
                  Discover
                </AppLink>
                {(data?.user as any)?.role == "admin" && (
                  <AppLink
                    href="/admin"
                    className={
                      pathname.startsWith("/admin")
                        ? "text-primary-light-300 dark:text-primary-dark-300"
                        : ""
                    }
                  >
                    Admin
                  </AppLink>
                )}
              </div>
              <div className="flex items-center gap-5">
                {status == "authenticated" && (
                  <p className="font-normal">
                    Welcome back,{" "}
                    <span className="font-bold">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(data.user as any).full_name.split(" ")[0]}
                    </span>
                  </p>
                )}
                <AppLink href="https://github.com/MaorBemdoo/SchoolarlyQ">
                  <FaGithub className="text-2xl" />
                </AppLink>
                <Theme screen="desktop" />
                {status == "loading" ? (
                  <span className="loading loading-spinner" />
                ) : status == "authenticated" ? (
                  <Button
                    className="flex gap-2 items-center"
                    variant="filled"
                    onClick={() =>
                      signOut({
                        redirectTo: "/auth/login",
                      })
                    }
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <AppLink href="/auth/login">
                      <Button variant="filled" color="orange">
                        Login
                      </Button>
                    </AppLink>
                    <AppLink href="/auth/register">
                      <Button variant="outlined" color="orange">
                        Get Started
                      </Button>
                    </AppLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
          <motion.div
            style={
              pathname === "/"
                ? { backgroundColor, color: textColor, boxShadow }
                : { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", color: "inherit" }
            }
            className={`mobile-header ${pathname == "/" ? "fixed w-screen" : ""} block z-20 sm:none`}
          >
            <div className="container p-4 flex justify-between items-center font-semibold">
              <AppLink href="/" className="flex items-center gap-1">
                <Image
                  src="/favicon.ico"
                  alt="Logo image"
                  width={50}
                  height={50}
                />
                <h1>SchoolarlyQ</h1>
              </AppLink>
              <div className="relative">
                <MenuIcon
                  textColor={textColor}
                  isVisible={isVisible}
                  iconRef={iconRef}
                  onClick={() => setIsVisible(!isVisible)}
                />
                <AnimatePresence>
                  {isVisible && (
                    <motion.aside
                      initial={{
                        y: 0,
                        x: -150,
                        opacity: 0,
                      }}
                      exit={{
                        y: 0,
                        x: -150,
                        opacity: 0,
                      }}
                      animate={{ y: 20, opacity: 1 }}
                      className="absolute w-max z-10 flex flex-col justify-between gap-2 p-2 *:w-full *:px-3 *:py-1 hover:*:bg-primary-light-100 shadow-md rounded border border-secondary-light-400 text-secondary-light-400 bg-white dark:text-white dark:bg-secondary-dark-100 dark:border-secondary-dark-400 dark:hover:*:bg-primary-dark-100"
                      ref={menuRef}
                    >
                      <AppLink
                        href="/exams"
                        onClick={() => setIsVisible(false)}
                        className={
                          pathname == "/exams"
                            ? "text-primary-light-300 dark:text-primary-dark-300"
                            : ""
                        }
                      >
                        Discover
                      </AppLink>
                      {(data?.user as any)?.role == "admin" && (
                        <AppLink
                          href="/admin"
                          onClick={() => setIsVisible(false)}
                          className={
                            pathname.startsWith("/admin")
                              ? "text-primary-light-300 dark:text-primary-dark-300"
                              : ""
                          }
                        >
                          Admin
                        </AppLink>
                      )}
                      {status == "loading" ? (
                        <span className="loading loading-spinner" />
                      ) : status == "authenticated" ? (
                        <>
                          <div className="flex items-center gap-2">
                            <FaRegUserCircle className="text-2xl" />
                            <span className="text-sm">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(data.user as any).full_name}
                            </span>
                          </div>
                          <Button
                            className="flex gap-2 items-center w-full"
                            onClick={() =>
                              signOut({
                                redirectTo: "/auth/login",
                              })
                            }
                          >
                            <BiLogOut className="text-2xl" /> Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <AppLink href="/auth/login">Login</AppLink>
                          <AppLink href="/auth/register" className="!p-0">
                            <Button variant="filled" color="orange">
                              Get Started
                            </Button>
                          </AppLink>
                        </>
                      )}
                      <Theme
                        screen="mobile"
                        setMobileIsVisible={setIsVisible}
                      />
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};
export default Header;
