import React, { useEffect } from 'react'
import Sidebarmenu from './Sidebarmenu'
function Welcome(props) {


 
  return (
    <div className='dashboardcontainer'>


    <Sidebarmenu />


    <div className="marquee-container">
      <div className="marquee-content">
        <p><b>{props.username}</b> Welcome to your Dashboard </p>
      </div>
    </div>






  </div>
    
  )
}

export default Welcome