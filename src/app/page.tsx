"use client";

import { sendEmail } from "@/actions/sendEmail";
import AppLink from "@/components/AppLink";
import Button from "@/components/Button";
import useAction from "@/hooks/useAction";
import toast from "@/utils/toast";
import { motion, useScroll, useVelocity } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsMenuButtonWide } from "react-icons/bs";
import { FaRegFileCode } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import { TbAlertTriangle } from "react-icons/tb";

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

const faqs = [
  {
    title: "Who can use SchoolarlyQ?",
    description:
      "SchoolarlyQ is available exclusively for Bingham students. You need a valid Bingham email to register and access quizzes.",
  },
  {
    title: "Is SchoolarlyQ free to use?",
    description:
      "Yes! SchoolarlyQ is completely free for all Bingham students. There are no hidden charges or subscription fees.",
  },
  {
    title: "Can I contribute to SchoolarlyQ?",
    description:
      "Absolutely! SchoolarlyQ is open source. Developers and contributors are welcome to check out our documentation and contribute on GitHub.",
  },
  {
    title: "What quiz modes are available?",
    description:
      "You can choose between Study Mode for instant feedback and explanations, or Exam Mode for a timed, realistic exam experience.",
  },
  {
    title: "How do I contact support?",
    description:
      "Use the contact form at the bottom of this page to send us a message. We’ll get back to you as soon as possible.",
  },
];

