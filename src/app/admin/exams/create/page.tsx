/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { faculties } from "@/data/faculties";
import { examSchema, questionSchema } from "@/utils/validators";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useLocalStorage } from "react-use";
import useAction from "@/hooks/useAction";
import { createExamAndQuestions } from "@/actions/exam";
import toast from "@/utils/toast";
import { AppSwal } from "@/config/swal";
import { TbAlertTriangle } from "react-icons/tb";

type Question = {
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
};

type ExamForm = yup.InferType<typeof examSchema>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type QuestionForm = yup.InferType<typeof questionSchema>;

const CreateQuestionsPage = () => {
  const [savedProgress, setSavedProgress] = useLocalStorage<any>("examFormProgress");
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ExamForm>({
    resolver: yupResolver(examSchema),
    defaultValues: {
      course_title: savedProgress?.exam?.course_title || "",
      course_code: savedProgress?.exam?.course_code || "",
      department: savedProgress?.exam?.department || "",
      level: savedProgress?.exam?.level || "",
      semester: savedProgress?.exam?.semester,
      credit_units: savedProgress?.exam?.credit_units,
      time_allowed: savedProgress?.exam?.time_allowed,
      session: savedProgress?.exam?.session || "",
      type: savedProgress?.exam?.type || "objective",
      tags: savedProgress?.exam?.tags ?? [],
    },
  });
  const { execute, status } = useAction(createExamAndQuestions);

  const type = watch("type");
  const newQuestion = type === "objective" ? { question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" } : { question: "", correct_answer: "", explanation: "" };

  const {
    control: controlQuestions,
    watch: watchQuestions,
    handleSubmit: handleQuestionsSubmit,
    reset: resetQuestions,
    getValues: getQuestionsValues,
    formState: { errors: questionErrors, isValid: isQuestionsValid }
  } = useForm<{ questions: Question[]}>({
    defaultValues: {
      questions: savedProgress?.questions || [newQuestion]
    }
  })

  const questions = watchQuestions("questions")

  const { fields, append } = useFieldArray({
    control: controlQuestions,
    name: "questions",
  });

  const [tagsInput, setTagsInput] = useState("");
  useEffect(() => {
    const currentTags = getValues("tags");
    setTagsInput(Array.isArray(currentTags) ? currentTags.join(", ") : "");
  }, [getValues, watch]);

useEffect(() => {
  const subscription = watch((formValues) => {
    setSavedProgress({
      exam: formValues,
      questions: getQuestionsValues().questions.map((q) => ({
        ...q,
        options: formValues.type === "objective" ? q?.options : undefined
      })),
    });
  });

  return () => subscription.unsubscribe();
}, [watch, getQuestionsValues, setSavedProgress]);


useEffect(() => {
  const subscription = watchQuestions((formValues) => {
    setSavedProgress((prev: any) => ({
      exam: prev?.exam || getValues(),
      questions: formValues.questions,
    }));
  })

  return () => subscription.unsubscribe();
}, [setSavedProgress, getValues, watchQuestions]);



  const addQuestion = () => {
    append(newQuestion);
  };

  const onSubmit = async (data: any) => {
    await handleQuestionsSubmit(() => true)();
    if (!isQuestionsValid) {
      return;
    }

    AppSwal.fire({
      text: "Are you sure you want to create this exam and its questions?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await execute(data, questions);
        if (res?.status === "success") {
          reset({
            course_title: "",
            course_code: "",
            department: "",
            level: "",
            semester: undefined,
            credit_units: 0,
            time_allowed: 0,
            session: "",
            type:  "objective",
            tags: [],
          });
          reset();
          resetQuestions({
            questions: [{ question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" }]
          })
          setSavedProgress(null)
          toast.success("Exam and questions added successfully");
        } else {
          toast.error(res?.message || "Error creating exam and questions");
        }
      }
    });
    
};


  return (
    <main className="container max-w-[900px] mt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Add Past Questions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the exam details, then add one or more questions.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold">Exam Details</h2>

          <div className="space-y-2">
            <label className="font-semibold">Course Title*</label>
            <Controller
              name="course_title"
              control={control}
              render={({ field }) => (
                <input {...field} className={`form-input ${errors.course_title ? "error" : ""}`} placeholder="Introduction to Computer Science" />
              )}
            />
            {errors.course_title && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.course_title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Course Code*</label>
            <Controller
              name="course_code"
              control={control}
              render={({ field }) => (
                <input {...field} className={`form-input ${errors.course_code ? "error" : ""}`} placeholder="CSC101" />
              )}
            />
            {errors.course_code && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.course_code.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Department*</label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <select {...field} className={`form-input dark:*:text-black ${errors.department ? "error" : ""}`}>
                  <option value="">Select Department</option>
                  {faculties.map(({ faculty, departments }) => (
                    <optgroup key={faculty} label={faculty}>
                      {departments.map(({ id, name }) => (
                        <option key={id} value={name}>
                          {name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            />
            {errors.department && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.department.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-semibold">Level*</label>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`form-input dark:*:text-black ${errors.level ? "error" : ""}`}>
                    <option value="">Select Level</option>
                    {["IJMB", "100", "200", "300", "400", "500", "600", "700"].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.level && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.level.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Semester*</label>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`form-input dark:*:text-black ${errors.semester ? "error" : ""}`}>
                    <option value="">Select Semester</option>
                    <option value={1}>First Semester</option>
                    <option value={2}>Second Semester</option>
                  </select>
                )}
              />
              {errors.semester && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.semester.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-semibold">Credit Unit*</label>
              <Controller
                name="credit_units"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className={`form-input ${errors.credit_units ? "error" : ""}`} placeholder="e.g. 3" />
                )}
              />
              {errors.credit_units && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.credit_units.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Time Allowed (minutes)*</label>
              <Controller
                name="time_allowed"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className={`form-input ${errors.time_allowed ? "error" : ""}`} placeholder="e.g. 60" />
                )}
              />
              {errors.time_allowed && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.time_allowed.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-semibold">Session*</label>
              <Controller
                name="session"
                control={control}
                render={({ field }) => (
                  <input {...field} className={`form-input ${errors.session ? "error" : ""}`} placeholder="e.g. 2023/2024" />
                )}
              />
              {errors.session && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{errors.session.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Type*</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`form-input dark:*:text-black ${errors.type ? "error" : ""}`}>
                    <option value="objective">Objective</option>
                    <option value="theory">Theory</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Tags (optional)</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`form-input ${errors.tags ? "error" : ""}`}
                  placeholder="variables, oop"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                  }}
                  onBlur={() => {
                    const tagsArray = tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0);

                    field.onChange(tagsArray);
                  }}
                />
              )}
            />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold">Questions</h2>

          {fields.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4 p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-lg">Question {qIndex + 1}</h3>

              <div className="space-y-2">
                <label className="font-semibold">Question*</label>
                <Controller
                  name={`questions.${qIndex}.question`}
                  rules={{
                    required: "Question is required"
                  }}
                  control={controlQuestions}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className={`form-input ${questionErrors.questions?.[qIndex]?.question ? "error" : ""} min-h-[100px]`}
                      placeholder="What is the time complexity of binary search?"
                    />
                  )}
                />
                {questionErrors.questions?.[qIndex]?.question && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{questionErrors.questions[qIndex].question?.message}</p>}
              </div>

              {
                watch("type") === "objective" && (
                  <div className="space-y-2">
                    <label className="font-semibold">Options*</label>
                    <div className="grid gap-2">
                      {(q.options ?? ["", "", "", ""]).map((opt, optIndex) => (
                          <Controller
                          key={optIndex}
                          name={`questions.${qIndex}.options.${optIndex}`}
                          control={controlQuestions}
                          render={({ field }) => (
                            <input {...field} className="form-input" placeholder={`Option ${optIndex + 1}`} />
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )
              }

              <div className="space-y-2">
                <label className="font-semibold">Correct Answer*</label>
                <Controller
                  name={`questions.${qIndex}.correct_answer`}
                  rules={{
                    required: "Correct answer is required"
                  }}
                  control={controlQuestions}
                  render={({ field }) => (
                    <input {...field} className={`form-input ${questionErrors.questions?.[qIndex]?.correct_answer ? "error" : ""}`} placeholder="Correct answer" />
                  )}
                />
                {questionErrors.questions?.[qIndex]?.correct_answer && <p className="text-red-500 text-sm flex gap-1 items-center"><TbAlertTriangle />{questionErrors.questions[qIndex].correct_answer?.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-semibold">Explanation (optional)</label>
                <Controller
                  name={`questions.${qIndex}.explanation`}
                  control={controlQuestions}
                  render={({ field }) => (
                    <textarea {...field} className="form-input min-h-[80px]" placeholder="Explain the answer" />
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            variant="custom"
            className="w-full bg-gray-200 !text-black hover:bg-gray-300 dark:bg-gray-700 dark:!text-white"
            onClick={handleQuestionsSubmit(addQuestion)}
          >
            + Add Another Question
          </Button>
        </section>

        <div className="pt-4">
          <Button className="w-full" loading={status === "loading"}>
            Save Exam & Questions
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CreateQuestionsPage;
