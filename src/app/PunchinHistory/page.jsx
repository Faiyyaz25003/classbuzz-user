import PunchinHistory from '@/Components/Attendance/PunchinHistory'
import Navbar from '@/Components/Navbar/Navbar'
import Sidebar from '@/Components/Sidebar/Sidebar'
import React from 'react'

const page = () => {
  return (
      <div>
          <Sidebar />
          <Navbar/>
      <PunchinHistory/>
    </div>
  )
}

export default page