export default function Home() {
  const { execute, status } = useAction(sendEmail);
  const { scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollYProgress);
  const [speed, setSpeed] = useState(100);
  const { data } = useSession()
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const unsubscribe = velocity.onChange((latest) => {
      setSpeed(100 + latest * 200);
    });
    return () => unsubscribe();
  }, [velocity]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    values: {
      email: "",
      message: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const res = await execute({
      from: data.email,
      subject: "New message from SchoolarlyQ Contact form",
      text: data.message,
    });
    if (res.status == "failed") {
      toast.error(res.message || "Error sending message");
      return;
    }
    setValue("email", "");
    setValue("message", "");
    toast.success("Message sent successfully");
  };

  return (
    <main>
      <section
        className="relative bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat h-screen w-full flex items-center"
        id="hero"
      >
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
            <AppLink href={ data ? "/exams" : "/auth/register" }>
              <Button color="orange">{ data ? "Explore Exams" : "Get Started" }</Button>
            </AppLink>
          </motion.div>
        </div>
      </section>
      <section className="container mt-16" id="features">
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
      <section className="container my-16" id="cta">
        <div className="relative rounded flex items-center justify-between gap-4 px-8 py-16 w-full transition bg-primary-light-100 hover:text-white hover:-rotate-1 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded before:bg-primary-light-200 before:-rotate-1 before:-z-10 hover:before:bg-secondary-light-400 lg:hover:scale-110 dark:bg-primary-dark-100 dark:hover:text-secondary-dark-100 dark:before:bg-primary-dark-200 dark:hover:before:bg-secondary-dark-400">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Begin your learning journey
            </h2>
            <p className="text-lg">
              Prepare for exams by practicing with a wide range of past
              questions and answers from various courses.
            </p>
          </div>
          <AppLink href="/auth/register">
            <Button className="whitespace-nowrap">Get Started</Button>
          </AppLink>
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
      <section className="container mt-16" id="modes">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Quiz Modes</h2>
          <p className="text-lg mt-4">
        Choose from different quiz modes to suit your learning style and preferences.
          </p>
        </div>
        <div className="tabs tabs-lift md:items-start md:grid-rows-8 md:grid-cols-[max-content] * [input]-*:whitespace-nowrap *:rounded-none w-full max-w-[800px] mx-auto">
          <input type="radio" name="quiz_modes_tabs" className="tab h-full !bg-[image:none] !text-inherit hover:!bg-primary-light-100 focus:!bg-primary-light-200 checked:!bg-primary-light-200 dark:!bg-primary-dark-100 dark:hover:!bg-primary-dark-200 dark:focus:!bg-primary-dark-200 dark:checked:!bg-primary-dark-200" aria-label="Study Mode" defaultChecked />
            <div className="tab-content md:col-[2] md:row-span-full bg-primary-light-100 p-6">
              <h3 className="text-2xl font-semibold mb-2">Study Mode</h3>
              <p>
                Practice at your own pace with instant feedback and detailed explanations for each question.
                In Study Mode, you can review questions, see correct answers immediately, and learn from your mistakes without any time pressure.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-1">
                <li>Receive step-by-step explanations for every answer</li>
                <li>Pause and resume quizzes whenever you want</li>
                <li>Track your progress and revisit incorrect questions</li>
                <li>Perfect for revision and concept reinforcement</li>
              </ul>
            </div>
            <input type="radio" name="quiz_modes_tabs" className="tab h-full md:col-[1] md:row-[2] !bg-[image:none] !text-inherit hover:!bg-primary-light-100 focus:!bg-primary-light-200 checked:!bg-primary-light-200 dark:!bg-primary-dark-100 dark:hover:!bg-primary-dark-200 dark:focus:!bg-primary-dark-200 dark:checked:!bg-primary-dark-200" aria-label="Exam Mode" />
            <div className="tab-content md:col-[2] md:row-span-full bg-primary-light-100 p-6">
              <h3 className="text-2xl font-semibold mb-2">Exam Mode</h3>
              <p>
                Simulate real exam conditions with timed quizzes and no interruptions.
                Exam Mode helps you prepare for actual test scenarios by limiting access to hints and explanations until the quiz is completed.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-1">
                <li>Timed quizzes to mirror real exam pressure</li>
                <li>No instant feedback—answers revealed after submission</li>
                <li>Score breakdown and performance analytics at the end</li>
                <li>Ideal for self-assessment and exam readiness</li>
              </ul>
            </div>
        </div>
      </section>
      {/* <section>
        Testimonials
      </section> */}
      <section className="container mt-16" id="faq">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Frequently Asked Question</h2>
          <p className="text-lg mt-4">
            Find questions and answers related to SchoolarlyQ
          </p>
        </div>
        <div className="max-w-[800px] mx-auto space-y-2">
          {faqs.map(({ title, description }, idx) => (
              <div
                className={`group collapse collapse-arrow bg-primary-light-100 dark:bg-primary-dark-100`}
                key={idx}
              >
                <input type="radio" name="accordion" className="peer" checked={open === idx} />
                <div className="px-4 collapse-title text-lg font-medium group-hover:bg-primary-light-200 peer-checked:bg-primary-light-200 dark:group-hover:bg-primary-dark-200 dark:peer-checked:bg-primary-dark-200" onClick={() => setOpen(idx)}>
                  {title}
                </div>
                <div className="px-4 border-t border-t-black collapse-content">
                  <p>{description}</p>
                </div>
              </div>
          ))}
        </div>
      </section>
      <section className="container mt-16" id="contact">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Contact Us</h2>
          <p className="text-lg mt-4">Get in touch with us today!</p>
        </div>
        <form className="space-y-6 max-w-[800px] mx-auto">
          <div className="space-y-2">
            <label className="font-semibold">Email*</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  message: "Invalid email address",
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="you@example.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex gap-1 items-center">
                <TbAlertTriangle />
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-semibold">Message*</label>
            <Controller
              name="message"
              control={control}
              rules={{
                required: "Message is required",
                validate: (value) =>
                  value.trim() !== "" || "Message is required",
              }}
              render={({ field }) => (
                <textarea
                  rows={6}
                  {...field}
                  className={`form-input resize-none ${errors.message ? "error" : ""}`}
                  placeholder="Your message here..."
                />
              )}
            />
            {errors.message && (
              <p className="text-red-500 text-sm flex gap-1 items-center">
                <TbAlertTriangle />
                {errors.message.message}
              </p>
            )}
          </div>
          <div className="text-center">
            <Button
              onClick={handleSubmit(onSubmit)}
              loading={status === "loading"}
              className="w-[100px]"
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
