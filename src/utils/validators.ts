/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup"

export const step1RegisterSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const step2RegisterSchema = yup.object({
  matric_number: yup.string().matches(/^\d{2}-\d{4}-\d{4}$/, "Invalid matric number format").required("Matric number is required"),
  department: yup.string().required("Department is required"),
  level: yup.string().required("Level is required"),
});

export const loginSchema = yup.object({
  email: yup.string().required("Email or Matric number is required"),
  password: yup.string().required("Password is required"),
});

export const questionSchema = yup.object().shape({
    question: yup.string().required("Question is required"),
    options: yup.array().of(yup.string()).min(2),
    correct_answer: yup.string().required("Correct answer is required"),
    explanation: yup.string().optional(),
    course: yup.string().required("Course is required"),
});

export const examSchema = yup.object().shape({
    course_title: yup.string().required("Course title is required"),
    course_code: yup.string().required("Course code is required"),
    department: yup.string().required("Department is required"),
    level: yup.string().required("Level is required"),
    semester: yup.number().oneOf([1, 2]).required("Semester is required"),
    credit_units: yup.number().min(1).required("Credit unit is required"),
    time_allowed: yup.number().required("Time allowed is required"),
    session: yup.string().matches(/^\d{4}\/\d{4}$/, "Invalid session format").required("Session is required"),
    type: yup.string().oneOf(["objective", "theory"]).required("Type is required"),
    tags: yup.array().of(yup.string().defined()).default([]).required()
});

export const validate = async <T>(schema: yup.ObjectSchema<any>, data: T) => {
    try {
        await schema.validate(data);
    } catch (error: any) {
        throw new Error(`${error.errors?.join(", ")}`);
    }
};
