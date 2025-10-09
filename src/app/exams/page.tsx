/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Filter from "./components/Filter";
import { faculties } from "@/data/faculties";
import Button from "@/components/Button";
import { FaSearch } from "react-icons/fa";
import { getExams, getExamSessions } from "@/actions/exam";
import useAction from "@/hooks/useAction";
import ExamCard from "./components/ExamCard";
import { BiFilter } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaX } from "react-icons/fa6";
import useEventOutside from "@/hooks/useEventOutside";
import { motion } from "framer-motion";
import { AppSwal } from "@/config/swal";
import { MdOutlineInfo } from "react-icons/md";
import Link from "next/link";
import { TbAlertTriangle } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step2RegisterSchema as completeProfileSchema } from "@/utils/validators";
import { analyzeMatricNumber } from "@/utils/analyzeMatricNumber";
import toast from "@/utils/toast";
import { updateUser } from "@/actions/user";
import * as yup from "yup";

type completeProfileForm = yup.InferType<typeof completeProfileSchema>;

const Quiz = () => {
  const { data }: { data: any } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const didMountRef = useRef(false);

  const { execute: execUpdateUser, status: updateUserStatus } =
    useAction(updateUser);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<completeProfileForm>({
    resolver: yupResolver(completeProfileSchema),
  });

  const parsedParams: any = {};
  for (const [key, value] of Object.entries(
    Object.fromEntries(searchParams.entries()),
  )) {
    if (key == "q" || key == "sort") {
      parsedParams[key] = value;
    } else {
      parsedParams[key] = value.split(",");
    }
  }
  const [params, setParams] =
    useState<Record<string, string | string[]>>(parsedParams);
  const [search, setSearch] = useState(params.q || "");
  const { execute: execSessions, res: sessionsRes } =
    useAction(getExamSessions);
  const { execute, status, res } = useAction(getExams);
  const exams = res?.data;
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEventOutside(filterRef, () => setFilterOpen(false));

  useEffect(() => {
    execSessions();
  }, [execSessions]);

  useEffect(() => {
    execute(params);
  }, [execute, params]);

  useEffect(() => {
    if (!didMountRef.current) return;
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !(
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        )
      ) {
        query.set(key, String(value).toLowerCase());
      }
    });

    const queryString = query.toString();
    router.push(`?${queryString}`);
  }, [params, router]);

  useEffect(() => {
    const completeProfileSubmit = async (formdata: completeProfileForm) => {
      const res = await execUpdateUser(data.user?.username, {
        matric_number: formdata.matric_number,
        department: formdata.department,
        level: formdata.level,
      });

      if (res?.status === "success") {
        AppSwal.close();
        toast.success("Profile updated successfully");
        setParams({
          levels: [formdata.level.toLowerCase()],
          departments: [formdata.department.toLowerCase()],
          semesters: [
            ((m) =>
              [9, 10, 11, 12, 1, 2].includes(m)
                ? "1"
                : [4, 5, 6, 7, 8].includes(m)
                  ? "2"
                  : "")(new Date().getMonth() + 1),
          ],
        });
      } else {
        toast.error(res?.message || "An error occurred while updating profile");
      }
    };

    if (!didMountRef.current) {
      if (searchParams.size < 1) {
        setParams({
          levels: data?.user.level ? [data.user.level.toLowerCase()] : [],
          departments: data?.user.department
            ? [data.user.department.toLowerCase()]
            : [],
          semesters: [
            ((m) =>
              [9, 10, 11, 12, 1, 2].includes(m)
                ? "1"
                : [4, 5, 6, 7, 8].includes(m)
                  ? "2"
                  : "")(new Date().getMonth() + 1),
          ],
        });
      }
      if (!data?.user?.level || !data?.user?.department) {
        AppSwal.fire({
          showConfirmButton: false,
          html: (
            <form className="flex flex-col gap-4 text-start">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Complete your profile</h1>
                <p className="text-gray-600 text-sm font-semibold dark:text-gray-300">
                  Please provide the following information to get the best
                  experience
                </p>
              </div>
              <div className="flex gap-2 items-center rounded-md shadow-md bg-blue-100 text-blue-800 p-4">
                <div className="text-5xl">
                  <MdOutlineInfo />
                </div>
                <p className="text-sm">
                  The department and level field cannot be altered. If you feel
                  they don&apos;t resonate with you{" "}
                  <Link
                    href="/#contact"
                    className="text-primary-light-300 dark:text-primary-dark-300 hover:underline"
                  >
                    contact us
                  </Link>
                </p>
              </div>
              <div>
                <Controller
                  name="matric_number"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      onChange={(e) => {
                        const analysis = analyzeMatricNumber(e.target.value);
                        if (analysis) {
                          setValue("department", analysis.department);
                          setValue("level", analysis.level);
                        }
                        field.onChange(e.target.value);
                      }}
                      placeholder="Matric Number"
                      className={`form-input ${errors.matric_number ? "error" : ""}`}
                    />
                  )}
                />
                {errors.matric_number && (
                  <p className="text-red-500 text-sm flex gap-1 items-center">
                    <TbAlertTriangle />
                    {errors.matric_number.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Department"
                      className={`form-input ${errors.department ? "error" : ""}`}
                      disabled
                    />
                  )}
                />
                {errors.department && (
                  <p className="text-red-500 text-sm flex gap-1 items-center">
                    <TbAlertTriangle />
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Level"
                      className={`form-input ${errors.level ? "error" : ""}`}
                      disabled
                    />
                  )}
                />
                {errors.level && (
                  <p className="text-red-500 text-sm flex gap-1 items-center">
                    <TbAlertTriangle />
                    {errors.level.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <Button
                  className="w-full md:w-[150px]"
                  onClick={handleSubmit(completeProfileSubmit)}
                  loading={updateUserStatus === "loading"}
                >
                  Submit
                </Button>
              </div>
            </form>
          ),
        });
      }
      didMountRef.current = true;
      return;
    }
  }, [
    router,
    data,
    searchParams,
    control,
    errors,
    handleSubmit,
    updateUserStatus,
    setValue,
    execUpdateUser,
  ]);

  return (
    <main className="mt-8">
      <section className="bg-primary-light-100 md:bg-[url(/banner.png)] md:bg-cover md:text-white h-[300px] dark:bg-primary-dark-100">
        <div className="container py-8">
          <div className="space-y-4 md:max-w-[50%]">
            <p className="text-4xl font-semibold">Browse Past Questions</p>
            <p>
              Search our curated list of past questions from{" "}
              {sessionsRes?.data?.reduce(
                (min: string, curr: string) =>
                  curr.split("/")[0] < min ? curr.split("/")[0] : min,
                sessionsRes?.data?.[0]?.split("/")[0] || "2015",
              )}{" "}
              to date. Take any exam and see instant score with feedbacks as a
              way to ace your next paper.
            </p>
          </div>
        </div>
      </section>
      <section className="container flex gap-10 mt-4">
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: filterOpen ? 0 : -250 }}
          className={`fixed top-0 left-0 z-10 w-[250px] h-screen overflow-y-auto border-r border-r-secondary-light-400 bg-secondary-light-100 basis-2/5 divide-y-[1px] *:py-4 sm:static sm:bg-white sm:!translate-x-0 sm:h-auto sm:overflow-y-visible sm:border-0 *:px-4 sm:*:px-0 dark:bg-secondary-dark-100 dark:sm:bg-[#121212] dark:border-r-secondary-dark-400`}
          ref={filterRef}
        >
          <div className="flex justify-between items-center border-b bg-inherit sticky top-0 sm:static sm:border-0 sm:!pt-0">
            <div>
              <p className="text-2xl font-semibold">Filter</p>
              <p
                onClick={() => {
                  setParams({});
                  setSearch("");
                }}
                className="cursor-pointer w-fit text-sm text-primary-light-300 hover:underline dark:text-primary-dark-300"
              >
                Clear all
              </p>
            </div>
            <FaX
              className="text-xl cursor-pointer text-end sm:hidden"
              onClick={() => setFilterOpen(false)}
            />
          </div>
          <Filter
            data={faculties
              .flatMap((faculty) =>
                faculty.departments.map((dept) => dept.name),
              )
              .sort()}
            checked={params.departments as string[]}
            label="Departments"
            setParams={setParams}
            showSearch
          />
          <Filter
            data={["1", "2"]}
            label="Semesters"
            checked={params.semesters as string[]}
            setParams={setParams}
          />
          <Filter
            data={["IJMB", "100", "200", "300", "400", "500", "600", "700"]}
            checked={params.levels as string[]}
            label="Levels"
            setParams={setParams}
          />
          {sessionsRes?.data && sessionsRes.data.length > 0 && (
            <Filter
              data={sessionsRes?.data}
              checked={params.sessions as string[]}
              label="Sessions"
              setParams={setParams}
            />
          )}
        </motion.div>
        <div className="w-full space-y-8">
          <form
            className="flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setParams({ ...params, q: search });
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="form-input w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="flex gap-2 items-center">
              <FaSearch />
              <p className="hidden sm:block">Search</p>
            </Button>
          </form>
          <div className="flex justify-between items-center sm:hidden">
            <Button
              variant="outlined"
              className="flex items-center gap-2"
              onClick={() => setFilterOpen(true)}
            >
              <BiFilter className="text-2xl" /> Search Filters
            </Button>
            <p
              onClick={() => {
                setParams({});
                setSearch("");
              }}
              className="cursor-pointer w-fit text-sm text-primary-light-300 hover:underline dark:text-primary-dark-300"
            >
              Clear all
            </p>
          </div>
          {exams && (
            <div className="flex justify-between gap-8 items-center font-semibold">
              <p>{exams?.metadata?.total} result(s)</p>
              <div className="flex items-center gap-2">
                <label>Sort by: </label>
                <select
                  className="form-input !w-[180px]"
                  value={(params.sort as string) || "newest"}
                  onChange={(e) =>
                    setParams({ ...params, sort: e.target.value })
                  }
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="asc">Alphabetical (A-Z)</option>
                  <option value="desc">Alphabetical (Z-A)</option>
                </select>
              </div>
            </div>
          )}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {status == "failed" ? (
              <div className="col-span-full text-center space-y-2">
                <p className="text-xl font-semibold">An Error Occured</p>
                <p>{res?.message || "Please reload the page."}</p>
              </div>
            ) : status == "success" ? (
              exams?.data.length < 1 ? (
                <div className="col-span-full text-center space-y-2">
                  <p className="text-xl font-semibold">No results found</p>
                  <p>Please try a different search term.</p>
                </div>
              ) : (
                exams?.data.map(
                  ({
                    course_title,
                    course_code,
                    _id,
                    level,
                    department,
                    semester,
                    session,
                  }: any) => (
                    <ExamCard
                      title={course_title}
                      code={course_code}
                      level={level}
                      department={department}
                      semester={semester}
                      session={session}
                      id={_id}
                      key={_id}
                    />
                  ),
                )
              )
            ) : (
              Array.from({ length: 30 }).map((_, id) => (
                <div
                  className="h-[150px] rounded-md animate-pulse bg-gray-300"
                  key={id}
                />
              ))
            )}
          </div>
          {exams?.metadata?.pages > 1 && (
            <div className="flex justify-center items-center gap-4 *:size-10 *:p-0">
              {params.page && params.page !== "1" && (
                <Button
                  variant="outlined"
                  disabled={status === "loading"}
                  onClick={() =>
                    setParams({
                      ...params,
                      page: String(Number(params.page || "1") - 1),
                    })
                  }
                >
                  <FaChevronLeft className="flex m-auto" />
                </Button>
              )}
              {Array.from({ length: exams?.metadata?.pages }).map((_, i) => (
                <Button
                  key={i}
                  variant={`${!params.page || params.page == String(i + 1) ? "standard" : "outlined"}`}
                >
                  {i + 1}
                </Button>
              ))}
              {params.page &&
                params.page !== String(exams?.metadata?.pages) && (
                  <Button
                    variant="outlined"
                    disabled={status === "loading"}
                    onClick={() =>
                      setParams({
                        ...params,
                        page: String(Number(params.page || "1") + 1),
                      })
                    }
                  >
                    <FaChevronRight className="flex m-auto" />
                  </Button>
                )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Quiz;
