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

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();

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
      <motion.div
        style={{ backgroundColor, color: textColor, boxShadow }}
        className="desktop-header none fixed w-screen z-20 sm:block"
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
            <AppLink href="/discover">Discover</AppLink>
            <AppLink href="/about">About</AppLink>
            <AppLink href="#contact">Contact</AppLink>
          </div>
          <div className="flex items-center gap-5">
            <AppLink href="https://github.com/MaorBemdoo/ScoolarlyQ">
              <FaGithub className="text-2xl" />
            </AppLink>
            <Theme screen="desktop" />
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
          </div>
        </div>
      </motion.div>
      <motion.div
        style={{ backgroundColor, color: textColor, boxShadow }}
        className="mobile-header fixed w-screen block z-20 sm:none"
      >
        <div className="container p-4 flex justify-between items-center font-semibold">
          <AppLink href="/" className="flex items-center gap-1">
            <Image src="/favicon.ico" alt="Logo image" width={50} height={50} />
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
                  className="absolute w-max flex flex-col justify-between gap-2 p-2 *:px-3 *:py-1 hover:*:bg-primary-light-100 shadow-md rounded border border-secondary-light-400 text-secondary-light-400 bg-white dark:text-white dark:bg-secondary-dark-100 dark:border-secondary-dark-400 dark:hover:*:bg-primary-dark-100"
                  ref={menuRef}
                >
                  <AppLink href="/discover">Discover</AppLink>
                  <AppLink href="/about">About</AppLink>
                  <AppLink href="/#contact">Contact</AppLink>
                  <AppLink href="/auth/login">Login</AppLink>
                  <AppLink href="/auth/register" className="!p-0">
                    <Button variant="filled" color="orange">
                      Get Started
                    </Button>
                  </AppLink>
                  <Theme screen="mobile" setMobileIsVisible={setIsVisible} />
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default Header;
