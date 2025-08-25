import React from 'react'

const ExamCard = ({ title, code }) => {
  return (
    <div className='p-4 rounded-md bg-primary-light-100 shadow-md'>
      {title} {code}
    </div>
  )
}

export default ExamCard