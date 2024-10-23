"use client";

import app from "../../package.json";
import Image from "next/image";
import {
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import AppLink from "./AppLink";
import { usePathname } from "next/navigation";
import displayHeaderAndFooter from "@/utils/displayHeaderAndFooter";

const Footer = () => {
  const pathname = usePathname();

  return (
    <>
      {displayHeaderAndFooter(pathname) && (
        <footer className="text-white">
          <Image
            src="/wave.svg"
            alt="wave svg"
            height={300}
            width={100}
            className="w-full select-none"
          />
          <div className="bg-secondary-light-400 py-4">
            <div className="container *:mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-[7px]">
                  <Image src="/favicon.ico" alt="logo" height={50} width={50} />
                  <h2 className="text-2xl font-bold">SchoolarlyQ</h2>
                </div>
                <p className="text-2xl text-slate-500">v{app.version}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Quick Links</h3>
                <AppLink href="/about">About Us</AppLink>
                <AppLink href="/#features">Features</AppLink>
                <AppLink href="/pricing">Pricing</AppLink>
                <AppLink href="/docs">Docs</AppLink>
                <AppLink href="/#faq">FAQ</AppLink>
                <AppLink href="/#contact">Contact Us</AppLink>
              </div>

              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Follow Us</h3>
                <div className="flex space-x-4">
                  <AppLink
                    href="https://x.com/BemdooMaor"
                    className="hover:text-primary-light-300 dark:hover:text-primary-dark-300"
                  >
                    <FaXTwitter size={20} />
                  </AppLink>
                  <AppLink
                    href="https://intagram.com/bemdoomaor"
                    className="hover:text-primary-light-300 dark:hover:text-primary-dark-300"
                  >
                    <FaInstagram size={20} />
                  </AppLink>
                  <AppLink
                    href="https://linkedin.com/in/bemdoo-maor-449698279"
                    className="hover:text-primary-light-300 dark:hover:text-primary-dark-300"
                  >
                    <FaLinkedinIn size={20} />
                  </AppLink>
                  <AppLink
                    href="https://github.com/MaorBemdoo"
                    className="hover:text-primary-light-300 dark:hover:text-primary-dark-300"
                  >
                    <FaGithub size={20} />
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 text-black">
            <div className="container py-4 text-lg text-center">
              © {new Date().getFullYear()} SchoolarlyQ. All rights reserved
            </div>
          </div>
          <div className="bg-secondary-light-400">
            <div className="container py-[5px] text-center">
              Made with 💓 by <b>Bemdoo Maor</b> and <b>Jighjigh Adamu</b>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};
export default Footer;
