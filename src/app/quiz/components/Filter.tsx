/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterProps } from '@/types'
import React, { ChangeEvent, useState } from 'react'

const Filter = ({ data, label, setParams, checked = [], showSearch = false }: FilterProps) => {
    const [search, setSearch] = useState("")
    checked = checked.map(val => val?.toString()?.toLowerCase())
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setParams((prev: any) => {
            return {...prev, [label.toLowerCase()]:
                !prev[label.toLowerCase()]?.includes(e.target.value) ? [...checked, e.target.value] : prev[label.toLowerCase()].filter((item: string) => item !== e.target.value)
            }
        })
    }
  return (
    <div>
        <h1 className="text-lg font-semibold mb-2">{label}</h1>
        { showSearch && <input type="text" placeholder={`Find a ${label.slice(0, -1).toLowerCase()}`}className="form-input p-2" value={search} onChange={(e) => setSearch(e.target.value)} />}
        <ul className='mt-2 ps-2 overflow-y-auto max-h-[230px]'>
            {
                data.filter(val => val.toLowerCase().includes(search.toLowerCase())).map((val, id) => (
                    <li className='flex gap-2 cursor-pointer' key={id}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <input type="checkbox" className='rounded-[4px]' checked={checked.includes(val.toLowerCase())} onChange={changeHandler} id={val + id} value={val} />
                        <label htmlFor={val + id}>{val}</label>
                    </li>
                ))
            }
        </ul>
    </div>
  )
}

export default Filter