/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLink from '@/components/AppLink'
import Button from '@/components/Button'
import React from 'react'

const ExamCard = ({ title, code, level, semester, session, id }: any) => {
  return (
    <div className='flex flex-col gap-2 justify-between p-4 rounded-md bg-primary-light-100 shadow-md dark:bg-primary-dark-100'>
      <div className="mb-4">
        <div className='flex justify-between items-center'>
          <p className="text-xs font-mono">{code.split("").join(" ")}</p>
          <p className="text-xs font-mono">E X A M</p>
        </div>
        <p className="font-semibold mt-3 mb-8">{title}</p>
      </div>
      <div className='divide-y divide-gray-500 dark:divide-gray-300'>
        <p className='text-sm'>{level} Level · {semester}{semester == 1 ? 'st' : semester == 2 ? 'nd' : semester === 3 ? 'rd' : 'th'} Semester · {session} Session</p>
        <div className='text-end pt-2 mt-2'>
          <AppLink href={`/quiz/${id}`}><Button className='scale-90'>Take</Button></AppLink>
        </div>
      </div>
    </div>
  )
}

export default ExamCard