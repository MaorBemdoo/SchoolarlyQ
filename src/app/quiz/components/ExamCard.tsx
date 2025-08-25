/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLink from '@/components/AppLink'
import Button from '@/components/Button'
import React from 'react'

const ExamCard = ({ title, code, level, semester, session, id }: any) => {
  return (
    <div className='p-4 divide-y divide-gray-500 rounded-md bg-primary-light-100 shadow-md dark:bg-primary-dark-100 dark:divide-gray-300'>
      <div className="mb-4">
        <div className='flex justify-between items-center'>
          <p className="text-xs font-mono">{code.split("").join(" ")}</p>
          <p className="text-xs font-mono">E X A M</p>
        </div>
        <p className="font-semibold mt-3 mb-8">{title}</p>
        <p className='text-sm'>{level} Level · {semester}{semester == 1 ? 'st' : semester == 2 ? 'nd' : semester === 3 ? 'rd' : 'th'} Semester · {session} Session</p>
      </div>
      <div className='pt-2 text-end'>
        <AppLink href={`/quiz/${id}`}><Button className='scale-90'>Take</Button></AppLink>
      </div>
    </div>
  )
}

export default ExamCard