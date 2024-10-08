"use client";

import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import { motion, useScroll, useVelocity } from "framer-motion";
import { useState, useEffect } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { FaRegFileCode } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
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

const pricingPlans = [
  {
    name: "Basic plan",
    price: 0,
    features: ["Aceess past questions", "View correct answer"],
    button: {
      text: "Get Started",
      to: "/register",
    },
  },
  {
    name: "Pro plan",
    price: 1000,
    features: [
      "Get latest past questions",
      "View explanation to answers",
      "unlimited daily attempts",
      "Download questions",
    ],
    button: {
      text: "Upgrade to Pro",
      to: "/pricing",
    },
  },
];

const faqs = [
  {
    title: "Lorem Ipsum dolor sit amit",
    description: "Lorem Ipsum dolr sit amit. Jyst a doikhwueu98i 98ewqsxxw we0iu98ruuij 0re4uw8ufge 8eg 3u"
  },
  {
    title: "Lorem Ipsum dolor sit amit",
    description: "Lorem Ipsum dolr sit amit. Jyst a doikhwueu98i 98ewqsxxw we0iu98ruuij 0re4uw8ufge 8eg 3u"
  },
  {
    title: "Lorem Ipsum dolor sit amit",
    description: "Lorem Ipsum dolr sit amit. Jyst a doikhwueu98i 98ewqsxxw we0iu98ruuij 0re4uw8ufge 8eg 3u"
  },
]

export default function Home() {
  const { scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollYProgress);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    const unsubscribe = velocity.onChange((latest) => {
      setSpeed(100 + latest * 200);
    });
    return () => unsubscribe();
  }, [velocity]);

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
      <section className="container mt-16">
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
      <section className="container my-16">
        <div className="relative flex items-center justify-between gap-4 px-8 py-16 w-full transition bg-primary-light-100 hover:text-white hover:-rotate-1 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-primary-light-200 before:-rotate-1 before:-z-10 hover:before:bg-secondary-light-400 lg:hover:scale-110 dark:bg-primary-dark-100 dark:hover:text-secondary-dark-100 dark:before:bg-primary-dark-200 dark:hover:before:bg-secondary-dark-400">
          <div>
            <h2 className="text-4xl font-bold mb-4">Begin your learning journey</h2>
            <p className="text-lg">Prepare for exams by practicing with a wide range of past questions and answers from various courses.</p>
          </div>
          <AppLink href="/auth/register"><Button className="whitespace-nowrap">Get Started</Button></AppLink>
        </div>
      </section>
      <div className="w-full p-4 whitespace-nowrap text-white *:inline-block bg-gradient-to-r from-primary-light-300 to-primary-light-400 overflow-hidden dark:from-primary-dark-300 dark:to-primary-dark-400 dark:text-black">
        <motion.div
          style={{ x: speed }}
          animate={{ x: "-100%" }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex items-center justify-center w-max even:*:text-2xl *:uppercase *:font-bold space-x-4 *:inline-block"
        >
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
        </motion.div>
        <motion.div
          style={{ x: speed }}
          animate={{ x: "-100%" }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex items-center justify-between w-max even:*:text-2xl *:uppercase *:font-bold space-x-4 *:inline-block"
        >
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
          <HiSparkles />
          <span>Elevate your learning, Elevate your GPA</span>
        </motion.div>
      </div>
      <section className="container mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Pricing plan</h2>
          <p className="text-lg mt-4">Choose the perfect plan for you</p>
        </div>
        <div className="w-full grid justify-center items-center grid-cols-[repeat(auto-fit,_minmax(200px,_400px))] gap-6">
          {pricingPlans.map(({ name, price, features, button }, idx) => (
            <div
              className={`flex flex-col items-center justify-between h-full w-full mx-auto p-8 border border-black ${idx == 0 ? "bg-primary-light-100 dark:bg-primary-dark-100" : "bg-primary-light-200 dark:bg-primary-dark-200"}`}
              key={idx}
            >
              <p className="font-semibold">{name}</p>
              <h1 className="text-4xl font-bold">
                ₦{price}
                {idx == 1 ? "/month" : ""}
              </h1>
              <ul className="list-image-[url(/check.png)] p-[inherit] m-[inherit]">
                {features.map((feat, idx) => (
                  <li className="w-fit ps-2" key={idx}>
                    {feat}
                  </li>
                ))}
              </ul>
              <AppLink href={button.to}>
                <Button variant="filled">{button.text}</Button>
              </AppLink>
            </div>
          ))}
        </div>
      </section>
      {/* <section>
        Testimonials
      </section> */}
      <section className="container mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Frequently Asked Question</h2>
          <p className="text-lg mt-4">Find questions and answers related to SchoolarlyQ</p>
        </div>
        <div className="max-w-[800px] mx-auto space-y-2">
          {
            faqs.map(({ title, description }, idx) => (
              <div className="group collapse collapse-arrow bg-primary-light-100 dark:bg-primary-dark-100" key={idx}>
                <input type="radio" name="accordion" className="peer"/>
                <div className="px-4 collapse-title text-xl font-medium group-hover:bg-primary-light-200 peer-checked:bg-primary-light-200 dark:group-hover:bg-primary-dark-200 dark:peer-checked:bg-primary-dark-200">{title}</div>
                <div className="px-4 border-t border-t-black collapse-content">
                  <p>{description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </main>
  );
}
