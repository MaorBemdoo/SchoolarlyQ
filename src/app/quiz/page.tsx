/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Filter from "./components/Filter";
import { faculties } from "@/data/faculties";
import Button from "@/components/Button";
import { FaSearch } from "react-icons/fa";

const Quiz = () => {
  const { data }: {data: any} = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const didMountRef = useRef(false)
  const parsedParams: any = {}
  for (const [key, value] of Object.entries(Object.fromEntries(searchParams.entries()))) {
    if (key == "q") {
      parsedParams[key] = value;
    } else {
      parsedParams[key] = value.split(",");
    }
  }
  const [params, setParams] = useState<Record<string, string | string[]>>(parsedParams)
  const [search, setSearch] = useState(params.q || "")
  console.log(data)

  useEffect(() => {
    if(!didMountRef.current) return;
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !(
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    )) {
        query.set(key, String(value).toLowerCase());
      }
    });

    const queryString = query.toString();
    router.push(`?${queryString}`);
  }, [params, router])

  useEffect(() => {
    if(!didMountRef.current){
      if(searchParams.size < 1){
        setParams({
          levels: [data?.user.level?.toLowerCase()],
          departments: [data?.user.department?.toLowerCase()],
          semesters: [((m => [9,10,11,12,1,2].includes(m) ? "1" : [4,5,6,7,8].includes(m) ? "2" : "")(new Date().getMonth() + 1))]
        })
      }
      didMountRef.current = true
      return;
    };

  }, [router, data, searchParams])

  return (
    <main className="mt-8">
      <section className="bg-primary-light-100 md:bg-[url(/banner.png)] md:bg-cover md:text-white h-[300px] dark:bg-primary-dark-100">
        <div className="container py-8">
          <div className="space-y-4 md:max-w-[50%]">
            <p className="text-4xl font-semibold">Browse Past Questions</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam laborum delectus maxime fugit reprehenderit obcaecati.</p>
          </div>
        </div>
      </section>
      <section className="container flex gap-10 mt-4">
        <div className="basis-2/5 divide-y-[1px] *:py-4">
          <div className="!pt-0">
            <p className="text-2xl font-semibold">Filter</p>
            <p onClick={() => {setParams({}); setSearch("")}} className="cursor-pointer w-fit text-sm text-primary-light-300 hover:underline dark:text-primary-dark-300">Clear all</p>
          </div>
          <Filter data={faculties.flatMap(faculty => faculty.departments.map(dept => dept.name))} checked={params.departments as string[]} label="Departments" setParams={setParams} showSearch/>
          <Filter data={["1", "2"]} label="Semesters" checked={params.semesters as string[]} setParams={setParams}/>
          <Filter data={["IJMB", "100", "200", "300", "400", "500", "600", "700"]} checked={params.levels as string[]} label="Levels" setParams={setParams} />
        </div>
        <div className="w-full">
          <div className="flex gap-4">
            <input type="text" placeholder="Search" className="form-input w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button className="flex gap-2 items-center" onClick={() => setParams({ ...params, q: search })}>
              <FaSearch />
              Search
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Quiz;
