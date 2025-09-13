// import Button from '@/components/Button';
// import React from 'react'

// const Quiz = ({ question, currentQuestion, decoded, timeLeft, selectedAnswer, checkAnswerStatus, handleSubmit, setSelectedAnswer, storedQuiz }) => {
//   return (
//     <>
//         <div className="text-center font-semibold">
//         <span className="text-lg">{currentQuestion}</span>
//         <span className="text-2xl">/{decoded?.questionCount}</span>
//         </div>
//         <div className="p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
//         {question?.question}
//         </div>
//         <div className="space-y-2 p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
//         {decoded.type == "theory" ? (
//             <textarea
//             rows={6}
//             className="resize-none rounded-md shadow-inner form-input"
//             />
//         ) : question?.options ? (
//             question?.options.map((opt: any, i: number) => (
//             <div
//                 className={`border p-2 rounded-md cursor-pointer shadow-inner bg-gray-200 hover:bg-primary-light-100 hover:border-secondary-light-400 dark:bg-inherit dark:hover:bg-primary-dark-100 ${timeLeft <= 0 || selectedAnswer !== null ? "pointer-events-none" : ""} ${decoded.mode == "exam" && selectedAnswer == i ? "bg-primary-light-200 dark:bg-primary-dark-200" : ""} ${!checkAnswerRes?.data?.isCorrect && checkAnswerRes?.data?.ans == opt ? "bg-red-700" : ""} ${checkAnswerRes?.data?.correct_answer == opt ? "bg-green-700 hover:bg-green-700" : ""}`}
//                 onClick={() => {
//                 setSelectedAnswer(i);
//                 }}
//                 key={i}
//             >
//                 {opt}
//             </div>
//             ))
//         ) : (
//             Array.from({ length: 4 }).map((_, i) => (
//             <div
//                 className="border p-2 rounded-md shadow-inner animate-pulse h-[40px] bg-gray-200 dark:bg-inherit"
//                 key={i}
//             />
//             ))
//         )}
//         </div>
//         {checkAnswerStatus == "success" && question?.explanation && (
//         <div
//             className={`collapse collapse-arrow text-white bg-green-700 ring ring-green-800 ${openExplanation ? "collapse-open" : "collapse-close"}`}
//         >
//             <input type="radio" name="accordion" />
//             <div
//             className="px-4 collapse-title font-semibold"
//             onClick={() => setOpenExplanation(!openExplanation)}
//             >
//             Explanation
//             </div>
//             <div className="px-4 collapse-content">
//             {question?.explanation}
//             </div>
//         </div>
//         )}
//         <div className="text-center">
//         <Button
//             className={`${timeLeft <= 0 || checkAnswerStatus == "success" || (decoded?.mode == "study" && selectedAnswer !== null) || (decoded?.mode == "exam" && selectedAnswer !== null && storedQuiz?.currentQuestion == decoded.questionCount) ? "animate-bounce" : ""}`}
//             disabled={checkAnswerStatus == "loading"}
//             onClick={handleSubmit}
//         >
//             {storedQuiz?.currentQuestion == decoded.questionCount
//             ? "Submit"
//             : "Next"}
//         </Button>
//         </div>
//     </>
//   )
// }

// export default Quiz
