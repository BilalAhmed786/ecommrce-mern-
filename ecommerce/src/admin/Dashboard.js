import React from 'react'
import Sidebarmenu from './Sidebarmenu'



function Dashboard(props) {


  return (

    <div className='dashboardcontainer'>


      <Sidebarmenu />


      <div className="marquee-container">
        <div className="marquee-content">
          <p><b>{props.user.username}</b> Welcome to your Dashboard </p>
        </div>
      </div>






    </div>
  )
}

export default Dashboard