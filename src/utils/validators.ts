/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup"

export const questionSchema = yup.object().shape({
    question: yup.string().required("Question is required"),
    options: yup.array().of(yup.string().required("Option is required")).min(2),
    correct_answer: yup.string().required("Correct answer is required"),
    explanation: yup.string().optional(),
    course: yup.string().required("Course is required"),
});

export const validate = async <T>(schema: yup.ObjectSchema<any>, data: T) => {
    try {
        await schema.validate(data);
    } catch (error: any) {
        throw new Error(`${error.errors?.join(", ")}`);
    }
};
