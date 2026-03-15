
import Navbar from '@/Components/Navbar/Navbar'
import Sidebar from '@/Components/Sidebar/Sidebar'
import UserNotifications from '@/Components/Usernotifications/Usernotifications'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
      <Sidebar/>
      <UserNotifications/>
    </div>
  )
}

export default page
