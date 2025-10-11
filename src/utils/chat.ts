import { faculties } from "@/data/faculties";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export  async function askGPT(message: string) {
    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
        ],
        max_tokens: 300,
    });
    return res.choices[0]?.message?.content || "No response";
}

export async function translateExamFile(fileUrl: string) {
    try {
        const response = await client.responses.create({
            model: "gpt-5",
            input: [
            {
                role: "user",
                content: [
                {
                    type: "input_text",
                    text: `Identify the image or file, and make sure it's a past question. If it's not return 'Not a past question'. Now that it's a past question i want you to convert it to this json sample: {exam:{course_title:'',course_code: 'should not conatin space',department:'should match one of ${faculties.map((faculty) => faculty.departments.map((department) => department.name).join(", ")).join(", ")}}',level: 'should match [IJMB, 100, 200, 300, 400, 600, 700]',semester: 'should be either 1 or 2',credit_units: 'should be a number',time_allowed: 'should be a number in minutes',session: 'this format '2011/2012'',type: 'theory' | 'objective',tags: 'should be an array of topics covered in the exam'},questions:[{'question':'',options: [], 'correct_answer': 'if theory give your own answer but if objective it should be one of options','explanation':'give your explanation to why it is the correct answer'}]}. If any field is missing in the image make your best guess but do not leave any field empty. For questions, if it's an objective question make sure to provide options, if it's a theory question do not return options. Make sure the json is valid and can be parsed`,
                },
                {
                    type: "input_file",
                    file_url: fileUrl,
                },
                ],
            },
            ],
        });

        if (response.output_text?.includes("Not a past question")) {
            throw new Error("Not a past question");
        }

        return response.output_text || "No response";
    } catch (error) {
        throw error;
    }
}

