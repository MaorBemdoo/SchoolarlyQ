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

const Quiz = () => {
  const { data }: { data: any } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const didMountRef = useRef(false);
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
  const { execute: execSessions, res: sessionsRes } = useAction(getExamSessions)
  const { execute, status, res } = useAction(getExams);
  const exams = res?.data;

  useEffect(() => {
    execSessions()
  }, [execSessions])

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
    if (!didMountRef.current) return;
    execute(params);
  }, [execute, params]);

  useEffect(() => {
    if (!didMountRef.current) {
      if (searchParams.size < 1) {
        setParams({
          levels: [data?.user.level?.toLowerCase()],
          departments: [data?.user.department?.toLowerCase()],
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
      didMountRef.current = true;
      return;
    }
  }, [router, data, searchParams]);

  return (
    <main className="mt-8">
      <section className="bg-primary-light-100 md:bg-[url(/banner.png)] md:bg-cover md:text-white h-[300px] dark:bg-primary-dark-100">
        <div className="container py-8">
          <div className="space-y-4 md:max-w-[50%]">
            <p className="text-4xl font-semibold">Browse Past Questions</p>
            <p>
              Search our curated list of past questions from {sessionsRes?.data[sessionsRes.data.length - 1].split("/")[0] || "2015"} to date. Take any exam and see instant score with feedbacks as a way to ace your next paper.
            </p>
          </div>
        </div>
      </section>
      <section className="container flex gap-10 mt-4">
        <div className="basis-2/5 divide-y-[1px] *:py-4">
          <div className="!pt-0">
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
          <Filter
            data={faculties.flatMap((faculty) =>
              faculty.departments.map((dept) => dept.name),
            )}
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
          {
            sessionsRes?.data && (
              <Filter
                data={sessionsRes?.data}
                checked={params.sessions as string[]}
                label="Sessions"
                setParams={setParams}
              />
            )
          }
        </div>
        <div className="w-full space-y-8">
          <form className="flex gap-4" onSubmit={(e) => {
            e.preventDefault();
            setParams({ ...params, q: search })
          }}>
            <input
              type="text"
              placeholder="Search"
              className="form-input w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="flex gap-2 items-center"
            >
              <FaSearch />
              Search
            </Button>
          </form>
          {exams && (
            <div className="flex justify-between gap-8 items-center font-semibold">
              <p>{exams?.metadata?.total} result(s)</p>
              <div className="flex items-center gap-4">
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
              <div>
                <p>An Error Occured</p>
                <p>{res?.message}</p>
              </div>
            ) : status == "success" ? (
              res?.data?.data.map(({ course_title, course_code, _id, level, department, semester, session }: any) => (
                <ExamCard title={course_title} code={course_code} level={level} department={department} semester={semester} session={session} id={_id} key={_id} />
              ))
            ) : (
              Array.from({ length: 12 }).map((_, id) => (
                <div
                  className="h-[200px] rounded-md animate-pulse bg-gray-300"
                  key={id}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Quiz;
