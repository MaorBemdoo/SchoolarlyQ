"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import { BsMenuButtonWide } from "react-icons/bs";
import { FaRegFileCode } from "react-icons/fa6";
import { ImStatsDots } from "react-icons/im";

const features = [
  {
    title: "Interractive Quizzes",
    description:
      "Engage with our Interactive Quiz feature, designed to make learning fun and dynamic. You can test your knowledge in real-time and receive instant feedback.",
    Icon: ImStatsDots,
  },
  {
    title: "100% Open Source",
    description:
      "Are you a developer looking to contribute to this project? SchoolarlyQ is fully open source with active maintainers and commuinity.",
    link: {
      name: "Go to docs",
      to: "/docs",
    },
    Icon: FaRegFileCode,
  },
  {
    title: "User-friendly Interface",
    description:
      "Intuitive and easy-to-use interface for a seamless quiz-taking experience.",
    Icon: BsMenuButtonWide,
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat h-screen w-full flex items-center">
        <div className="absolute top-0 left-0 w-full h-screen flex justify-between gap-8">
          <motion.div
            animate={{ left: ["calc(100% - 0.25rem)", 0] }}
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
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid gap-8 place-items-center sm:max-w-[50%] sm:place-items-start"
          >
            <h1 className="text-5xl font-bold">
              <span className="text-primary-light-400">Schoolarly</span>
              <span className="text-secondary-light-400">Q</span>
            </h1>
            <p className="text-lg">
              We empower learners with engaging quiz experiences that enhance
              understanding. Available only for{" "}
              <span className="font-bold text-primary-light-300">
                Bingham students
              </span>
              , our quizzes are designed to help students review materials and
              gain a better understanding of the concepts.
            </p>
            <AppLink href="/auth/register">
              <Button color="orange">Get Started</Button>
            </AppLink>
          </motion.div>
        </div>
      </section>
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Key Features</h2>
          <p className="text-lg mt-4">
            Discover our app&apos;s powerful features that enhance your
            experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ title, description, Icon, link }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-4 z-10 p-6 h-full w-full bg-primary-light-100 mx-auto rounded-lg dark:bg-primary-dark-100"
            >
              <div className="flex h-min mt-12">
                <Icon className="text-6xl z-10" />
                <div className="relative -left-9 -top-9 size-20 rounded-full bg-primary-light-300 dark:bg-primary-dark-300"></div>
              </div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="opcaity-80">{description}</p>
              {link && (
                <AppLink
                  href={link.to}
                  className="underline hover:decoration-primary-light-300 dark:hover:decoration-primary-dark-300"
                >
                  {link.name}
                </AppLink>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
