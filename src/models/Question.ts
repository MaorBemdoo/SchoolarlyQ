import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    type: {type: String, required: true},
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [
        {type: String}
    ],
    correct_answer: {type: String, required: true},
    explanation: {type: String},
    course: {type: String, required: true},
    tags: [
        {type: String}
    ]
}, {timestamps: true})

const Question = mongoose.model("Question", questionSchema)

export default Question