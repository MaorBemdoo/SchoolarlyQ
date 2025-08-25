/* eslint-disable @typescript-eslint/no-explicit-any */
import Exam from "@/models/Exam";

export const examRepository = {
  async find(filter: any) {
    const query: any = {};

    if (filter.levels && filter.levels.length > 0) {
      query.level = { $in: filter.levels };
    }

    if (filter.departments && filter.departments.length > 0) {
      query.department = { $in: filter.departments };
    }

    if (filter.semesters && filter.semesters.length > 0) {
      query.semester = { $in: filter.semesters };
    }

    if (filter.q) {
      query.$or = [
        { course_title: new RegExp(filter.q, "i") },
        { course_code: new RegExp(filter.q, "i") },
      ];
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (filter?.sort === "oldest") sort = { createdAt: 1 };
    else if (filter?.sort === "asc") sort = { course_code: 1 };
    else if (filter?.sort === "desc") sort = { course_code: -1 };

    return Exam.find(query).sort(sort);
  },

  async findById(id: string) {
    return Exam.findById(id);
  },

  async create(exam: any) {
    return Exam.create(exam);
  },
};
