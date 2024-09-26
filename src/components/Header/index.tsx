"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import AppLink from "../AppLink";
import Button from "../Button";
import MenuIcon from "./MenuIcon";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from "framer-motion";
import useTheme from "@/hooks/useTheme";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimationControls();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["transparent", theme == "dark" ? "#27284E" : "#fff"],
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["#fff", theme == "dark" ? "#fff" : "#27284E"],
  );

  const boxShadow = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["", "0 1px 3px 0 rgb(0 0 0 / 0.1)"],
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (typeof window !== "undefined") {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      controls.start("show");
      return;
    }
    controls.start("initialAside");
  }, [controls, isVisible]);

  return (
    <>
      <motion.div
        style={{ backgroundColor, color: textColor, boxShadow }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="desktop-header none fixed w-screen sm:block"
      >
        <div className="container flex justify-between items-center p-4 font-semibold">
          <div className="flex items-center gap-5">
            <AppLink href="/">
              <Image
                src="/favicon.ico"
                alt="Logo image"
                width={25}
                height={25}
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
            <div>{/* Implement color theme */}</div>
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="mobile-header fixed w-screen block sm:none"
      >
        <div className="container p-4 flex justify-between items-center font-semibold">
          <AppLink href="/" className="flex items-center gap-1">
            <Image src="/favicon.ico" alt="Logo image" width={25} height={25} />
            <h1>SchoolarlyQ</h1>
          </AppLink>
          <div className="relative">
            <MenuIcon
              textColor={textColor}
              isVisible={isVisible}
              iconRef={iconRef}
              onClick={() => setIsVisible(!isVisible)}
            />
            <motion.aside
              initial="initialAside"
              variants={{
                show: { y: 30, opacity: 1, pointerEvents: "all" },
                initialAside: {
                  y: 0,
                  x: -150,
                  opacity: 0,
                  pointerEvents: "none",
                },
              }}
              animate={controls}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute w-max flex flex-col justify-between gap-2 p-2 *:px-3 *:py-1 hover:*:bg-gray-300 shadow-md rounded border border-secondary-light-400 text-secondary-light-400 bg-white dark:text-white dark:bg-secondary-dark-100 dark:border-secondary-dark-400"
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
            </motion.aside>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default Header;
