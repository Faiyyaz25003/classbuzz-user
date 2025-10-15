import Attendance from '@/Components/Attendance/Attendance'
import Navbar from '@/Components/Navbar/Navbar'
import Sidebar from '@/Components/Sidebar/Sidebar'
import React from 'react'

const page = () => {
  return (
      <div>
          <Navbar />
          <Sidebar/>
      <Attendance/>
    </div>
  )
}

export default page
