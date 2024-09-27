"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      <div className="relative bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat h-screen w-full flex items-center">
        <div className="absolute top-0 left-0 w-full h-screen flex justify-between gap-8">
          <motion.div
            animate={{ left: ["100%", 0] }}
            transition={{
              repeat: Infinity,
              duration: 10,
              repeatType: "reverse",
            }}
            className="absolute h-full bg-black/50 w-1"
          ></motion.div>
          <div className="h-full bg-black/50 w-24"></div>
          <div className="h-full bg-black/50 w-2"></div>
          <div className="h-full bg-black/50 w-20"></div>
          <div className="h-full bg-black/50 w-10"></div>
          <div className="h-full bg-black/50 w-20"></div>
          <div className="h-full bg-black/50 w-2"></div>
          <div className="h-full bg-black/50 w-24"></div>
        </div>
        <div className="container z-10 text-white w-full">
          <div className="sm:max-w-[50%] grid gap-8">
            <h1 className="text-5xl font-bold">
              <span className="text-primary-light-400">Schoolarly</span>
              <span className="text-secondary-light-400">Q</span>
            </h1>
            <p className="text-lg">
              Your free and reliable tool to ace your next exam. Available only
              for{" "}
              <span className="text-bold p-1 bg-primary-light-400">
                Bingham students
              </span>
            </p>
            <AppLink href="/auth/register">
              <Button color="orange">Get Started</Button>
            </AppLink>
          </div>
        </div>
      </div>
    </main>
  );
}
